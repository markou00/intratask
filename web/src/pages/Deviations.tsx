import {
  Alert,
  Avatar,
  Badge,
  Button,
  Container,
  Group,
  LoadingOverlay,
  MultiSelect,
  Progress,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { closeAllModals, openModal } from '@mantine/modals';
import { IconEdit, IconInfoCircle, IconSearch } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import { Deviation } from '../../../api/shared/dbTypes';
import { protectedResources } from '../configs/authConfig';
import useGraphWithMsal from '../hooks/useGraphWithMsal';
import { getDeviations, updateDeviation } from '../services/DeviationService';
import { ServerError } from './ServerError';

const Deviations: React.FC = () => {
  const theme = useMantineTheme();
  const queryClient = useQueryClient();

  // State hooks
  const [records, setRecords] = useState<Deviation[]>([]);
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
    (args: { deviationId: number; devationData: Partial<Deviation> }) =>
      updateDeviation(args.deviationId, args.devationData),
    {
      onSuccess: () => queryClient.invalidateQueries(['deviations']),
    }
  );

  const handleUpdate = (deviationId: number, devationData: Partial<Deviation>) =>
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
    if (deviations) {
      setRecords(sortBy(deviations, 'date'));
    }
  }, [deviations]);

  useEffect(() => {
    if (!graphData) {
      execute(protectedResources.graphUsers.endpoint).then((data) => setGraphData(data));
    }
  }, [graphData, execute, result]);

  useEffect(() => {
    if (!deviations) return;

    const sortedData = sortBy(deviations, sortStatus.columnAccessor);
    const orderedData = sortStatus.direction === 'desc' ? sortedData.reverse() : sortedData;
    setRecords(orderedData);
  }, [sortStatus, deviations]);

  useEffect(() => {
    if (!deviations) return;

    const filteredRecords = deviations.filter(({ id, title, category, status }) => {
      return (
        (!debouncedTitleQuery ||
          title.toLowerCase().includes(debouncedTitleQuery.trim().toLowerCase())) &&
        (!debouncedIdQuery ||
          `${id}`.toLowerCase().includes(debouncedIdQuery.trim().toLowerCase())) &&
        (!selectedCategories.length || selectedCategories.includes(category)) &&
        (!selectedStatus.length || selectedStatus.includes(status))
      );
    });
    setRecords(filteredRecords);
  }, [deviations, debouncedIdQuery, debouncedTitleQuery, selectedCategories, selectedStatus]);

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
            render: ({ createdAt }) => new Date(createdAt).toLocaleDateString('NO'),
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

            render: ({ creator }) =>
              creator.toLowerCase() !== 'zendesk' && error ? (
                <Alert variant="filled" color="red" icon={<IconInfoCircle size="1rem" />}>
                  Error
                </Alert>
              ) : creator.toLowerCase() === 'zendesk' ? (
                <Badge variant="outline">Zendesk</Badge>
              ) : (
                <Group spacing="sm">
                  {creator.trim() !== '' && (
                    <Avatar src={userImageUrls[creator]} size={30} radius={30} />
                  )}
                  <Text fz="sm" fw={500}>
                    {graphData &&
                      graphData.value.find((user: any) => user.id === creator).displayName}
                  </Text>
                </Group>
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

            render: ({ assigneeId }) =>
              error ? (
                <Alert variant="filled" color="red" icon={<IconInfoCircle size="1rem" />}>
                  Error
                </Alert>
              ) : (
                <Group spacing="sm">
                  {assigneeId?.trim() !== '' && assigneeId && (
                    <Avatar src={userImageUrls[assigneeId]} size={30} radius={30} />
                  )}
                  <Text fz="sm" fw={500}>
                    {graphData &&
                      graphData.value.find((user: any) => user.id === assigneeId)?.displayName}
                  </Text>
                </Group>
              ),
          },
          {
            accessor: 'progress',
            ellipsis: true,

            render: ({ progress }) => (
              <>
                <Text fz="xs" c="teal" weight={700}>
                  {progress}%
                </Text>
                <Progress
                  sections={[
                    {
                      value: progress,
                      color:
                        theme.colorScheme === 'dark' ? theme.colors.teal[9] : theme.colors.teal[6],
                    },
                    {
                      value: +`${100 - progress}`,
                      color:
                        theme.colorScheme === 'dark' ? theme.colors.red[9] : theme.colors.red[6],
                    },
                  ]}
                />
              </>
            ),
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
                  children: (
                    <>
                      <Text>{record.creator}</Text>
                      <Button
                        sx={{ width: '100%', maxWidth: 100 }}
                        onClick={() => closeAllModals()}
                      >
                        OK
                      </Button>
                    </>
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
