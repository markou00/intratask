import { Box, Container, Paper, SimpleGrid, Title } from '@mantine/core';
import StatsCard from '../components/StatsCard/StatsCard';

import ActiveFilters from '../components/ActiveFilters';
import SimpleAreaChart from '../components/charts/SimpleAreaChart';
import SimplePieChart from '../components/charts/SimplePieChart';
import StackedBarChart from '../components/charts/StackedBarChart';
import Layout from '../components/layout/Layout';
import { useFilters } from '../context/FilterContext';

const CREATED = 'Opprettet avvik';
const SOLVED = 'Løste avvik';
const UNSOLVED = 'Uløste avvik';
const ZENDESK = 'Avvik fra Zendesk';

interface DataItem {
  year: number;
  type: string;
  value: number;
}

const data: DataItem[] = [
  { year: 2022, type: 'Opprettet avvik', value: 400 },
  { year: 2022, type: 'Løste avvik', value: 300 },
  { year: 2022, type: 'Uløste avvik', value: 300 },
  { year: 2022, type: 'Avvik fra Zendesk', value: 200 },
  { year: 2021, type: 'Opprettet avvik', value: 200 },
  { year: 2021, type: 'Løste avvik', value: 100 },
  { year: 2021, type: 'Uløste avvik', value: 150 },
  { year: 2021, type: 'Avvik fra Zendesk', value: 250 },
];

const aggregateDataByType = (statsCardData: DataItem[], type: string) =>
  statsCardData.filter((item) => item.type === type).reduce((sum, curr) => sum + curr.value, 0);

const Dashboard = () => {
  const { filters } = useFilters();

  // Basic function to filter data by year
  const filteredData = filters.length
    ? data.filter((d) => filters.includes(d.year.toString()))
    : data;

  // Check if filters are applied
  const noFilterApplied = filteredData.length === data.length;

  // Helper function to get sum of values for a specific type from filtered data
  const getSumOfValuesForType = (type: string) =>
    filteredData.filter((item) => item.type === type).reduce((sum, curr) => sum + curr.value, 0);

  // Calculate values based on whether a filter is applied
  const createdValue = noFilterApplied
    ? aggregateDataByType(filteredData, CREATED)
    : getSumOfValuesForType(CREATED);
  const solvedValue = noFilterApplied
    ? aggregateDataByType(filteredData, SOLVED)
    : getSumOfValuesForType(SOLVED);
  const unsolvedValue = noFilterApplied
    ? aggregateDataByType(filteredData, UNSOLVED)
    : getSumOfValuesForType(UNSOLVED);
  const zendeskValue = noFilterApplied
    ? aggregateDataByType(filteredData, ZENDESK)
    : getSumOfValuesForType(ZENDESK);

  return (
    <Layout>
      <ActiveFilters />
      <Container fluid p="md">
        <SimpleGrid
          cols={4}
          spacing="xl"
          mb="lg"
          breakpoints={[
            { maxWidth: '62rem', cols: 3, spacing: 'md' },
            { maxWidth: '48rem', cols: 2, spacing: 'sm' },
            { maxWidth: '36rem', cols: 1, spacing: 'sm' },
          ]}
        >
          <StatsCard title={CREATED} variant="created" value={createdValue} />
          <StatsCard title={SOLVED} variant="solved" value={solvedValue} />
          <StatsCard title={UNSOLVED} variant="unsolved" value={unsolvedValue} />
          <StatsCard title={ZENDESK} variant="zendesk" value={zendeskValue} />
        </SimpleGrid>
        <SimpleGrid
          cols={2}
          bg="white"
          breakpoints={[
            { maxWidth: '62rem', cols: 2, spacing: 'md' },
            { maxWidth: '48rem', cols: 1, spacing: 'sm' },
          ]}
          mb="md"
        >
          <Paper radius="md" shadow="sm" withBorder>
            <Title order={3} mt="sm" ta="center">
              Årlig kategori andel
            </Title>
            <Box h={400}>
              <SimplePieChart />
            </Box>
          </Paper>
          <Paper radius="md" shadow="sm" withBorder>
            <Title order={3} mt="sm" ta="center">
              Månedelig avvik oversikt
            </Title>
            <Box h={400}>
              <SimpleAreaChart />
            </Box>
          </Paper>
        </SimpleGrid>
        <SimpleGrid cols={1} bg="white">
          <Paper radius="md" shadow="sm" withBorder>
            <Title order={3} mt="sm" ta="center">
              Månedelig kategori oversikt
            </Title>
            <Box h={500}>
              <StackedBarChart />
            </Box>
          </Paper>
        </SimpleGrid>
      </Container>
    </Layout>
  );
};

export default Dashboard;
