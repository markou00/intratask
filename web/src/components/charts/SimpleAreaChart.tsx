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
import { useFilters } from '../../context/FilterContext';

const data = [
  {
    year: 2022,
    name: 'Jan',
    avvik: 4000,
  },
  {
    year: 2022,
    name: 'Feb',
    avvik: 3000,
  },
  {
    year: 2021,
    name: 'Mar',
    avvik: 0,
  },
  {
    year: 2022,
    name: 'Apr',
    avvik: 2780,
  },
  {
    year: 2021,
    name: 'May',
    avvik: 1890,
  },
  {
    year: 2022,
    name: 'Jun',
    avvik: 0,
  },
  {
    year: 2022,
    name: 'Jul',
    avvik: 2780,
  },
  {
    year: 2021,
    name: 'Aug',
    avvik: 3490,
  },
  {
    year: 2022,
    name: 'Sep',
    avvik: 3000,
  },
  {
    year: 2022,
    name: 'Oct',
    avvik: 3490,
  },
  {
    year: 2021,
    name: 'Nov',
    avvik: 1890,
  },
  {
    year: 2022,
    name: 'Dec',
    avvik: 2390,
  },
];

const SimpleAreaChart = () => {
  const { filters } = useFilters();

  // Basic function to filter data by year
  const filteredData = filters.length
    ? data.filter((d) => filters.includes(d.year.toString()))
    : data;

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
