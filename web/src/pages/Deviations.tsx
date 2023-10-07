import {
  Avatar,
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
import { IconSearch } from '@tabler/icons-react';
import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';

const useStyles = createStyles((theme) => ({
  progressBar: {
    '&:not(:first-of-type)': {
      borderLeft: `${rem(3)} solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
      }`,
    },
  },
}));

const companies = [
  {
    id: '1',
    title: 'Ticket #32734 har flere lignende tickets',
    date: '2023-08-04',
    category: 'Kvalitet',
    creator: 'Rolf Waage', // should be an ID to a user which we can use to fetch name and picture
    status: 'Ny',
    assignee: 'Bjørn Inge Molvær', // should be an ID to a user which we can use to fetch name and picture
    progress: 0,
  },
  {
    id: '2',
    title: 'Ticket #33723 har flere lignende tickets',
    date: '2023-09-04',
    category: 'Ytremiljø',
    creator: 'Rolf Waage', // should be an ID to a user which we can use to fetch name and picture
    status: 'Påbegynt',
    assignee: 'Bjørn Inge Molvær', // should be an ID to a user which we can use to fetch name and picture
    progress: 25,
  },
  {
    id: '3',
    title: 'Ticket #35847 har flere lignende tickets',
    date: '2023-10-04',
    category: 'Interne rutiner',
    creator: 'Rolf Waage', // should be an ID to a user which we can use to fetch name and picture
    status: 'Ferdig',
    assignee: 'Bjørn Inge Molvær', // should be an ID to a user which we can use to fetch name and picture
    progress: 100,
  },
];

const Deviations: React.FC = () => {
  const { classes, theme } = useStyles();

  const [records, setRecords] = useState(sortBy(companies, 'date'));
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
    const categories = new Set(companies.map((e) => e.category));
    return [...categories];
  }, []);

  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const statuses = useMemo(() => {
    const statuses = new Set(companies.map((e) => e.status));
    return [...statuses];
  }, []);

  useEffect(() => {
    const data = sortBy(companies, sortStatus.columnAccessor) as [];
    setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
  }, [sortStatus]);

  useEffect(() => {
    setRecords(
      companies.filter(({ id, title, category, status }) => {
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

            // TODO: using the id in the db, fetch the user's name and avatar
            render: ({ creator }) => (
              <Group spacing="sm">
                <Avatar
                  size={30}
                  src="https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80"
                  radius={30}
                />
                <Text fz="sm" fw={500}>
                  {creator}
                </Text>
              </Group>
            ),

            // render: () => (
            //   <Group spacing="sm">
            //     <Avatar size={30} radius={30} />
            //     <Avatar size={30} src={graph.avatar} radius={30} />
            //     <Text fz="sm" fw={500}>
            //       {graph.name}
            //     </Text>
            //   </Group>
            // ),
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

            render: ({ assignee }) => (
              <Group spacing="sm">
                <Avatar
                  size={30}
                  src="https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80"
                  radius={30}
                />
                <Text fz="sm" fw={500}>
                  {assignee}
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
