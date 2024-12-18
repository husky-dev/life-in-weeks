import { getDayBeginning, isStr, tsToStr, weekMs, yearMs } from '@/utils';

import { DatePeriod, Life, LifePeriod } from './types';

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

const strToDateTs = (val: string | number): number => {
  if (isStr(val) && val.toLowerCase() === 'now') return Date.now();
  if (isStr(val)) {
    // 30.06.2013
    const ukrDateMatch = /^(\d+)\.(\d+)\.(\d{4})$/g.exec(val);
    if (ukrDateMatch) {
      const [, day, month, year] = ukrDateMatch;
      return new Date(`${year}-${month}-${day}`).getTime();
    }
  }
  return new Date(val).getTime();
};

/**
 * Import
 */

export const mdToLife = (md: string): Life => {
  let birthday = 0;
  const periods: LifePeriod[] = [];
  const lines = md.split('\n');
  let item: { name: string; content: string[] } = { name: '', content: [] };
  for (const line of lines) {
    if (line.startsWith('# ')) {
      continue;
    } else if (line.startsWith('**День народженя:**')) {
      const val = line.replace('**День народженя:**', '').trim();
      birthday = strToDateTs(val);
    } else if (line.startsWith('## ')) {
      if (item.name) {
        periods.push({ name: clearName(item.name), ...parseLifePeriodContent(item.content) });
      }
      item = { name: line, content: [] };
    } else {
      item.content.push(line);
    }
  }
  if (item.name) {
    periods.push({ name: clearName(item.name), ...parseLifePeriodContent(item.content) });
  }
  return { birthday, periods };
};

export const parseLifePeriodContent = (content: string[]): Omit<LifePeriod, 'name'> => {
  const data: Omit<LifePeriod, 'name'> = { start: 0, end: 0 };
  const descrLines: string[] = [];
  for (const line of content) {
    if (!line.trim()) continue;
    if (line.startsWith('**Період:** ')) {
      const val = line.replace('**Період:** ', '').trim();
      if (val.includes(' - ')) {
        const [startStr, endStr] = val.split(' - ');
        data.start = strToDateTs(startStr);
        data.end = strToDateTs(endStr);
      } else {
        data.start = strToDateTs(val);
        data.end = data.start;
      }
    } else if (line.startsWith('**Колір:** ')) {
      data.color = line.replace('**Колір:** ', '').replace(/`/g, '').trim();
    } else if (line.startsWith('**Теги:** ')) {
      data.tags = line
        .replace('**Теги:** ', '')
        .trim()
        .split(',')
        .map(itm => itm.replace('#', '').trim());
    } else {
      descrLines.push(line);
    }
  }
  if (descrLines.length) {
    data.description = descrLines.join('\n\n');
  }
  return data;
};

const clearName = (title: string): string => {
  return title.replace(/^[#\s]+/g, '');
};

/**
 * Export
 */

export const lifeToMd = (life: Life): string => {
  const { birthday, periods } = life;
  const lines: string[] = [];
  lines.push(`# Life`);
  lines.push(`**День народженя:** ${tsToStr(birthday)}`);
  periods.forEach(period => {
    lines.push(lifePeriodToMd(period));
  });
  return lines.join('\n\n');
};

const lifePeriodToMd = (period: LifePeriod): string => {
  const { start, end, name, description, color, tags } = period;
  const lines: string[] = [];
  lines.push(`## ${name}`);
  const periodStr = start === end ? `${tsToStr(start)}` : `${tsToStr(start)} - ${tsToStr(end)}`;
  lines.push('**Період:** ' + periodStr);
  if (color) lines.push('**Колір:** `' + color + '`');
  if (tags?.length) lines.push('**Теги:** ' + tags.map(itm => '#' + itm).join(', '));
  if (description) lines.push(description);
  return lines.join('\n\n');
};
