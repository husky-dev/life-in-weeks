import { isArr, isBool } from '@utils';
import { MergeStyleVals, Style } from './types';

/**
 * Merge class names
 * @param {string[]} classNames - class names
 * @returns {string} - merged class names
 * @example
 * mc('a', 'b', 'c') // 'a b c'
 * mc('a', false, 'b', undefined, 'c') // 'a b c'
 * mc('a', 'b', 'c', undefined, false) // 'a b c'
 * mc('a', 'b', 'c', undefined, false, 'd') // 'a b c d'
 */
export const mc = (...classNames: (string | boolean | undefined)[]) => classNames.filter(Boolean).join(' ');

/**
 * Merge styles
 * @param {MergeStyleVals} arr - styles
 */
export const ms = (...arr: MergeStyleVals[]): Style => {
  if (!arr.length) {
    return {};
  }
  let style: Style = {};
  for (const rawItem of arr) {
    const item = isArr(rawItem) ? ms(...rawItem) : rawItem;
    if (isBool(item)) continue;
    if (!item) continue;
    style = { ...style, ...item };
  }
  return style;
};
