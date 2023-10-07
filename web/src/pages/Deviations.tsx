import { Container, MultiSelect, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';

const companies = [
  {
    id: '9d7b6df5-aa1e-4203-bfa8-7d9464e331cb',
    name: 'Sipes Inc',
    streetAddress: '280 Rigoberto Divide',
    city: 'Twin Falls',
    state: 'MT',
    missionStatement: 'Strategize magnetic vortals.',
  },
  {
    id: '3c147f0b-c63f-4830-8ced-f378aad9efc6',
    name: 'Runolfsdottir - Cummerata',
    streetAddress: '102 Konopelski Greens',
    city: 'Missouri City',
    state: 'KY',
    missionStatement: 'Leverage one-to-one methodologies.',
  },
  {
    id: '331992e8-7144-49c4-a8fd-fae9a6921b13',
    name: 'Johnston LLC',
    streetAddress: '230 Julie Lake',
    city: 'Hartford',
    state: 'KY',
    missionStatement: 'Transition wireless initiatives.',
  },
  {
    id: 'eb089974-a0ed-4ec2-84a3-4d7bd3935b63',
    name: 'Crist and Sons',
    streetAddress: '3387 Blick Turnpike',
    city: 'Attleboro',
    state: 'WV',
    missionStatement: 'Revolutionize out-of-the-box infomediaries.',
  },
  {
    id: 'fc257801-7b32-41ca-a31b-57ae6739415b',
    name: 'Schmidt and Sons',
    streetAddress: '286 Leif Lock',
    city: 'Collierville',
    state: 'AL',
    missionStatement: 'Optimize bricks-and-clicks eyeballs.',
  },
  {
    id: 'c942ac73-2c51-4bf1-b4a7-04419acf58c0',
    name: 'Nicolas Group',
    streetAddress: '09622 Marcel Place',
    city: 'Highland',
    state: 'OR',
    missionStatement: 'Transition vertical interfaces.',
  },
  {
    id: 'ad36f2d0-b186-4f1e-9a04-57e59715dc8f',
    name: 'Kub and Sons',
    streetAddress: '8699 Upton Fords',
    city: 'East Providence',
    state: 'IN',
    missionStatement: 'Drive proactive models.',
  },
  {
    id: 'e4a64ab6-4a9f-4f53-8f9e-dbf761fe9a69',
    name: 'Jakubowski - Rolfson',
    streetAddress: "191 O'Connell Greens",
    city: 'San Rafael',
    state: 'MA',
    missionStatement: 'Streamline cutting-edge architectures.',
  },
  {
    id: '996fdd92-a399-4bef-9188-b0458ecee682',
    name: 'Welch - Tremblay',
    streetAddress: '31622 Isobel Fall',
    city: 'Olathe',
    state: 'AR',
    missionStatement: 'Deploy wireless solutions.',
  },
  {
    id: 'd0d0f9b1-7bb9-4b1e-967d-3ea81de7dd59',
    name: 'Mueller, Hodkiewicz and Beahan',
    streetAddress: '21751 Elisa Village',
    city: 'Grand Prairie',
    state: 'WA',
    missionStatement: 'Facilitate bleeding-edge web-readiness.',
  },
];

const Deviations: React.FC = () => {
  const [records, setRecords] = useState(sortBy(companies, 'city'));
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'city',
    direction: 'asc',
  });

  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);

  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const states = useMemo(() => {
    const states = new Set(companies.map((e) => e.state));
    return [...states];
  }, []);

  useEffect(() => {
    const data = sortBy(companies, sortStatus.columnAccessor) as [];
    setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
  }, [sortStatus]);

  useEffect(() => {
    setRecords(
      companies.filter(({ name, state }) => {
        if (
          debouncedQuery !== '' &&
          !`${name}`.toLowerCase().includes(debouncedQuery.trim().toLowerCase())
        ) {
          return false;
        }

        if (selectedStates.length && !selectedStates.some((s) => s === state)) {
          return false;
        }

        return true;
      })
    );
  }, [debouncedQuery, selectedStates]);

  return (
    <Container fluid p="md">
      <DataTable
        columns={[
          {
            accessor: 'name',
            filter: (
              <TextInput
                label="Employees"
                description="Show employees whose names include the specified text"
                placeholder="Search employees..."
                icon={<IconSearch size={16} />}
                value={query}
                onChange={(e: any) => setQuery(e.currentTarget.value)}
              />
            ),
            filtering: query !== '',
          },
          { accessor: 'streetAddress' },
          { accessor: 'city', sortable: true },
          {
            accessor: 'state',
            filter: (
              <MultiSelect
                label="Departments "
                description="Show all employees working at the selected departments"
                data={states}
                value={selectedStates}
                placeholder="Search departments…"
                onChange={setSelectedStates}
                icon={<IconSearch size={16} />}
                clearable
                searchable
              />
            ),
            filtering: selectedStates.length > 0,
          },
        ]}
        records={records}
        shadow="xs"
        highlightOnHover
        withBorder
        borderRadius="md"
        minHeight={records.length === 0 ? '10rem' : ''}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
      />
    </Container>
  );
};

export default Deviations;
