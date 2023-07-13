import { CalendarPeriodInfo, CalendarWeek } from '@components/Calendar';
import { PageFooter } from '@components/Page';
import {
  DatePeriod,
  LifePeriod,
  isDateInsidePeriod,
  lifePeriodsForPeriod,
  weeksWithStartDate,
  yearsWithStartDate,
} from '@core/periods';
import { useStorage } from '@core/storage';
import { mc, StyleProps } from '@styles';
import { getDayBeginning, getFullYearsBetweenDates, strToTs, ts, weekMs, yearMs } from '@utils';
import React, { FC, useMemo, useState } from 'react';

type Props = StyleProps;

export const CalenderPage: FC<Props> = ({ className }) => {
  const curTs = useMemo(() => ts(), []);
  const { birthday, periods, setBirthday, setPeriods } = useStorage();
  const [hoveredPeriods, setHoveredPeriods] = useState<LifePeriod[]>([]);

  if (!birthday) return null;
  const birthdayTs = getDayBeginning(strToTs(birthday));

  const renderYear = (year: number) => {
    const weeks = weeksWithStartDate(year);
    const yearStart = year;
    const yearEnd = year + yearMs - 1;
    const curYearHoveredPeriods = hoveredPeriods.filter(itm => itm.start >= yearStart && itm.start <= yearEnd);
    return (
      <div key={`${year}`} className={mc('relative', 'flex flex-row justify-between items-center mb-1')}>
        <div className={mc('absolute w-[20px] left-[-24px]', 'text-xs text-dove-gray font-bold text-right')}>
          <div>{getFullYearsBetweenDates(birthdayTs, year) + 1}</div>
        </div>
        {weeks.map(week => renderWeek(week))}
      </div>
    );
  };

  const renderWeek = (weekStart: number) => {
    const weekPeriod: DatePeriod = { start: weekStart, end: weekStart + weekMs };
    const weekLifePeriods = lifePeriodsForPeriod(periods, weekPeriod);
    const isCurrentWeek = isDateInsidePeriod(curTs, weekPeriod);
    return (
      <div key={`${weekStart}`} className={mc('flex justify-center items-center')}>
        <CalendarWeek
          animating={isCurrentWeek}
          periods={weekLifePeriods}
          onMouseEnter={() => setHoveredPeriods(weekLifePeriods)}
        />
      </div>
    );
  };

  const years = yearsWithStartDate(birthdayTs, 90);

  return (
    <div className={mc(className)}>
      <div className={mc('container', 'mx-auto', 'py-10 space-y-6')}>
        <div>
          <h1 className={mc('text-center text-3xl font-bold')}>{'Your Life in Weeks'}</h1>
          <p className={mc('mt-0.5', 'text-dove-gray text-center text-xs')}>
            {'By '}
            <a className="underline hover:opacity-50" href="https://husky-dev.me" target="__blank">
              {'Husky Dev'}
            </a>
          </p>
        </div>
        <div className={mc('text-dove-gray text-center')}>
          <p>
            {`This is a web application inspired by Tim Urban's article, `}
            <a className="underline" href="https://waitbutwhy.com/2014/05/life-weeks.html" target="__blank" rel="nofollow">
              {`"Your Life in Weeks"`}
            </a>
            {`. It helps you visualize your entire life in weeks.`}
          </p>
          <p>{'It would be beneficial to read this article first to better understand what this app is about.'}</p>
        </div>
        <div className={mc('grid grid-cols-12 gap-4')}>
          <div className="col-span-2" />
          <div className="col-span-8">{years.map(year => renderYear(year))}</div>
          <div className="col-span-2 relative">
            {!!hoveredPeriods.length && (
              <div className="sticky top-2">
                <div className={mc('flex flex-col', 'space-y-2')}>
                  {hoveredPeriods.map(itm => (
                    <CalendarPeriodInfo key={`${itm.start}-${itm.end}`} item={itm} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <PageFooter />
      </div>
    </div>
  );
};

export default CalenderPage;
