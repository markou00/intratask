type DescriptionVector = {
  id: number;
  ticketId: number;
  vectorValue: string;
};

type Deviation = {
  id: number;
  creator: string;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  title: string;
  description: string;
  status: string;
  assigneeId: string;
  solution: string;
  isSolved: boolean;
  solvedBy: string;
  progress: number;
  priority: string;
};

type Ticket = {
  id: number;
  createdAt: Date;
  subject: string;
  description: string;
  status: string;
  deviationId: number;
};

type Tag = {
  id: number;
  name: string;
  ticketId: number;
};

type TicketWithTags = Ticket & {
  tags: Tag[];
};

type DeviationWithTickets = Deviation & {
  tickets: TicketWithTags[];
};
