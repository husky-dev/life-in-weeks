import { isArr, isStrOrUndef, isUnknownDict } from '@utils';
import React, { createContext, FC, ReactNode, useContext, useMemo, useState } from 'react';

import { getStorageParam } from './utils';
import { LifePeriod } from '@core/periods';

interface State {
  birthday?: string;
  periods: LifePeriod[];
}

export const isState = (val: unknown): val is State => isUnknownDict(val) && isStrOrUndef(val.birthday) && isArr(val.periods);

interface StorageContext extends State {
  setBirthday: (val: string | undefined) => void;
  setPeriods: (val: LifePeriod[]) => void;
  setState: (val: State) => void;
}

const StorageContext = createContext<StorageContext>({
  periods: [],
  setBirthday: () => {},
  setPeriods: () => {},
  setState: () => {},
});

export const useStorage = () => useContext(StorageContext);

const stateStorage = getStorageParam('state', isState);
const storedState = stateStorage.get();

export const StorageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<State>(storedState ? storedState : { periods: [] });

  const setBirthday = (birthday: string | undefined) => {
    setState({ ...state, birthday });
    stateStorage.set({ ...state, birthday });
  };

  const setPeriods = (periods: LifePeriod[]) => {
    setState({ ...state, periods });
    stateStorage.set({ ...state, periods });
  };

  const setNewState = (newState: State) => {
    setState(newState);
    stateStorage.set(newState);
  };

  const value = useMemo(() => ({ ...state, setBirthday, setPeriods, setState: setNewState }), [state]);

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
};
