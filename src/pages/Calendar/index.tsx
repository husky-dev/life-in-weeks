import { CalendarWeek } from '@components/Calendar';
import { DatePeriod, isDateInsidePeriod, lifePeriodsForPeriod, weeksWithStartDate, yearsWithStartDate } from '@core/periods';
import { useStorage } from '@core/storage';
import { mc, StyleProps } from '@styles';
import { getDayBeginning, getFullYearsBetweenDates, strToTs, ts, weekMs, yearMs } from '@utils';
import React, { FC, useMemo } from 'react';

type Props = StyleProps;

export const CalenderPage: FC<Props> = ({ className }) => {
  const curTs = useMemo(() => ts(), []);
  const { birthday, periods, setBirthday, setPeriods } = useStorage();

  if (!birthday) return null;
  const birthdayTs = getDayBeginning(strToTs(birthday));

  const renderYear = (year: number) => {
    const weeks = weeksWithStartDate(year);
    const yearStart = year;
    const yearEnd = year + yearMs - 1;
    return (
      <div key={`${year}`} className={mc('flex flex-row justify-center items-center mb-1')}>
        <div className="relative flex flex-row justify-center">
          <div className={mc('absolute w-[20px] left-[-24px]', 'text-xs font-bold text-right')}>
            <div>{getFullYearsBetweenDates(birthdayTs, year) + 1}</div>
          </div>
          {weeks.map(week => renderWeek(week))}
        </div>
      </div>
    );
  };

  const renderWeek = (weekStart: number) => {
    const weekPeriod: DatePeriod = { start: weekStart, end: weekStart + weekMs };
    const weekLifePeriods = lifePeriodsForPeriod(periods, weekPeriod);
    const isCurrentWeek = isDateInsidePeriod(curTs, weekPeriod);
    return (
      <div key={`${weekStart}`} className={mc('p-0.5', 'flex justify-center items-center')}>
        <CalendarWeek animating={isCurrentWeek} periods={weekLifePeriods} />
      </div>
    );
  };

  const years = yearsWithStartDate(birthdayTs, 80);

  return (
    <div className={mc(className)}>
      <div className={mc('container', 'mx-auto', 'py-16')}>
        <h1 className={mc('text-center text-2xl')}>{'Your Life in Weeks'}</h1>
        <div className={mc('mt-10')}>{years.map(year => renderYear(year))}</div>
      </div>
    </div>
  );
};

export default CalenderPage;
