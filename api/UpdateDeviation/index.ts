import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { handleError } from "../shared/error";
import { prisma } from "../shared/prisma";

interface HttpResponse {
  status: number;
  body: string;
  headers?: Record<string, string>;
}

const UpdateDeviation: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<HttpResponse> {
  try {
    const id = req.params.id;
    const updateData = req.body;

    if (!id) {
      return {
        status: 400,
        body: JSON.stringify({
          message: "ID is required for updating a deviation.",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    // Get the current tickets associated with this deviation
    const currentDeviation = await prisma.deviation.findUnique({
      where: { id: Number(id) },
      select: { tickets: true },
    });

    const currentTicketIds = currentDeviation.tickets.map(
      (ticket) => ticket.id
    );
    const newTicketIds = updateData.tickets.map((ticket) => ticket.id);

    const ticketsToConnect = newTicketIds.filter(
      (ticketId) => !currentTicketIds.includes(ticketId)
    );
    const ticketsToDisconnect = currentTicketIds.filter(
      (ticketId) => !newTicketIds.includes(ticketId)
    );

    const updatedDeviation = await prisma.deviation.update({
      where: { id: Number(id) },
      data: {
        ...updateData,
        tickets: updateData.tickets
          ? {
              connect: ticketsToConnect.map((id) => ({ id })),
              disconnect: ticketsToDisconnect.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        tickets: {
          include: {
            tags: true,
          },
        },
      },
    });

    return {
      status: 200,
      body: JSON.stringify(updatedDeviation),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    return handleError(500, "Failed to update deviation", error);
  } finally {
    await prisma.$disconnect();
  }
};

export default UpdateDeviation;
