import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  createDescriptionEmbeddings,
  filterTickets,
  insertInitialData,
  requestTickets,
} from "../utils/initialize.mjs";
import { prisma } from "../shared/prisma.js";

interface HttpResponse {
  status: number;
  body: string | object;
  headers?: Record<string, string>;
}

/**
 * Initializes the application by populating the database with ticket data.
 * This Azure Function is triggered via an HTTP request. It performs the following steps:
 * 1. Checks if the database is already populated with ticket data.
 * 2. If the database is empty, it fetches all tickets created after 2020.
 * 3. Filters the fetched tickets based on specified tags.
 * 4. Generates embeddings for the descriptions of the filtered tickets.
 * 5. Inserts the filtered tickets with embeddings into the database.
 *
 * @function
 * @async
 * @param {Context} context - The context object from the Azure Function, used for logging and error handling.
 * @param {HttpRequest} req - The HTTP request object, which triggers this function.
 * @returns {Promise<HttpResponse>} - The HTTP response object, which will be sent back to the client.
 * @throws Will throw an error if any step of the process fails, for example, if there's a failure in fetching the tickets, generating embeddings, or inserting data into the database.
 */
const InitApplication: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<HttpResponse> {
  try {
    // 1. Check if the database is empty
    const existingTicketsCount = await prisma.ticket.count();
    if (existingTicketsCount > 0) {
      console.log("Database is not empty. Aborting data initialization.");
      return;
    }

    // 2. Get all the tickets which was created after 2020
    const allTickets = await requestTickets();

    // 3. Filter the tickets based on the specified tags
    const filteredTickets = filterTickets(allTickets);

    // 4. Generate embedding of the ticket's description
    const filteredTicketsWithEmbeddings = await createDescriptionEmbeddings(
      filteredTickets
    );

    // 5. insert the tickets in the DB
    await insertInitialData(filteredTicketsWithEmbeddings);

    return {
      status: 200,
      body: "The application has been initialized successfully",
    };
  } catch (error) {
    context.log.error(error);
    return {
      status: 500,
      body: "Internal Server Error",
    };
  }
};

export default InitApplication;
