import { DescriptionVector, Deviation, Tag, Ticket } from "@prisma/client";

type TicketWithTags = Ticket & {
  tags: Tag[];
};

type DeviationWithTickets = Deviation & {
  tickets: TicketWithTags[];
};

export type { DescriptionVector, Deviation, Tag, Ticket, DeviationWithTickets };
