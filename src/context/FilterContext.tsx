import React, { createContext, useContext, useState } from 'react';

interface FilterContextType {
  filters: string[];
  setFilters: React.Dispatch<React.SetStateAction<string[]>>;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextType | null>(null);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};

interface IFilterProvider {
  children: React.ReactNode;
}

export const FilterProvider = ({ children }: IFilterProvider) => {
  const [filters, setFilters] = useState<string[]>([]);

  const clearFilters = () => setFilters([]);

  return (
    <FilterContext.Provider value={{ filters, setFilters, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
};
