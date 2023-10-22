import axios from "axios";
import { app, InvocationContext, Timer } from "@azure/functions";

export const requestTickets = async (startTime: number) => {
  const email_address = process.env.ZENDESK_EMAIL_ADDRESS;
  const api_token = process.env.ZENDESK_API_TOKEN;
  const subdomain = process.env.ZENDESK_SUBDOMAIN;

  const zendeskMs = startTime / 1000;

  let url = `https://${subdomain}.zendesk.com/api/v2/incremental/tickets.json?start_time=${zendeskMs}`;

  const headers = {
    Authorization: `Basic ${Buffer.from(
      `${email_address}/token:${api_token}`
    ).toString("base64")}`,
    Accept: "application/json",
  };

  let allTickets = [];
  let prevUrl = "";

  // Use a Set to keep track of unique ticket IDs
  // This is important because Zendesk returns duplicated tickets
  const uniqueTicketIds = new Set();

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
    // Makes sure we only get the tickets after the specified date.
    const filteredTickets = data.tickets.filter((ticket) => {
      const startTimeDate = new Date(startTime);
      const year = startTimeDate.getFullYear();
      const month = (startTimeDate.getMonth() + 1).toString().padStart(2, "0");
      const day = startTimeDate.getDate().toString().padStart(2, "0");

      return (
        new Date(ticket.created_at) >=
          new Date(`${year}-${month}-${day}T00:00:00.000Z`) &&
        !uniqueTicketIds.has(ticket.id) // Ensure the ticket ID is unique
      );
    });

    // Add the unique ticket IDs to the Set
    filteredTickets.forEach((ticket) => uniqueTicketIds.add(ticket.id));

    allTickets = allTickets.concat(filteredTickets);

    // to keep track of how many tickets have been fetched
    console.log(`INFO: Fetching tickets: ${allTickets.length}...`);

    prevUrl = url;
    url = data.next_page;
  }

  return allTickets;
};

export async function getTodaysTickets(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  context.log("Timer function processed request.");

  // Calculate the start time for today in Unix timestamp format
  const today = new Date().setHours(0, 0, 0, 0);

  // Fetch today's tickets
  const todaysTickets = await requestTickets(today);

  // Call the NextJS route with the result
  try {
    const response = await axios.post(
      "https://intratask-test.azurewebsites.net/api/analyse-todays-tickets",
      todaysTickets
    );
    context.log("Tickets analysed:", response.data);
  } catch (error) {
    context.log("Error analysing tickets:", error);
  }
}

app.timer("getTodaysTickets", {
  schedule: "0 30 23 * * *",
  handler: getTodaysTickets,
});
