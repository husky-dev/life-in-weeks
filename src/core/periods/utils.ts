import { getDayBeginning, isBool, isNum, isStr, isStrArr, isUnknownDict, weekMs, yearMs } from '@utils';

import { DatePeriod, LifePeriod } from './types';

export const yearsWithStartDate = (start: number, n: number): number[] => {
  const dates: number[] = [];
  const startTs = getDayBeginning(start);
  for (let i = 0; i < n; i++) {
    dates.push(startTs + yearMs * i);
  }
  return dates;
};

export const weeksWithStartDate = (start: number): number[] => {
  const dates: number[] = [];
  const startTs = getDayBeginning(start);
  for (let i = 0; i < 52; i++) {
    dates.push(startTs + i * weekMs);
  }
  return dates;
};

export const lifePeriodsForPeriod = (lifePeriods: LifePeriod[], period: DatePeriod): LifePeriod[] => {
  const periodMiddleTs = getPeriodMiddle(period);
  return lifePeriods.filter(lifePeriod => isDateInsidePeriod(periodMiddleTs, lifePeriod));
};

export const isDateInsidePeriod = (date: number, { start, end }: DatePeriod): boolean => date >= start && date <= end;

const getPeriodMiddle = ({ start, end }: DatePeriod) => start + (end - start) / 2;

export const dataToPeriod = (val: unknown): LifePeriod | undefined => {
  if (!isUnknownDict(val)) return undefined;
  const { name, start: rawStart, end: rawEnd } = val;
  if (!isStr(name) || !(isStr(rawStart) || isNum(rawStart)) || !(isStr(rawEnd) || isNum(rawEnd))) return undefined;
  const start = strToDateTs(rawStart);
  if (isNaN(start)) return undefined;
  const end = strToDateTs(rawEnd);
  if (isNaN(end)) return undefined;
  const color = isStr(val.color) ? val.color : '#eee';
  const tags = isStrArr(val.tags) ? val.tags : [];
  const description = isStr(val.description) ? val.description : undefined;
  const hidden = isBool(val.hidden) ? val.hidden : false;
  return { name, start, end, description, color, tags, hidden };
};

const strToDateTs = (val: string | number): number => {
  if (isStr(val) && val.toLowerCase() === 'now') return Date.now();
  return new Date(val).getTime();
};
