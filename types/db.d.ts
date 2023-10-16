import { Deviation, Tag, Ticket } from "@prisma/client";

type TicketWithTags = Ticket & {
  tags: Tag[];
};

type DeviationWithTickets = Deviation & {
  tickets: TicketWithTags[];
};
