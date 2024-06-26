import { Alert, Flex } from "@mantine/core";
import { Deviation } from "@prisma/client";
import { IconAlertCircle } from "@tabler/icons-react";
import { useFilters } from "contexts/FilterContext";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  aggregateDeviationsByMonthAndCategory,
  getUniqueCategories,
} from "utils/dataAggregation";

interface IStackedBarChart {
  deviations: Deviation[];
}
const COLORS = ["#0088AA", "#00C49F", "#FFBB28", "#FF8042", "#a9a9a9"];

const StackedBarChart: React.FC<IStackedBarChart> = ({ deviations }) => {
  const { filters } = useFilters();

  const aggregatedData = aggregateDeviationsByMonthAndCategory(deviations);

  const uniqueCategories = getUniqueCategories(aggregatedData);

  // Basic function to filter data by year
  const filteredData = filters.length
    ? aggregatedData.filter((d) => filters.includes(d.year.toString()))
    : aggregatedData;

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
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />

          {uniqueCategories.map((category, index) => (
            <Bar
              key={`cell-${index}`}
              dataKey={category}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
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
