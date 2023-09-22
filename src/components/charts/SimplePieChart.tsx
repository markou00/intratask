import { Alert, Flex } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { useFilters } from '../../context/FilterContext';

const data = [
  { year: 2022, name: 'HMS', value: 400 },
  { year: 2022, name: 'Kvalitet', value: 300 },
  { year: 2022, name: 'Ytremiljø', value: 300 },
  { year: 2022, name: 'Intern', value: 200 },
  { year: 2021, name: 'HMS', value: 400 },
  { year: 2021, name: 'Kvalitet', value: 300 },
  { year: 2022, name: 'Ytremiljø', value: 300 },
  { year: 2023, name: 'Intern', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#EE9123'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const aggregateDataByCategory = (chartData: any[]) =>
  chartData.reduce((acc, curr) => {
    const existingEntry = acc.find((item: any) => item.name === curr.name);
    if (existingEntry) {
      existingEntry.value += curr.value;
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, [] as any[]);

const SimplePieChart = () => {
  const { filters } = useFilters();

  // Basic function to filter data by year
  let filteredData = filters.length
    ? data.filter((d) => filters.includes(d.year.toString()))
    : data;

  // Check if there's no filter applied based on the length of the filtered data
  if (filteredData.length === data.length) filteredData = aggregateDataByCategory(filteredData);

  return (
    <ResponsiveContainer width="100%" height="100%">
      {filteredData.length ? (
        <PieChart width={400} height={400}>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
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
