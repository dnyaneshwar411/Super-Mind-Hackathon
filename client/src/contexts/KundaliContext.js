"use client"

import { createContext, useContext, useState } from "react"

const KundaliContext = createContext();

export function KundaliProvider({ children }) {
  const [data, setData] = useState({
    navasmaChart: [],
    planetsChart: []
  })

  return <KundaliContext.Provider value={{
    data,
    setData
  }}>
    {children}
  </KundaliContext.Provider>
}

export default function useKundaliContext() {
  const context = useContext(KundaliContext);
  return context;
}