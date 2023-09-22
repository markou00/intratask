// Basic filtering by year
export const filterByYear = (
  filters: string[],
  data: {
    year: number;
  }[]
) => (filters.length ? data.filter((d) => filters.includes(d.year.toString())) : data);
