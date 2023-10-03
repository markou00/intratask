// This file extension must be mts because "@xenova/transformers" uses es modules

import { pipeline } from "@xenova/transformers";
import axios from "axios";
import { prisma } from "../shared/prisma.js";

/**
 * Get all the tickets from Zendesk which was created after 2021.
 * For some reason Zendesk API still returns tickets which was created before
 * the specified date. Therefore the function will iterate over the data and
 * make sure to return only the tickets created after 2021.
 *
 * @returns An array containing ticket objects
 */
export const requestTickets = async () => {
  const email_address = process.env.ZENDESK_EMAIL_ADDRESS;
  const api_token = process.env.ZENDESK_API_TOKEN;
  const subdomain = process.env.ZENDESK_SUBDOMAIN;

  // Request all tickets created from 2021 (1609459200)
  let url = `https://${subdomain}.zendesk.com/api/v2/incremental/tickets.json?start_time=1609459200`;

  const headers = {
    Authorization: `Basic ${Buffer.from(
      `${email_address}/token:${api_token}`
    ).toString("base64")}`,
    Accept: "application/json",
  };

  let allTickets = [];
  let prevUrl = "";

  // this is necessary due to Zendesk returning only 1000 tickets per request.
  // the loop will keep requesting the url to the next 1000 tickets until
  // the url is constant which means there is no more tickets.
  while (url) {
    const response = await axios.get(url, { headers });
    const data = response.data;

    if (url === data.next_page || url === prevUrl) {
      // Break the loop if the next_page URL is the same as the current URL or the previous URL
      break;
    }

    // Filter the tickets from the current request
    const filteredTickets = data.tickets.filter((ticket) => {
      return (
        new Date(ticket.created_at) >= new Date("2021-01-01T00:00:00.000Z")
      );
    });

    allTickets = allTickets.concat(filteredTickets);

    // to keep track of how many tickets have been fetched
    console.log(allTickets.length);

    prevUrl = url;
    url = data.next_page;
  }

  return allTickets;
};

/**
 * Filters the given tickets to return only the tickets which includes
 * the specified tags in them.
 *
 * @param tickets An array containing ticket objects
 * @returns An array containing ticket objects with the required filter
 */
export const filterTickets = (tickets) =>
  tickets.filter((ticket) =>
    ticket.tags.some((tag) =>
      [
        "a_-_driftsstans/kritisk_feil",
        "b_-_alvorlig_feil/mangel",
        "c_-_mindre_feil/mangel",
      ].includes(tag)
    )
  );

/**
 * Create embeddings of the description field of the given tickets
 *
 * @param tickets An array containing ticket objects
 * @returns An array containing ticket objects with additional field descriptionVector which contains the embeddings
 */
export const createDescriptionEmbeddings = async (tickets) => {
  // Initialize the generateEmbeddings pipeline
  const generateEmbeddings = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );

  // Generate embeddings for the description of each ticket
  for (let ticket of tickets) {
    const { data } = await generateEmbeddings(ticket.description, {
      pooling: "mean",
      normalize: true,
    });

    // convert the embeddings object into a string[]
    const vector = Object.values(data).map((value) => value.toString());

    ticket.descriptionVector = vector;
  }

  return tickets;
};

/**
 * Given an array of tickets, inserts the tickets in the database. If a
 * ticket already exists in the database, the tickets will be skipped.
 *
 * @param tickets
 */
export const insertInitialData = async (tickets) => {
  let recordCounter = 0;

  for (const ticket of tickets) {
    // Check if a Ticket with the same id already exists
    // This important because Zendesk sometimes return duplicated tickets
    /**
     * TODO: Since this function is only used in the context of initialization, instead of checking for duplicated tickets by sending a request to the DB, check the array of fetched tickets from Zendesk. This can save some time while initializing the app.
     *
     */
    const existingTicket = await prisma.ticket.findUnique({
      where: {
        id: ticket.id,
      },
    });

    // If the Ticket already exists, skip to the next iteration
    if (existingTicket) {
      console.log(`Ticket with id ${ticket.id} already exists.`);
      continue;
    }

    // First, create the Ticket record. This MUST be created first
    const createdTicket = await prisma.ticket.create({
      data: {
        id: ticket.id,
        createdAt: new Date(ticket.created_at),
        subject: ticket.subject,
        description: ticket.description,
        status: ticket.status,
      },
    });

    // Increment the counter for each Ticket record created
    recordCounter += 1;

    // Next, create the associated Tag records
    await prisma.tag.createMany({
      data: ticket.tags.map((tagName) => ({
        name: tagName,
        ticketId: createdTicket.id,
      })),
    });

    // Finally, create the associated DescriptionVector records
    await prisma.descriptionVector.createMany({
      data: ticket.descriptionVector.map((value) => ({
        vectorValue: value,
        ticketId: createdTicket.id,
      })),
    });

    // Check if the counter is a multiple of 1000 and log to the console
    // To keep track of how many tickets have been inserted in the DB
    if (recordCounter % 1000 === 0) {
      console.log(`${recordCounter} records have been inserted.`);
    }
  }
};

