import type { NextApiRequest, NextApiResponse } from "next";
import {
  createDescriptionEmbeddings,
  filterTickets,
  findSimilarTickets,
  getAllTicketsInChunks,
  insertDeviationAndUpdateTickets,
  insertInitialData,
} from "utils/initialize";

export default async function analyseTodaysTickets(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // 1. Get all the tickets which was created today
    const allTickets = req.body;
    console.warn("Tickets have arrieved successfully");

    // 2. Filter the tickets based on the specified tags
    const filteredTickets = filterTickets(allTickets);
    console.warn("Tickets have been filtered");

    // 3. Generate embeddings of the tickets' descriptions
    const filteredTicketsWithEmbeddings = await createDescriptionEmbeddings(
      filteredTickets
    );
    console.warn("Embeddings was generated successfully");

    // 4. insert the tickets in the DB
    await insertInitialData(filteredTicketsWithEmbeddings);
    console.warn("Tickets have been inserted to the database");

    // 5. get all tickets from db (in chunks)
    const ticketsFromDB = getAllTicketsInChunks(false);

    // 6. find deviations based on tickets from DB
    const similarTicketsMap = findSimilarTickets(ticketsFromDB, true);
    console.warn("Done searching for similar tickets");

    // 7. insert any generated deviations
    await insertDeviationAndUpdateTickets(similarTicketsMap);
    console.warn("Deviations have been created and tickets were updated");

    return res.status(200).json({
      message: "Tickets & deviations have been updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
