import { Container, SimpleGrid } from '@mantine/core';
import StatsCard from '../components/StatsCard/StatsCard';
import Layout from '../components/layout/Layout';

const Dashboard = () => (
  <Layout>
    <Container fluid p="md">
      <SimpleGrid
        cols={4}
        spacing="xl"
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
    </Container>
  </Layout>
);

export default Dashboard;
