import { Alert, Flex } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Deviation } from '../../../../api/shared/dbTypes';
import { useFilters } from '../../context/FilterContext';
import { aggregateDeviationsByMonth } from '../../utils/dataAggregation';

interface ISimpleAreaChart {
  deviations: Deviation[];
}

const SimpleAreaChart: React.FC<ISimpleAreaChart> = ({ deviations }) => {
  const { filters } = useFilters();

  const aggregatedData = aggregateDeviationsByMonth(deviations);

  const filteredData = filters.length
    ? aggregatedData.filter((d) => filters.includes(d.year.toString()))
    : aggregatedData;

  return (
    <ResponsiveContainer width="100%" height="100%">
      {filteredData.length ? (
        <AreaChart
          width={500}
          height={400}
          data={filteredData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Legend />
          <Tooltip />
          <Area type="monotone" dataKey="avvik" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
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

export default SimpleAreaChart;
