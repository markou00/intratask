import React, { createContext, useContext, useState } from 'react';

interface RedCardsContextType {
  redCardIds: number[];
  setRedCardIds: React.Dispatch<React.SetStateAction<number[]>>;
}

const RedCardsContext = createContext<RedCardsContextType | null>(null);

export const useRedCards = () => {
  const context = useContext(RedCardsContext);
  if (!context) {
    throw new Error('useRedCards must be used within a RedCardsProvider');
  }
  return context;
};

interface IRedCardsProvider {
  children: React.ReactNode;
}

export const RedCardsProvider = ({ children }: IRedCardsProvider) => {
  const [redCardIds, setRedCardIds] = useState<number[]>([]);

  return (
    <RedCardsContext.Provider value={{ redCardIds, setRedCardIds }}>
      {children}
    </RedCardsContext.Provider>
  );
};
