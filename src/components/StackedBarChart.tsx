import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  {
    name: 'Jan',
    uv: 4000,
    pv: 2400,
    ac: 1290,
  },
  {
    name: 'Feb',
    uv: 3000,
    pv: 1398,
    ac: 1290,
  },
  {
    name: 'Mar',
    uv: 2000,
    pv: 9800,
    ac: 1290,
  },
  {
    name: 'Apr',
    uv: 2780,
    pv: 3908,
    ac: 1290,
  },
  {
    name: 'May',
    uv: 1890,
    pv: 4800,
    ac: 1290,
  },
  {
    name: 'Jun',
    uv: 2390,
    pv: 3800,
    ac: 1290,
  },
  {
    name: 'Jul',
    uv: 3490,
    pv: 4300,
    ac: 1290,
  },
  {
    name: 'Aug',
    uv: 0,
    pv: 0,
    ac: 0,
  },
  {
    name: 'Sep',
    uv: 3490,
    pv: 4300,
    ac: 1290,
  },
  {
    name: 'Oct',
    uv: 3490,
    pv: 4300,
    ac: 1290,
  },
  {
    name: 'Nov',
    uv: 0,
    pv: 0,
    ac: 0,
  },
  {
    name: 'Dec',
    uv: 3490,
    pv: 4300,
    ac: 1290,
  },
];
const StackedBarChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      width={500}
      height={300}
      data={data}
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
      <Bar dataKey="pv" stackId="a" fill="#8884d8" />
      <Bar dataKey="uv" stackId="a" fill="#82ca9d" />
      <Bar dataKey="ac" stackId="a" fill="#272727" />
    </BarChart>
  </ResponsiveContainer>
);
export default StackedBarChart;
