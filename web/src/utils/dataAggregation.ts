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
