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

export default async function initialize(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
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
