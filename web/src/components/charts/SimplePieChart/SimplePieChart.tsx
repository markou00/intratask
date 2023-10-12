import { Alert, Flex } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { useFilters } from '../../../contexts/FilterContext';
import { aggregateDataByCategory } from '../../../utils/dataAggregation';
import CustomizedLabel from './CustomizedLabel';

interface ISimplePieChart {
  deviations: Deviation[];
}

const COLORS = ['#0088AA', '#00C49F', '#FFBB28', '#FF8042', '#a9a9a9'];

const SimplePieChart: React.FC<ISimplePieChart> = ({ deviations }) => {
  const { filters } = useFilters();

  const filteredDeviations = filters.length
    ? deviations.filter(
        (deviation) => new Date(deviation.createdAt).getFullYear().toString() === filters[0]
      )
    : deviations;

  const aggregatedData = aggregateDataByCategory(filteredDeviations);

  return (
    <ResponsiveContainer width="100%" height="100%">
      {aggregatedData.length ? (
        <PieChart width={400} height={400}>
          <Pie
            data={aggregatedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {aggregatedData.map((_: any, index: any) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      ) : (
        <Flex h="100%" align="center" justify="center">
          <Alert icon={<IconAlertCircle size="1rem" />}>
            Det finnes ingen data for det valgte året
          </Alert>
        </Flex>
      )}
    </ResponsiveContainer>
  );
};

export default SimplePieChart;
