import { LifePeriod } from '@core/periods';
import { mc, StyleProps } from '@styles';
import React, { FC, MouseEvent } from 'react';

interface Props extends StyleProps {
  periods?: LifePeriod[];
  animating?: boolean;
  onMouseEnter?: (e?: MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e?: MouseEvent<HTMLDivElement>) => void;
}

export const CalendarWeek: FC<Props> = ({ className, periods = [], animating, onMouseEnter, onMouseLeave }) => {
  const showBorder = periods.length ? false : true;
  const showPointer = periods.length ? true : false;
  return (
    <div
      className={mc(
        'w-3 h-3',
        'flex flex-col',
        'rounded-sm overflow-hidden',
        'hover:opacity-50',
        'transition-opacity',
        showPointer && 'cursor-pointer',
        showBorder && !animating && 'border border-dove-gray/50',
        animating && 'animate-pulse bg-carbon-gray',
        className,
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {periods.map(({ start, end, color }) => (
        <div key={`${start}-${end}`} className={mc('flex-1 w-full')} style={{ backgroundColor: color }} />
      ))}
    </div>
  );
};

export default CalendarWeek;
