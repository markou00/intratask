import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { prisma } from "../shared/prisma";

interface HttpResponse {
  status: number;
  body: string;
  headers?: Record<string, string>;
}

const GetTickets: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<HttpResponse> {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        descriptionVector: true,
        tags: true,
      },
    });

    return {
      status: 200,
      body: JSON.stringify(tickets),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    context.log.error(error);
    return {
      status: 500,
      body: "Internal Server Error",
    };
  } finally {
    await prisma.$disconnect();
  }
};

export default GetTickets;
