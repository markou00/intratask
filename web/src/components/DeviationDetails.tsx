import {
  Accordion,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Text,
  Title,
} from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import React from 'react';
import { DeviationWithTickets } from '../../../api/shared/dbTypes';
import ProgressBar from '../components/ProgressBar';
import UserBadge from '../components/UserBadge';
import { getDeviationDate } from '../utils/utils';

interface IDeviationDetails {
  record: DeviationWithTickets;
  error?: boolean | null;
  userImageUrls: Record<string, string>;
  graphData: {
    value: Array<{ id: string; displayName: string }>;
  };
}

const DeviationDetails: React.FC<IDeviationDetails> = ({
  record,
  error,
  userImageUrls,
  graphData,
}) => {
  return (
    <Flex p="xs" direction="column" gap="md">
      <Title order={3}>{record.title}</Title>
      <Divider />
      <Group position="apart">
        <Flex direction="column" gap="sm">
          <Flex gap="sm" align="center">
            <Text fw={700}>Dato:</Text>
            <Text>{getDeviationDate(record.createdAt)}</Text>
          </Flex>

          <Flex gap="sm" align="center">
            <Text fw={700}>Prioritet:</Text>
            <Text>{record.priority}</Text>
          </Flex>

          <Flex gap="sm" align="center">
            <Text fw={700}>Kategori:</Text>
            <Text>{record.category}</Text>
          </Flex>

          <Flex gap="sm" align="center">
            <Text fw={700}>Status:</Text>
            <Text>{record.status}</Text>
          </Flex>
        </Flex>

        <Flex direction="column" gap="sm">
          <Flex gap="sm" align="center">
            <Text fw={700}>Opprettet av:</Text>
            <UserBadge
              identifier={record.creator}
              userImageUrls={userImageUrls}
              graphData={graphData}
              error={error}
            />
          </Flex>

          <Flex gap="sm" align="center">
            <Text fw={700}>Tildet til:</Text>
            <UserBadge
              identifier={record.assigneeId}
              userImageUrls={userImageUrls}
              graphData={graphData}
              error={error}
            />
          </Flex>

          <Flex gap="sm" align="center">
            <Text fw={700}>Sist oppdatert:</Text>
            <Text>{getDeviationDate(record.updatedAt)}</Text>
          </Flex>

          <Flex gap="sm" align="center">
            <Text fw={700}>Fremgang:</Text>
            <Box w="100%">
              <ProgressBar progress={record.progress} />
            </Box>
          </Flex>
        </Flex>
      </Group>

      <Divider />
      <Box>
        <Text fw={700}>Beskrivelse:</Text>
        <Text>{record.description}</Text>
      </Box>
      <Divider />
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
      <Divider />

      {record.solution && (
        <>
          <Box>
            <Text fw={700}>Løsning:</Text>
            <Text>{record.solution}</Text>
          </Box>
          <Divider />
        </>
      )}

      <Flex justify="end">
        <Button sx={{ width: '100%', maxWidth: 100 }} onClick={() => closeAllModals()}>
          OK
        </Button>
      </Flex>
    </Flex>
  );
};

export default DeviationDetails;
