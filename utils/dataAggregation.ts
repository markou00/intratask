import { Deviation } from "@prisma/client";

/**
 * Aggregates an array of deviations by category and calculates the total number of deviations for each category.
 *
 * @param {Deviation[]} deviations - The list of deviations to aggregate.
 * @returns {Array} An array of objects where each object represents a category and its total number of deviations.
 */
export const aggregateDataByCategory = (deviations: Deviation[]) =>
  deviations.reduce((acc, deviation) => {
    const existingEntry = acc.find(
      (item: any) => item.name === deviation.category
    );
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
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Transform each deviation into a grouping key: "YYYY-MM"
  const transformedDeviations = deviations
    .filter((deviation) => deviation.status !== "Forslag")
    .map((deviation) => {
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

/**
 * Aggregate the deviations by month, year, and category.
 *
 * @param {Array} deviations - The array of deviations to aggregate.
 * @return {Array} An array with aggregated data by month and category.
 */
export const aggregateDeviationsByMonthAndCategory = (
  deviations: Deviation[]
) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Transform each deviation into a grouping key: "YYYY-MM-category"
  const transformedDeviations = deviations
    .filter((deviation) => deviation.status !== "Forslag")
    .map((deviation) => {
      const date = new Date(deviation.createdAt);
      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        monthName: monthNames[date.getMonth()],
        category: deviation.category,
      };
    });

  // Use a reducer to aggregate the count by month-year-category
  const aggregatedData = transformedDeviations.reduce((acc, curr) => {
    const key = `${curr.year}-${curr.month}-${curr.category}`;
    if (!acc[key]) {
      acc[key] = {
        year: curr.year,
        name: curr.monthName,
        [curr.category]: 0,
      };
    }
    acc[key][curr.category] += 1;
    return acc;
  }, {} as Record<string, any>);

  // Convert the aggregated data object back into an array
  return Object.values(aggregatedData);
};

/**
 * Extracts and returns all unique categories from the provided aggregated data.
 *
 * @param {Array<Object>} data - The aggregated data where each object represents a month's aggregate.
 * @returns {string[]} An array of unique categories found in the data.
 *
 * @example
 * const data = [
 *   { name: 'Jan', year: 2022, HMS: 4000, Kvalitet: 2400 },
 *   { name: 'Feb', year: 2021, Ytremiljø: 1290 }
 * ];
 * getUniqueCategories(data); // Returns ['HMS', 'Kvalitet', 'Ytremiljø']
 */
export const getUniqueCategories = (data: any[]): string[] => {
  const categoriesSet: Set<string> = new Set();
  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (key !== "name" && key !== "year") {
        categoriesSet.add(key);
      }
    });
  });
  return Array.from(categoriesSet);
};
