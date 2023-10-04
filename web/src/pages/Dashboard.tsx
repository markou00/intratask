import { Box, Container, Paper, SimpleGrid, Text, Title } from '@mantine/core';
import StatsCard from '../components/StatsCard/StatsCard';

import { useQuery } from '@tanstack/react-query';
import ActiveFilters from '../components/ActiveFilters';
import SimpleAreaChart from '../components/charts/SimpleAreaChart';
import SimplePieChart from '../components/charts/SimplePieChart';
import StackedBarChart from '../components/charts/StackedBarChart';
import Layout from '../components/layout/Layout';
import { useFilters } from '../context/FilterContext';
import { getDeviations } from '../services/DeviationService';

const Dashboard = () => {
  const deviationsQuery = useQuery({
    queryKey: ['deviations'],
    queryFn: () => getDeviations(),
  });

  const { filters } = useFilters();

  if (deviationsQuery.isLoading) {
    return <Text>Loading...</Text>;
  }

  if (deviationsQuery.isError) {
    return <Text>Error...</Text>;
  }

  const deviations = deviationsQuery.data;

  // Basic function to filter data by year
  const filteredDeviations = filters.length
    ? deviations.filter(
        (deviation: any) =>
          new Date(deviation?.createdAt).getFullYear().toString() === filters.at(0)
      )
    : deviations;

  // Check if filters are applied
  const noFilterApplied = filteredDeviations.length === deviations.length;

  // Calculate values based on whether a filter is applied
  const createdValue = noFilterApplied ? deviations.length : filteredDeviations.length;

  const solvedValue = noFilterApplied
    ? deviations.filter((deviation: any) => deviation.isSolved).length
    : filteredDeviations.filter((deviation: any) => deviation.isSolved).length;

  const unsolvedValue = noFilterApplied
    ? deviations.filter((deviation: any) => !deviation.isSolved).length
    : filteredDeviations.filter((deviation: any) => !deviation.isSolved).length;

  const zendeskValue = noFilterApplied
    ? deviations.filter((deviation: any) => deviation.creator.toLowerCase() === 'zendesk').length
    : filteredDeviations.filter((deviation: any) => deviation.creator.toLowerCase() === 'zendesk')
        .length;

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
          <StatsCard title="Opprettet avvik" variant="created" value={createdValue} />
          <StatsCard title="Løste avvik" variant="solved" value={solvedValue} />
          <StatsCard title="Uløste avvik" variant="unsolved" value={unsolvedValue} />
          <StatsCard title="Avvik fra Zendesk" variant="zendesk" value={zendeskValue} />
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
