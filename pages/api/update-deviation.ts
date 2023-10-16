// pages/api/update-deviation.js

import { NextApiRequest, NextApiResponse } from "next";
import { handleError } from "../../lib/error";
import prisma from "../../lib/prisma";
import { DeviationWithTickets } from "../../types/db";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "PUT") {
      return res.status(405).end(); // Method Not Allowed
    }

    const id = req.query.id;
    const updateData: Partial<DeviationWithTickets> = req.body;

    if (!id) {
      return res.status(400).json({
        message: "ID is required for updating a deviation.",
      });
    }

    // Get the current tickets associated with this deviation
    const currentDeviation = await prisma.deviation.findUnique({
      where: { id: Number(id) },
      select: { tickets: true },
    });

    const currentTicketIds = currentDeviation?.tickets.map(
      (ticket) => ticket.id
    );
    const newTicketIds = updateData.tickets?.map((ticket) => ticket.id);

    const ticketsToConnect = newTicketIds?.filter(
      (ticketId) => !currentTicketIds?.includes(ticketId)
    );
    const ticketsToDisconnect = currentTicketIds?.filter(
      (ticketId) => !newTicketIds?.includes(ticketId)
    );

    const updatedDeviation = await prisma.deviation.update({
      where: { id: Number(id) },
      data: {
        ...updateData,
        tickets: updateData.tickets
          ? {
              connect: ticketsToConnect?.map((id) => ({ id })),
              disconnect: ticketsToDisconnect?.map((id) => ({ id })),
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

    return res.status(200).json(updatedDeviation);
  } catch (error) {
    handleError(res, 500, "Failed to update deviation", error);
  } finally {
    await prisma.$disconnect();
  }
}
