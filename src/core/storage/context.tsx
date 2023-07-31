import { dataToPeriod, LifePeriod } from '@core/periods';
import { compact, isArr, isStr, isStrOrUndef, isUnknownDict } from '@utils';
import React, { createContext, FC, ReactNode, useContext, useMemo, useState } from 'react';

import { getStorageParam } from './utils';

interface State {
  birthday?: string;
  periods: LifePeriod[];
}

export const isState = (val: unknown): val is State => isUnknownDict(val) && isStrOrUndef(val.birthday) && isArr(val.periods);

export const dataToState = (data: unknown): State | undefined => {
  if (!isUnknownDict(data)) {
    return undefined;
  }
  const { birthday } = data;
  if (!isStr(birthday)) return undefined;
  if (!isArr(data.periods)) return { birthday, periods: [] };
  const periods = compact(data.periods.map(dataToPeriod));
  return { birthday, periods };
};

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

  const value = useMemo(() => ({ ...state, setBirthday, setPeriods, setState: setNewState }), [state.birthday, state.periods]);

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
};
