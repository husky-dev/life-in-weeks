import { FileOpenBtn } from '@components/Buttons';
import { CalendarPeriodInfo, CalendarWeek } from '@components/Calendar';
import { PageFooter } from '@components/Page';
import { Log } from '@core/log';
import {
  DatePeriod,
  isDateInsidePeriod,
  LifePeriod,
  lifePeriodsForPeriod,
  weeksWithStartDate,
  yearsWithStartDate,
} from '@core/periods';
import { dataToState, useStorage } from '@core/storage';
import { mc, StyleProps } from '@styles';
import { getDayBeginning, getFullYearsBetweenDates, isStr, strToTs, ts, weekMs } from '@utils';
import React, { ChangeEvent, FC, useMemo, useState } from 'react';

const log = Log('CalenderPage');

type Props = StyleProps;

export const CalenderPage: FC<Props> = ({ className }) => {
  const curTs = useMemo(() => ts(), []);
  const { birthday, periods, setBirthday, setPeriods, setState } = useStorage();
  const [hoveredPeriods, setHoveredPeriods] = useState<LifePeriod[]>([]);

  const birthdayTs = getDayBeginning(strToTs(birthday || '1990-01-01'));

  const renderYear = (year: number) => {
    const weeks = weeksWithStartDate(year);
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

  const hanldeImportClick = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = e => {
      try {
        const result = e.target?.result;
        if (!result || !isStr(result)) return alert('Import file error');
        const data = dataToState(JSON.parse(result));
        if (!data) return alert('Import file error');
        setState(data);
      } catch (err) {
        log.err('Import file error', { err });
      }
    };
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
        <div className={mc('flex flex-row', 'grid grid-cols-12 gap-4')}>
          <div className={mc('col-start-3 col-span-8', 'space-x-1', 'flex flex-row justify-center items-center')}>
            <FileOpenBtn accept=".json,application/json" onChange={hanldeImportClick}>
              {'Import'}
            </FileOpenBtn>
          </div>
        </div>
        <div className={mc('grid grid-cols-12 gap-4')}>
          <div className="col-start-3 col-span-8">{years.map(year => renderYear(year))}</div>
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
