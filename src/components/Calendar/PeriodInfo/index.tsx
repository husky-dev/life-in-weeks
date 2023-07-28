import { TagBtn } from '@components/Buttons';
import { LifePeriod } from '@core/periods';
import { mc, ms, StyleProps } from '@styles';
import { dayMs, monthMs, TestIdProps, tsToStr, yearMs } from '@utils';
import React, { FC } from 'react';

interface Props extends StyleProps, TestIdProps {
  item: LifePeriod;
  onTagClick?: (name: string) => void;
}

const yearsNumToStr = (num: number) => (num === 1 ? 'year' : 'years');

const monthsNumToStr = (num: number) => (num === 1 ? 'month' : 'months');

const daysNumToStr = (num: number) => (num === 1 ? 'day' : 'days');

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

export const CalendarPeriodInfo: FC<Props> = ({ testId, className, style, item, onTagClick }) => {
  const { color, name, start, end, description, tags } = item;
  return (
    <div
      data-testid={testId}
      className={mc('space-y-2', className)}
      style={ms({ color, borderTop: `2px solid ${color}` }, style)}
    >
      <div className={mc('font-semibold')}>{name}</div>
      {!!description && <div className={mc('text-md')}>{description}</div>}
      <div className="space-y-0.5">
        <div className={mc('text-xs')}>{`${tsToStr(start)} - ${tsToStr(end)}`}</div>
        <div className={mc('text-xs font-semibold')}>{`${periodToIntervalStr(item)}`}</div>
      </div>
      {!!tags && !!tags.length && (
        <div className="flex flex-row flex-wrap">
          {tags.map(itm => (
            <TagBtn key={itm} onClick={() => onTagClick && onTagClick(itm)}>
              {`#${itm}`}
            </TagBtn>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarPeriodInfo;
