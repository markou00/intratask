import { Alert, Flex } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useFilters } from '../../context/FilterContext';

const data = [
  {
    name: 'Jan',
    year: 2022,
    HMS: 4000,
    Kvalitet: 2400,
    Ytremiljø: 1290,
  },
  {
    name: 'Feb',
    year: 2021,
    HMS: 3000,
    Kvalitet: 1398,
    Ytremiljø: 1290,
  },
  {
    name: 'Mar',
    year: 2023,
    HMS: 2000,
    Kvalitet: 9800,
    Ytremiljø: 1290,
  },
  {
    name: 'Apr',
    year: 2022,
    HMS: 2780,
    Kvalitet: 3908,
    Ytremiljø: 1290,
  },
  {
    name: 'May',
    year: 2022,
    HMS: 1890,
    Kvalitet: 4800,
    Ytremiljø: 1290,
  },
  {
    name: 'Jun',
    year: 2021,
    HMS: 2390,
    Kvalitet: 3800,
    Ytremiljø: 1290,
  },
  {
    name: 'Jul',
    year: 2022,
    HMS: 3490,
    Kvalitet: 4300,
    Ytremiljø: 1290,
  },
  {
    name: 'Aug',
    year: 2022,
    HMS: 0,
    Kvalitet: 0,
    Ytremiljø: 0,
  },
  {
    name: 'Sep',
    year: 2023,
    HMS: 3490,
    Kvalitet: 4300,
    Ytremiljø: 1290,
  },
  {
    name: 'Oct',
    year: 2022,
    HMS: 3490,
    Kvalitet: 4300,
    Ytremiljø: 1290,
  },
  {
    name: 'Nov',
    year: 2023,
    HMS: 0,
    Kvalitet: 0,
    Ytremiljø: 0,
  },
  {
    name: 'Dec',
    year: 2022,
    HMS: 3490,
    Kvalitet: 4300,
    Ytremiljø: 1290,
  },
];
const StackedBarChart = () => {
  const { filters } = useFilters();

  // Basic function to filter data by year
  const filteredData = filters.length
    ? data.filter((d) => filters.includes(d.year.toString()))
    : data;

  return (
    <ResponsiveContainer width="100%" height="100%">
      {filteredData.length ? (
        <BarChart
          width={500}
          height={300}
          data={filteredData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Kvalitet" stackId="a" fill="#8884d8" />
          <Bar dataKey="HMS" stackId="a" fill="#82ca9d" />
          <Bar dataKey="Ytremiljø" stackId="a" fill="#272727" />
        </BarChart>
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
export default StackedBarChart;
