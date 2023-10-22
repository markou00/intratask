import prisma from "lib/prisma";
import {
  createDescriptionEmbeddings,
  filterTickets,
  findSimilarTickets,
  insertDeviationAndUpdateTickets,
  insertInitialData,
  requestTickets,
} from "utils/initialize";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Initializes the application by populating the database with tickets and deviations.
 * This function performs the following steps:
 * 1. Checks if the database is empty.
 * 2. Fetches tickets created after 2021.
 * 3. Filters tickets based on specified tags.
 * 4. Generates embeddings for ticket descriptions.
 * 5. Inserts tickets into the database.
 * 6. Finds deviations based on the filtered data.
 * 7. Inserts generated deviations and updates relevant tickets.
 *
 * This route is intended to be used in a development environment **ONLY**.
 * The process will take way too long so running this in prod will time-out.
 *
 * @function
 * @async
 * @param {NextApiRequest} req - The Next.js API request object.
 * @param {NextApiResponse} res - The Next.js API response object.
 * @returns {Promise<void>} A promise that resolves when the function completes.
 * @throws Will throw an error if any step in the initialization process fails.
 */
export default async function initialize(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (process.env.NODE_ENV !== "development") {
      return res
        .status(403)
        .json({ error: "This route is only for development purposes." });
    }

    // 1. Check if the database is empty
    const existingTicketsCount = await prisma.ticket.count();
    if (existingTicketsCount > 0) {
      console.log("Database is not empty. Aborting data initialization.");
      return res.status(400).json({
        message: "Database is not empty. Aborting data initialization.",
      });
    }

    // 2. Get all the tickets which was created after 2021
    const allTickets = await requestTickets();
    console.warn("Tickets have been fetched successfully");

    // 3. Filter the tickets based on the specified tags
    const filteredTickets = filterTickets(allTickets);
    console.warn("Tickets have been filtered");

    // 4. Generate embeddings of the tickets' descriptions
    const filteredTicketsWithEmbeddings = await createDescriptionEmbeddings(
      filteredTickets
    );
    console.warn("Embeddings was generated successfully");

    // 5. insert the tickets in the DB
    await insertInitialData(filteredTicketsWithEmbeddings);
    console.warn("Tickets have been inserted to the database");

    // 6. find deviations based on the filtered data
    const similarTicketsMap = findSimilarTickets(
      filteredTicketsWithEmbeddings,
      false
    );
    console.warn("Done searching for similar tickets");

    // 7. insert any generated deviations
    await insertDeviationAndUpdateTickets(similarTicketsMap);
    console.warn("Deviations have been created and tickets were updated");

    return res.status(200).json({
      message: "The application has been initialized successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
