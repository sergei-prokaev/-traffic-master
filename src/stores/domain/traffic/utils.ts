import {ITrafficResponse} from '../../../service';
import {typeCheck} from '../../../utils';

export const brandMapper = (item: ITrafficResponse) => ({brand: item.brand ?? '', id: item.id ?? ''});
export const brandFilter = (color?: string, type?: string) => (item: ITrafficResponse) => {
  if (color === null || type === null) {
    throw new Error(`brandFilter expects arguments are not null`);
  }
  if (color && !type) {
    return item.colors.includes(color);
  } else if (type && !color) {
    return item.type === type;
  } else {
    return item.colors.includes(color as string) && item.type === type;
  }
};

export const makeColors = (data: ITrafficResponse[], sortFn: (a: string, b: string) => number) => {
  if (typeCheck(data) !== 'array' || typeCheck(sortFn) !== 'function') {
    throw new Error(
      `makeColors expects data is an array, sort is a function, but got data: ${typeCheck(data)}, sort: ${typeCheck(
        makeColors,
      )}`,
    );
  }
  const colorsSet = new Set<string>();
  const _colors = [];
  for (const item of data) {
    _colors.push(...item.colors);
  }
  _colors.forEach((color) => colorsSet.add(color));
  return Array.from(colorsSet).sort(sortFn);
};

export const makeTypes = (data: ITrafficResponse[], sortFn: (a: string, b: string) => number) => {
  if (typeCheck(data) !== 'array' || typeCheck(sortFn) !== 'function') {
    throw new Error(
      `makeTypes expects data is an array, sort is a function, but got data: ${typeCheck(data)}, sort: ${typeCheck(
        makeColors,
      )}`,
    );
  }
  const typesSet = new Set<string>();
  for (const item of data) {
    typesSet.add(item.type);
  }
  return Array.from(typesSet).sort(sortFn);
};
