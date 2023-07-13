import { LifePeriod } from '@core/periods';
import { mc, ms, StyleProps } from '@styles';
import { dayMs, monthMs, TestIdProps, tsToStr, yearMs } from '@utils';
import React, { FC } from 'react';

interface Props extends StyleProps, TestIdProps {
  item: LifePeriod;
}

const yearsNumToStr = (val: number) => {
  if (val >= 9 && val <= 20) return 'років';
  const rest = val % 10;
  const base = rest <= 4 ? 'рік' : 'років';
  return [2, 3, 4].includes(rest) ? `${base}и` : base;
};

const daysNumToStr = (val: number) => {
  if (val >= 9 && val <= 20) return 'днів';
  const rest = val % 10;
  if (rest === 1) return 'день';
  return [2, 3, 4].includes(rest) ? `дня` : 'днів';
};

const monthsNumToStr = (val: number) => {
  if (val >= 9 && val <= 20) return 'місяців';
  const rest = val % 10;
  if (rest === 1) return 'місяць';
  return [2, 3, 4].includes(rest) ? `місяця` : 'місяців';
};

const periodToIntervalStr = ({ start, end }: LifePeriod) => {
  const years = Math.floor((end - start) / yearMs);
  const months = Math.floor((end - start - years * yearMs) / monthMs);
  const days = Math.floor((end - start - years * yearMs - months * monthMs) / dayMs);
  const items: string[] = [];
  if (years) {
    items.push(`${years} ${yearsNumToStr(years)}`);
  }
  if (months) {
    items.push(`${months} ${monthsNumToStr(months)}`);
  }
  if (days) {
    items.push(`${days} ${daysNumToStr(days)}`);
  }
  return items.join(', ');
};

export const CalendarPeriodInfo: FC<Props> = ({ testId, className, style, item }) => {
  const { color, name, start, end } = item;
  return (
    <div
      data-testid={testId}
      className={mc('space-y-1', className)}
      style={ms({ color, borderTop: `2px solid ${color}` }, style)}
    >
      <div className={mc('font-semibold')}>{name}</div>
      <div className={mc('text-xs')}>{`${tsToStr(start)} - ${tsToStr(end)}`}</div>
      <div className={mc('text-xs')}>{`${periodToIntervalStr(item)}`}</div>
    </div>
  );
};

export default CalendarPeriodInfo;
