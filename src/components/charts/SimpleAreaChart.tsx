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
    uv: 4000,
  },
  {
    year: 2022,
    name: 'Feb',
    uv: 3000,
  },
  {
    year: 2021,
    name: 'Mar',
    uv: 0,
  },
  {
    year: 2022,
    name: 'Apr',
    uv: 2780,
  },
  {
    year: 2021,
    name: 'May',
    uv: 1890,
  },
  {
    year: 2022,
    name: 'Jun',
    uv: 0,
  },
  {
    year: 2022,
    name: 'Jul',
    uv: 2780,
  },
  {
    year: 2021,
    name: 'Aug',
    uv: 3490,
  },
  {
    year: 2022,
    name: 'Sep',
    uv: 3000,
  },
  {
    year: 2022,
    name: 'Oct',
    uv: 3490,
  },
  {
    year: 2021,
    name: 'Nov',
    uv: 1890,
  },
  {
    year: 2022,
    name: 'Dec',
    uv: 2390,
  },
];

const SimpleAreaChart = () => {
  const { filters } = useFilters();

  // Basic filtering by year
  const filteredData = filters.length
    ? data.filter((d) => filters.includes(d.year.toString()))
    : data;

  return (
    <ResponsiveContainer width="100%" height="100%">
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
        <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SimpleAreaChart;
