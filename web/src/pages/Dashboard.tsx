import { Box, Container, LoadingOverlay, Paper, SimpleGrid, Title } from '@mantine/core';
import StatsCard from '../components/StatsCard/StatsCard';

import { useQuery } from '@tanstack/react-query';
import ActiveFilters from '../components/ActiveFilters';
import SimpleAreaChart from '../components/charts/SimpleAreaChart';
import SimplePieChart from '../components/charts/SimplePieChart/SimplePieChart';
import StackedBarChart from '../components/charts/StackedBarChart';
import Layout from '../components/layout/Layout';
import { useFilters } from '../context/FilterContext';
import { getDeviations } from '../services/DeviationService';
import { ServerError } from './ServerError';

const Dashboard: React.FC = () => {
  const deviationsQuery = useQuery({
    queryKey: ['deviations'],
    queryFn: getDeviations,
  });

  const { filters } = useFilters();

  if (deviationsQuery.isLoading) return <LoadingOverlay visible={true} />;
  if (deviationsQuery.isError) return <ServerError />;

  const deviations = deviationsQuery.data;

  // filters.at(0) because right now there is only year filter. But more will be added later
  const filteredDeviations = deviations.filter(
    (deviation) => new Date(deviation.createdAt).getFullYear().toString() === filters?.at(0)
  );

  const deviationsToDisplay = filters.length ? filteredDeviations : deviations;

  let createdCount = 0;
  let solvedCount = 0;
  let unsolvedCount = 0;
  let zendeskCount = 0;
  // Calculate stats cards values
  deviationsToDisplay.forEach((deviation) => {
    createdCount++;
    if (deviation.isSolved) solvedCount++;
    else unsolvedCount++;
    if (deviation.creator.toLowerCase() === 'zendesk') zendeskCount++;
  });

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
          <StatsCard title="Opprettet avvik" variant="created" value={createdCount} />
          <StatsCard title="Løste avvik" variant="solved" value={solvedCount} />
          <StatsCard title="Uløste avvik" variant="unsolved" value={unsolvedCount} />
          <StatsCard title="Avvik fra Zendesk" variant="zendesk" value={zendeskCount} />
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
              <SimplePieChart deviations={deviationsToDisplay} />
            </Box>
          </Paper>
          <Paper radius="md" shadow="sm" withBorder>
            <Title order={3} mt="sm" ta="center">
              Månedelig avvik oversikt
            </Title>
            <Box h={400}>
              <SimpleAreaChart deviations={deviationsToDisplay} />
            </Box>
          </Paper>
        </SimpleGrid>
        <SimpleGrid cols={1} bg="white">
          <Paper radius="md" shadow="sm" withBorder>
            <Title order={3} mt="sm" ta="center">
              Månedelig kategori oversikt
            </Title>
            <Box h={500}>
              <StackedBarChart deviations={deviationsToDisplay} />
            </Box>
          </Paper>
        </SimpleGrid>
      </Container>
    </Layout>
  );
};

export default Dashboard;
