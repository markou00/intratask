import { Accordion, ActionIcon, Badge, Card, Flex, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import React from 'react';
import { DeviationWithTickets } from '../../../api/shared/dbTypes';
import { useRedCards } from '../contexts/RedCardsContext';

interface ITicketsAccordion {
  record: DeviationWithTickets;
  editMode: boolean;
}

const TicketsAccordion: React.FC<ITicketsAccordion> = ({ record, editMode }) => {
  const { redCardIds, setRedCardIds } = useRedCards();

  const handleColorChange = (ticketId: number) => {
    if (redCardIds.includes(ticketId)) {
      setRedCardIds((prevIds) => prevIds.filter((id) => id !== ticketId));
    } else {
      setRedCardIds((prevIds) => [...prevIds, ticketId]);
    }
  };

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
              <Card
                key={index}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                bg={(redCardIds.includes(ticket.id) && 'red') || ''}
              >
                <Card.Section inheritPadding withBorder py="xs">
                  <Flex justify="space-between">
                    <div>
                      <Text fw={500}>Ticket #{ticket.id}:</Text> {ticket.subject}
                    </div>
                    {editMode && (
                      <ActionIcon
                        variant="filled"
                        color="red"
                        onClick={() => handleColorChange(ticket.id)}
                      >
                        <IconTrash />
                      </ActionIcon>
                    )}
                  </Flex>
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
