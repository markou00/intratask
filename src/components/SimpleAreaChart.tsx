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

const data = [
  {
    name: 'Jan',
    uv: 4000,
  },
  {
    name: 'Feb',
    uv: 3000,
  },
  {
    name: 'Mar',
    uv: 0,
  },
  {
    name: 'Apr',
    uv: 2780,
  },
  {
    name: 'May',
    uv: 1890,
  },
  {
    name: 'Jun',
    uv: 0,
  },
  {
    name: 'Jul',
    uv: 2780,
  },
  {
    name: 'Aug',
    uv: 3490,
  },
  {
    name: 'Sep',
    uv: 3000,
  },
  {
    name: 'Oct',
    uv: 3490,
  },
  {
    name: 'Nov',
    uv: 1890,
  },
  {
    name: 'Dec',
    uv: 2390,
  },
];

const SimpleAreaChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart
      width={500}
      height={400}
      data={data}
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

export default SimpleAreaChart;
