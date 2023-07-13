import { compact, isArr, isNum, isStr, isStrArr, isStrOrUndef, isUndef, isUnknownDict } from '@utils';
import React, { createContext, FC, ReactNode, useContext, useMemo, useState } from 'react';

import { getStorageParam } from './utils';
import { LifePeriod } from '@core/periods';

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

const dataToPeriod = (val: unknown): LifePeriod | undefined => {
  if (!isUnknownDict(val)) return undefined;
  const { name, start: rawStart, end: rawEnd } = val;
  if (!isStr(name) || !(isStr(rawStart) || isNum(rawStart)) || !(isStr(rawEnd) || isNum(rawEnd))) return undefined;
  const start = new Date(rawStart).getTime();
  if (isNaN(start)) return undefined;
  const end = new Date(rawEnd).getTime();
  if (isNaN(end)) return undefined;
  const color = isStr(val.color) ? val.color : '#eee';
  const tags = isStrArr(val.tags) ? val.tags : [];
  const description = isStr(val.description) ? val.description : undefined;
  return { name, start, end, description, color, tags };
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

  const value = useMemo(() => ({ ...state, setBirthday, setPeriods, setState: setNewState }), [state]);

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
};
