import { FileOpenBtn } from '@/components/Buttons';
import { CalendarPeriodInfo, CalendarWeek } from '@/components/Calendar';
import { PageFooter } from '@/components/Page';
import { Log } from '@/core/log';
import {
  DatePeriod,
  lifeToMd,
  isDateInsidePeriod,
  LifePeriod,
  lifePeriodsForPeriod,
  weeksWithStartDate,
  yearsWithStartDate,
  mdToLife,
  isLife,
} from '@/core/life';
import { mc, StyleProps } from '@/styles';
import { getDayBeginning, getFullYearsBetweenDates, getStorage, isStr, strToTs, ts, weekMs } from '@/utils';
import React, { ChangeEvent, FC, useMemo, useState } from 'react';

const log = Log('CalenderPage');

type Props = StyleProps;

const lifeStorage = getStorage({ key: 'life', version: 1, guard: isLife });

export const CalenderPage: FC<Props> = ({ className }) => {
  const [birthday, setBirthday] = useState<number>(lifeStorage.get()?.birthday || getDayBeginning(strToTs('1990-01-01')));
  const [periods, setPeriods] = useState<LifePeriod[]>(lifeStorage.get()?.periods || []);

  const curTs = useMemo(() => ts(), []);
  const [hoveredPeriods, setHoveredPeriods] = useState<LifePeriod[]>([]);

  const visiblePeriods = periods.filter(itm => !itm.hidden);

  const renderYear = (year: number) => {
    const weeks = weeksWithStartDate(year);
    return (
      <div key={`${year}`} className={mc('relative', 'flex flex-row justify-between items-center mb-1')}>
        <div className={mc('absolute w-[20px] left-[-24px]', 'text-xs font-bold text-right')}>
          <div>{getFullYearsBetweenDates(birthday, year) + 1}</div>
        </div>
        {weeks.map(week => renderWeek(week))}
      </div>
    );
  };

  const renderWeek = (weekStart: number) => {
    const weekPeriod: DatePeriod = { start: weekStart, end: weekStart + weekMs };
    const weekLifePeriods = lifePeriodsForPeriod(visiblePeriods, weekPeriod);
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
        const content = e.target?.result;
        if (!content || !isStr(content)) return alert('Import file error');
        const newData = mdToLife(content);
        setBirthday(newData.birthday);
        setPeriods(newData.periods);
        lifeStorage.set(newData);
      } catch (err) {
        log.err('Import file error', { err });
      }
    };
  };

  const handleExportClick = () => {
    const md = lifeToMd({ birthday, periods });
    const element = document.createElement('a');
    const file = new Blob([md], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'life-periods.md';
    document.body.appendChild(element);
    element.click();
    element.remove();
  };

  const handleTagClick = (name: string) => {};

  const years = yearsWithStartDate(birthday, 80);

  return (
    <div className={mc(className)}>
      <div className={mc('container', 'mx-auto', 'py-10 space-y-6')}>
        <div>
          <h1 className={mc('text-center text-3xl font-bold')}>{'Ваше життя в тижнях'}</h1>
          <p className={mc('mt-0.5', 'text-center text-xs')}>
            {'By '}
            <a className="link link-primary" href="https://husky-dev.me" target="__blank">
              {'Husky Dev'}
            </a>
          </p>
        </div>
        <div className={mc('text-center')}>
          <p>
            {`Це веб-додаток, натхненний статтею Тіма Урбана, `}
            <a
              className="link link-primary"
              href="https://waitbutwhy.com/2014/05/life-weeks.html"
              target="__blank"
              rel="nofollow"
            >
              {`"Your Life in Weeks"`}
            </a>
            {`. Він допомагає візуалізувати все своє життя в тижнях.`}
          </p>
          <p>{'Було б корисно спочатку прочитати цю статтю, щоб краще зрозуміти, про що цей додаток.'}</p>
        </div>
        <div className={mc('flex flex-row', 'grid grid-cols-12 gap-4')}>
          <div className={mc('col-start-3 col-span-8', 'space-x-1', 'flex flex-row justify-center items-center')}>
            <FileOpenBtn accept=".md,.txt" onChange={hanldeImportClick}>
              {'Import'}
            </FileOpenBtn>
            <button className={mc('btn btn-primary')} onClick={handleExportClick} type="button">
              {'Export'}
            </button>
          </div>
        </div>
        <div className={mc('grid grid-cols-12 gap-4')}>
          <div className="col-start-3 col-span-8">{years.map(year => renderYear(year))}</div>
          <div className="col-span-2 relative">
            {!!hoveredPeriods.length && (
              <div className="sticky top-2">
                <div className={mc('flex flex-col', 'space-y-4')}>
                  {hoveredPeriods.map(itm => (
                    <CalendarPeriodInfo key={`${itm.start}-${itm.end}`} item={itm} onTagClick={handleTagClick} />
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
