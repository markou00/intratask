import { Accordion, Badge, Card, Flex, Text } from '@mantine/core';
import React from 'react';
import { DeviationWithTickets } from '../../../api/shared/dbTypes';

interface ITicketsAccordion {
  record: DeviationWithTickets;
}

const TicketsAccordion: React.FC<ITicketsAccordion> = ({ record }) => {
  return (
    <Accordion
      variant="filled"
      styles={{
        control: {
          paddingLeft: 0,
        },
      }}
    >
      <Accordion.Item value="tickets">
        <Accordion.Control>
          <Text fw={700}>Assosierte tickets</Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Flex direction="column" gap="md">
            {record.tickets.map((ticket, index) => (
              <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section inheritPadding withBorder py="xs">
                  <Text fw={500}>Ticket #{ticket.id}:</Text> {ticket.subject}
                </Card.Section>
                <Card.Section inheritPadding withBorder py="xs">
                  {ticket.description}
                </Card.Section>
                <Card.Section inheritPadding withBorder py="xs">
                  {ticket.tags.map((tag, index) => (
                    <Badge key={index} mb="xs" mr="xs">
                      {tag.name.replaceAll('_', ' ')}
                    </Badge>
                  ))}
                </Card.Section>
              </Card>
            ))}
          </Flex>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default TicketsAccordion;
