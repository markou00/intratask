import { Deviation } from '../../../api/shared/dbTypes';

/**
 * Aggregates an array of deviations by category and calculates the total number of deviations for each category.
 *
 * @param {Deviation[]} deviations - The list of deviations to aggregate.
 * @returns {Array} An array of objects where each object represents a category and its total number of deviations.
 */
export const aggregateDataByCategory = (deviations: Deviation[]) =>
  deviations.reduce((acc, deviation) => {
    const existingEntry = acc.find((item) => item.name === deviation.category);
    if (existingEntry) {
      existingEntry.value += 1;
    } else {
      acc.push({ name: deviation.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

/**
 * Aggregate the deviations by month and year.
 *
 * @param {Array} deviations - The array of deviations to aggregate.
 * @return {Array} An array with aggregated data in the format { year: number, name: string, avvik: number }
 */
export const aggregateDeviationsByMonth = (
  deviations: {
    id: number;
    createdAt: Date;
    [key: string]: any;
  }[]
) => {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Transform each deviation into a grouping key: "YYYY-MM"
  const transformedDeviations = deviations.map((deviation) => {
    const date = new Date(deviation.createdAt);
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      monthName: monthNames[date.getMonth()],
    };
  });

  // Use a reducer to aggregate the count by month-year
  const aggregatedData = transformedDeviations.reduce((acc, curr) => {
    const key = `${curr.year}-${curr.month}`;
    if (!acc[key]) {
      acc[key] = {
        year: curr.year,
        name: curr.monthName,
        avvik: 0,
      };
    }
    acc[key].avvik += 1;
    return acc;
  }, {} as Record<string, { year: number; name: string; avvik: number }>);

  // Convert the aggregated data object back into an array
  return Object.values(aggregatedData);
};
