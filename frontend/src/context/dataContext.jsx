import { createContext, useState } from 'react';

export const DataContext = createContext(null);

export const DataContextProvider = ({ children }) => {
  const [data, setData] = useState({
    profile: undefined,
    posts: null,
    theme: localStorage.getItem('theme') ?? 'light'
  });

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};
