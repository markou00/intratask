// This file extension must be mts because "@xenova/transformers" uses es modules

import { pipeline } from "@xenova/transformers";
import axios from "axios";
import { prisma } from "../shared/prisma.js";

/**
 * Get all the tickets from Zendesk which was created after 2021.
 * For some reason Zendesk API still returns tickets which was created before
 * the specified data. Therefore the function will iterate over the data and
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
