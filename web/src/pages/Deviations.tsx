import {
  Accordion,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  MultiSelect,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { closeAllModals, openModal } from '@mantine/modals';
import { IconEdit, IconInfoCircle, IconSearch } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import { DeviationWithTickets } from '../../../api/shared/dbTypes';
import ProgressBar from '../components/ProgressBar';
import UserBadge from '../components/UserBadge';
import { protectedResources } from '../configs/authConfig';
import useGraphWithMsal from '../hooks/useGraphWithMsal';
import { getDeviations, updateDeviation } from '../services/DeviationService';
import { ServerError } from './ServerError';

const getDeviationDate = (date: Date) => new Date(date).toLocaleDateString('NO');

const Deviations: React.FC = () => {
  const theme = useMantineTheme();
  const queryClient = useQueryClient();

  // State hooks
  const [records, setRecords] = useState<DeviationWithTickets[]>([]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'date',
    direction: 'asc',
  });
  const [titleQuery, setTitleQuery] = useState('');
  const [debouncedTitleQuery] = useDebouncedValue(titleQuery, 200);
  const [idQuery, setIdQuery] = useState('');
  const [debouncedIdQuery] = useDebouncedValue(idQuery, 200);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [graphData, setGraphData] = useState<any>(null); // TODO: Define proper type for graphData
  const [userImageUrls, setUserImageUrls] = useState<Record<string, string>>({});
  const [newCreator, setNewCreator] = useState('');

  // Queries
  const deviationsQuery = useQuery({
    queryKey: ['deviations'],
    queryFn: getDeviations,
    staleTime: Infinity,
    cacheTime: 5 * 60 * 1000,
  });
  const deviations = deviationsQuery.data;

  const updateDeviationMutation = useMutation(
    (args: { deviationId: number; devationData: Partial<DeviationWithTickets> }) =>
      updateDeviation(args.deviationId, args.devationData),
    {
      onSuccess: () => queryClient.invalidateQueries(['deviations']),
    }
  );

  const handleUpdate = (deviationId: number, devationData: Partial<DeviationWithTickets>) =>
    updateDeviationMutation.mutate({ deviationId, devationData });

  const { error, execute, result } = useGraphWithMsal(
    { scopes: protectedResources.graphUsers.scopes },
    protectedResources.graphUsers.endpoint
  );

  const { execute: executeImageUrl } = useGraphWithMsal(
    {
      scopes: ['User.Read.All'],
    },
    'https://graph.microsoft.com/v1.0/users/id/photo/$value'
  );

  const fetchImageUrlForId = async (id: string) => {
    try {
      const response = await executeImageUrl(
        `https://graph.microsoft.com/v1.0/users/${id}/photo/$value`
      );
      if (response && response.ok) {
        const imageBlob = await response.blob();
        const imageObjectUrl = URL.createObjectURL(imageBlob);
        setUserImageUrls((prev) => ({ ...prev, [id]: imageObjectUrl }));
        return imageObjectUrl;
      } else {
        throw new Error(`Failed to fetch profile image for user ${id}.`);
      }
    } catch (error) {
      console.error(`Error fetching image for user ${id}:`, error);
      return '';
    }
  };

  // Effects
  useEffect(() => {
    if (!graphData) {
      execute(protectedResources.graphUsers.endpoint).then((data) => setGraphData(data));
    }
  }, [graphData, execute, result]);

  useEffect(() => {
    if (!deviations) return;

    let processedData = deviations;

    // Filter data
    processedData = processedData.filter(({ id, title, category, status }) => {
      return (
        (!debouncedTitleQuery ||
          title.toLowerCase().includes(debouncedTitleQuery.trim().toLowerCase())) &&
        (!debouncedIdQuery ||
          `${id}`.toLowerCase().includes(debouncedIdQuery.trim().toLowerCase())) &&
        (!selectedCategories.length || selectedCategories.includes(category)) &&
        (!selectedStatus.length || selectedStatus.includes(status))
      );
    });

    // Sort data
    processedData = sortBy(processedData, sortStatus.columnAccessor);
    if (sortStatus.direction === 'desc') {
      processedData.reverse();
    }

    setRecords(processedData);
  }, [
    deviations,
    debouncedIdQuery,
    debouncedTitleQuery,
    selectedCategories,
    selectedStatus,
    sortStatus,
  ]);

  useEffect(() => {
    if (!graphData || !records) return;

    records.forEach(({ creator, assigneeId }) => {
      if (creator && creator.toLowerCase() !== 'zendesk' && !userImageUrls[creator]) {
        fetchImageUrlForId(creator);
      }
      if (assigneeId && !userImageUrls[assigneeId]) {
        fetchImageUrlForId(assigneeId);
      }
    });
  }, [graphData, records, userImageUrls]);

  const categories = useMemo(() => [...new Set(deviations?.map((e) => e.category))], [deviations]);
  const statuses = useMemo(() => [...new Set(deviations?.map((e) => e.status))], [deviations]);

  // Render loading or error states
  if (deviationsQuery.isLoading) return <LoadingOverlay visible={true} />;
  if (deviationsQuery.isError) return <ServerError />;

  return (
    <Container fluid p="md">
      <DataTable
        records={records}
        shadow="xs"
        highlightOnHover
        withBorder
        withColumnBorders
        borderRadius="md"
        minHeight={records?.length === 0 ? '10rem' : ''}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        fetching={updateDeviationMutation.isLoading}
        columns={[
          {
            accessor: 'id',
            textAlignment: 'center',
            ellipsis: true,
            filter: (
              <TextInput
                label="ID"
                description="#12345"
                placeholder="Search id..."
                icon={<IconSearch size={16} />}
                value={idQuery}
                onChange={(e: any) => setIdQuery(e.currentTarget.value)}
              />
            ),
            filtering: idQuery !== '',
          },
          {
            accessor: 'title',
            ellipsis: true,

            filter: (
              <TextInput
                label="Title"
                description="A bug in the system"
                placeholder="Search title..."
                icon={<IconSearch size={16} />}
                value={titleQuery}
                onChange={(e: any) => setTitleQuery(e.currentTarget.value)}
              />
            ),
            filtering: titleQuery !== '',
          },
          {
            accessor: 'createdAt',
            render: ({ createdAt }) => getDeviationDate(createdAt),
            ellipsis: true,

            sortable: true,
          },
          {
            accessor: 'category',
            ellipsis: true,

            filter: (
              <MultiSelect
                label="Category"
                description="Show different categories"
                data={categories}
                value={selectedCategories}
                placeholder="Search departments…"
                onChange={setSelectedCategories}
                icon={<IconSearch size={16} />}
                clearable
                searchable
              />
            ),
            filtering: selectedCategories.length > 0,
          },
          {
            accessor: 'creator',
            ellipsis: true,

            render: ({ creator }) => (
              <UserBadge
                identifier={creator}
                error={error}
                userImageUrls={userImageUrls}
                graphData={graphData}
              />
            ),
          },
          {
            accessor: 'status',
            ellipsis: true,

            filter: (
              <MultiSelect
                label="Status"
                description="Show different status"
                data={statuses}
                value={selectedStatus}
                placeholder="Search status…"
                onChange={setSelectedStatus}
                icon={<IconSearch size={16} />}
                clearable
                searchable
              />
            ),
            filtering: selectedStatus.length > 0,
          },
          {
            accessor: 'assignee',
            ellipsis: true,

            render: ({ assigneeId }) => (
              <UserBadge
                identifier={assigneeId}
                error={error}
                userImageUrls={userImageUrls}
                graphData={graphData}
              />
            ),
          },
          {
            accessor: 'progress',
            ellipsis: true,

            render: ({ progress }) => <ProgressBar progress={progress} />,
          },
        ]}
        rowContextMenu={{
          trigger: 'click',
          borderRadius: 'md',
          shadow: 'lg',
          items: (record) => [
            {
              key: 'details',
              title: `Vis detaljer`,
              icon: <IconInfoCircle size={16} />,
              onClick: () =>
                openModal({
                  title: `Avvik #${record.id}`,
                  size: 'xl',
                  children: (
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
                        <Button
                          sx={{ width: '100%', maxWidth: 100 }}
                          onClick={() => closeAllModals()}
                        >
                          OK
                        </Button>
                      </Flex>
                    </Flex>
                  ),
                }),
            },
            {
              key: 'edit',
              title: 'Rediger',
              icon: <IconEdit size={16} />,
              onClick: () =>
                openModal({
                  title: `Rediger Avvik #${record.id}`,
                  children: (
                    <>
                      <TextInput
                        label="Creator"
                        placeholder="Type creator's id here..."
                        onChange={(event) => setNewCreator(event.target.value)}
                      />
                      <Button
                        sx={{ width: '100%', maxWidth: 100 }}
                        onClick={() => {
                          handleUpdate(record.id, { creator: newCreator });
                          closeAllModals();
                        }}
                      >
                        OK
                      </Button>
                    </>
                  ),
                }),
            },
          ],
        }}
      />
    </Container>
  );
};

export default Deviations;
