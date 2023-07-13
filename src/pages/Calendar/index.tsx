import { CalendarWeek } from '@components/Calendar';
import { PageFooter } from '@components/Page';
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
          <div className={mc('absolute w-[20px] left-[-24px]', 'text-xs text-dove-gray font-bold text-right')}>
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
      <div className={mc('container', 'mx-auto', 'py-10 space-y-6')}>
        <h1 className={mc('text-center text-2xl font-semibold')}>{'Your Life in Weeks'}</h1>
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
        <div>{years.map(year => renderYear(year))}</div>
        <PageFooter />
      </div>
    </div>
  );
};

export default CalenderPage;
