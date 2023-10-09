import {
  Alert,
  Avatar,
  Badge,
  Container,
  Group,
  MultiSelect,
  Progress,
  Text,
  TextInput,
  createStyles,
  rem,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconInfoCircle, IconSearch } from '@tabler/icons-react';
import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';
import { protectedResources } from '../authConfig';
import useGraphWithMsal from '../hooks/useGraphWithMsal';

const useStyles = createStyles((theme) => ({
  progressBar: {
    '&:not(:first-of-type)': {
      borderLeft: `${rem(3)} solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
      }`,
    },
  },
}));

const deviations = [
  {
    id: '1',
    title: 'Ticket #32734 har flere lignende tickets',
    date: '2023-08-04',
    category: 'Kvalitet',
    creator: '56c6e677-66d2-407d-8704-8e285fbfeacf', // should be an ID to a user which we can use to fetch name and picture
    status: 'Ny',
    assignee: 'dcbb859d-79a0-423a-a6cc-3b50581207d2', // should be an ID to a user which we can use to fetch name and picture
    progress: 0,
  },
  {
    id: '2',
    title: 'Ticket #33723 har flere lignende tickets',
    date: '2023-09-04',
    category: 'Ytremiljø',
    creator: 'system', // should be an ID to a user which we can use to fetch name and picture
    status: 'Påbegynt',
    assignee: '', // should be an ID to a user which we can use to fetch name and picture
    progress: 25,
  },
  {
    id: '3',
    title: 'Ticket #35847 har flere lignende tickets',
    date: '2023-10-04',
    category: 'Interne rutiner',
    creator: 'dcbb859d-79a0-423a-a6cc-3b50581207d2', // should be an ID to a user which we can use to fetch name and picture
    status: 'Ferdig',
    assignee: '81e681ba-ad35-4e05-acd9-b5257aef96e5', // should be an ID to a user which we can use to fetch name and picture
    progress: 100,
  },
];

const Deviations: React.FC = () => {
  const { classes, theme } = useStyles();

  const [records, setRecords] = useState(sortBy(deviations, 'date'));
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'date',
    direction: 'asc',
  });

  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);

  const [queryID, setQueryID] = useState('');
  const [debouncedQueryID] = useDebouncedValue(queryID, 200);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const categories = useMemo(() => {
    const categories = new Set(deviations.map((e) => e.category));
    return [...categories];
  }, []);

  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const statuses = useMemo(() => {
    const statuses = new Set(deviations.map((e) => e.status));
    return [...statuses];
  }, []);

  //TODO:FIX TYPE ISSUES & AVOID THE USE OF 'any'
  const [graphData, setGraphData] = useState(null);

  const { error, execute, result } = useGraphWithMsal(
    {
      scopes: protectedResources.graphUsers.scopes,
    },
    protectedResources.graphUsers.endpoint
  );

  useEffect(() => {
    if (!!graphData) {
      return;
    }

    if (!graphData) {
      execute(protectedResources.graphUsers.endpoint).then((data) => {
        setGraphData(data);
      });
    }
  }, [graphData, execute, result]);

  useEffect(() => {
    const data = sortBy(deviations, sortStatus.columnAccessor) as [];
    setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
  }, [sortStatus]);

  useEffect(() => {
    setRecords(
      deviations.filter(({ id, title, category, status }) => {
        if (
          debouncedQuery !== '' &&
          !`${title}`.toLowerCase().includes(debouncedQuery.trim().toLowerCase())
        ) {
          return false;
        }

        if (
          debouncedQueryID !== '' &&
          !`${id}`.toLowerCase().includes(debouncedQueryID.trim().toLowerCase())
        ) {
          return false;
        }

        if (selectedCategories.length && !selectedCategories.some((c) => c === category)) {
          return false;
        }

        if (selectedStatus.length && !selectedStatus.some((s) => s === status)) {
          return false;
        }

        return true;
      })
    );
  }, [debouncedQueryID, debouncedQuery, selectedCategories, selectedStatus]);

  return (
    <Container fluid p="md">
      <DataTable
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
                value={queryID}
                onChange={(e: any) => setQueryID(e.currentTarget.value)}
              />
            ),
            filtering: queryID !== '',
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
                value={query}
                onChange={(e: any) => setQuery(e.currentTarget.value)}
              />
            ),
            filtering: query !== '',
          },
          {
            accessor: 'date',
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
              creator !== 'system' && error ? (
                <Alert variant="filled" color="red" icon={<IconInfoCircle size="1rem" />}>
                  Error
                </Alert>
              ) : creator.toLowerCase() === 'system' ? (
                <Badge variant="outline">System</Badge>
              ) : (
                <Group spacing="sm">
                  {creator.trim() !== '' && <Avatar size={30} radius={30} />}
                  <Text fz="sm" fw={500}>
                    {graphData && graphData.value.find((user) => user.id === creator).displayName}
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
            filtering: selectedCategories.length > 0,
          },
          {
            accessor: 'assignee',
            ellipsis: true,

            render: ({ assignee }) =>
              error ? (
                <Alert variant="filled" color="red" icon={<IconInfoCircle size="1rem" />}>
                  Error
                </Alert>
              ) : assignee.toLowerCase() === 'system' ? (
                <Badge variant="outline">System</Badge>
              ) : (
                <Group spacing="sm">
                  {assignee.trim() !== '' && <Avatar size={30} radius={30} />}
                  <Text fz="sm" fw={500}>
                    {graphData && graphData.value.find((user) => user.id === assignee)?.displayName}
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
                  classNames={{ bar: classes.progressBar }}
                  sections={[
                    {
                      value: progress,
                      color:
                        theme.colorScheme === 'dark' ? theme.colors.teal[9] : theme.colors.teal[6],
                    },
                    {
                      value: `${100 - progress}`,
                      color:
                        theme.colorScheme === 'dark' ? theme.colors.red[9] : theme.colors.red[6],
                    },
                  ]}
                />
              </>
            ),
          },
        ]}
        records={records}
        shadow="xs"
        highlightOnHover
        withBorder
        withColumnBorders
        borderRadius="md"
        minHeight={records.length === 0 ? '10rem' : ''}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
      />
    </Container>
  );
};

export default Deviations;
