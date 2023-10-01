// This file extension must be mts because "@xenova/transformers" uses es modules

import { pipeline } from "@xenova/transformers";
import axios from "axios";

/**
 * Get all the tickets from Zendesk which was created after 2020.
 *
 * @returns An array containing ticket objects
 */
export const requestTickets = async () => {
  const email_address = process.env.ZENDESK_EMAIL_ADDRESS;
  const api_token = process.env.ZENDESK_API_TOKEN;
  const subdomain = process.env.ZENDESK_SUBDOMAIN;

  // Request all tickets created from 2020 (1577836800)
  let url = `https://${subdomain}.zendesk.com/api/v2/incremental/tickets.json?start_time=1577836800`;

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

    allTickets = allTickets.concat(data.tickets);
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