/**
 * Calculates the dot product of two arrays of strings representing numbers.
 *
 * This function takes in two arrays of strings, converts each string to a number, and then computes the dot product.
 * Both arrays must have the same length, and all strings in the arrays must be convertible to valid numbers.
 *
 * @function
 * @param {string[]} a - The first array of strings representing numbers.
 * @param {string[]} b - The second array of strings representing numbers.
 * @returns {number} - The dot product of the two arrays.
 * @throws {Error} - Throws an error if the two arrays have different lengths.
 * @throws {Error} - Throws an error if any string in the arrays cannot be converted to a valid number.
 */
function dotProduct(a: string[], b: string[]) {
  if (a.length !== b.length) {
    throw new Error("Both arguments must have the same length");
  }

  let result = 0;

  for (let i = 0; i < a.length; i++) {
    const numA = parseFloat(a[i]);
    const numB = parseFloat(b[i]);

    if (isNaN(numA) || isNaN(numB)) {
      throw new Error("Invalid number in input arrays");
    }

    result += numA * numB;
  }

  return result;
}

/**
 * Finds and groups similar tickets based on their description vectors.
 *
 * This function compares the description vectors of each ticket with every other ticket in the list.
 * If the dot product of the vectors is greater than or equal to a predefined threshold, the tickets are considered similar.
 * The function returns a map where each key is a ticket and the value is an array of tickets that are similar to the key ticket.
 * The function ensures that each ticket appears only once in the map and that each group of similar tickets contains at least 20 tickets.
 *
 * @function
 * @export
 * @param {Array<Object>} tickets - An array of ticket objects. Each ticket object should have a `descriptionVector` property which is an array of objects with a `vectorValue` property.
 * @returns {Map<Object, Array<Object>>} - A map where the key is a ticket and the value is an array of tickets that are similar to the key ticket. Only groups with 20 or more similar tickets are included in the map.
 */
export const findSimilarTickets = (tickets) => {
  // This threshold is based on experiments done on the dataset.
  const threshold = 0.77;

  // Create a map to hold similar tickets for each ticket
  const similarTicketsMap = new Map();

  // Create a set to keep track of tickets that have been added to the map
  const addedTickets = new Set();

  for (let i = 0; i < tickets.length; i++) {
    const ticketA = tickets[i];
    const vectorA = ticketA.descriptionVector.map(
      (object) => object.vectorValue
    );

    // Skip this iteration if ticketA has already been added to the map
    if (addedTickets.has(ticketA)) {
      continue;
    }

    // Initialize an entry in the map for ticketA
    similarTicketsMap.set(ticketA, []);

    for (let j = i + 1; j < tickets.length; j++) {
      const ticketB = tickets[j];
      const vectorB = ticketB.descriptionVector.map(
        (object) => object.vectorValue
      );

      const dotProductValue = dotProduct(vectorA, vectorB);

      if (dotProductValue >= threshold) {
        // Get the current similar tickets array for ticketA from the map
        const similarTickets = similarTicketsMap.get(ticketA);

        // Skip this iteration if ticketB has already been added to the map
        if (addedTickets.has(ticketB)) {
          continue;
        }

        // Add the new similar ticket to the array
        similarTickets.push({
          ticketB,
        });

        // Update the map with the new array
        similarTicketsMap.set(ticketA, similarTickets);

        // Add ticketB to addedTickets set
        addedTickets.add(ticketB);

        // Check if similarTickets has 20 or more entries
        if (similarTickets.length >= 20) {
          // Break out of the inner loop as there's no need to continue comparing ticketA with ticketB
          break;
        }
      }
    }
  }

  // delete all entries with fewer than 20 items
  for (const [key, similarTickets] of similarTicketsMap) {
    if (similarTickets.length < 20) {
      similarTicketsMap.delete(key);
    }
  }

  return similarTicketsMap;
};
