import { Box, Container, Paper, SimpleGrid, Title } from '@mantine/core';
import StatsCard from '../components/StatsCard/StatsCard';

import ActiveFilters from '../components/ActiveFilters';
import SimpleAreaChart from '../components/charts/SimpleAreaChart';
import SimplePieChart from '../components/charts/SimplePieChart';
import StackedBarChart from '../components/charts/StackedBarChart';
import Layout from '../components/layout/Layout';

const Dashboard = () => (
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
        <StatsCard title="Opprettet avvik" variant="created" value={12} />
        <StatsCard title="Løste avvik" variant="solved" value={6} />
        <StatsCard title="Uløste avvik" variant="unsolved" value={6} />
        <StatsCard title="Avvik fra Zendesk" variant="zendesk" value={10} />
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
            Monthly Deviation Chart
          </Title>
          <Box h={400}>
            <SimplePieChart />
          </Box>
        </Paper>
        <Paper radius="md" shadow="sm" withBorder>
          <Title order={3} mt="sm" ta="center">
            Monthly Deviation Chart
          </Title>
          <Box h={400}>
            <SimpleAreaChart />
          </Box>
        </Paper>
      </SimpleGrid>
      <SimpleGrid cols={1} bg="white">
        <Paper radius="md" shadow="sm" withBorder>
          <Title order={3} mt="sm" ta="center">
            Monthly Deviation Chart
          </Title>
          <Box h={500}>
            <StackedBarChart />
          </Box>
        </Paper>
      </SimpleGrid>
    </Container>
  </Layout>
);

export default Dashboard;
