import { Box, Button, Divider, Flex, Group, Text, Title } from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import ProgressBar from "components/ProgressBar";
import TicketsAccordion from "components/TicketsAccordion";
import UserBadge from "components/UserBadge";
import React from "react";
import { DeviationWithTickets } from "types/db";
import { getDeviationDate } from "utils/utils";

interface IDeviationDetails {
  record: DeviationWithTickets;
  error?: boolean | null;
  userImageUrls: Record<string, string>;
}

const DeviationDetails: React.FC<IDeviationDetails> = ({
  record,
  error,
  userImageUrls,
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
              error={error}
            />
          </Flex>

          <Flex gap="sm" align="center">
            <Text fw={700}>Tildet til:</Text>
            <UserBadge
              identifier={record.assigneeId}
              userImageUrls={userImageUrls}
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

      <TicketsAccordion record={record} editMode={false} />

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
        <Button
          sx={{ width: "100%", maxWidth: 100 }}
          onClick={() => closeAllModals()}
        >
          OK
        </Button>
      </Flex>
    </Flex>
  );
};

export default DeviationDetails;
