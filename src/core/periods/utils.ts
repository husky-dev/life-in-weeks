import { getDayBeginning, weekMs, yearMs } from '@utils';
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
