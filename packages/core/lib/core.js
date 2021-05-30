'use strict';

import lodash from 'lodash';
import get from 'lodash/get';
import invoke from 'lodash/invoke';

const NEGATIVE_SYMBOL = '-';

const getDigitalValue = value =>
  lodash.chain(`${value}`).invoke('match', /(?<value>\d+)/).get('groups.value').invoke('replace', /^0+/, '').value();

const rePosition = (x, y) => {
  if (x.length > y.length) {
    return [x, y];
  } else if (x.length < y.length) {
    return [y, x];
  } else if (x > y) {
    return [x, y];
  }
  return [y, x];
}

const isNegativeOutputCheck = (x, y) =>
  get(x, 0) === get(y, 0) && get(x, 0) === NEGATIVE_SYMBOL
    || get(y, 0) === NEGATIVE_SYMBOL && getDigitalValue(rawY) > getDigitalValue(rawX)
    || get(x, 0) === NEGATIVE_SYMBOL && getDigitalValue(rawX) > getDigitalValue(rawY)
    || (get(x, 0) === NEGATIVE_SYMBOL || get(y, 0) === NEGATIVE_SYMBOL) && getDigitalValue(rawX) === getDigitalValue(rawY)
  ;

const isSubtractionCheck = (x, y) =>
  get(x, 0) === NEGATIVE_SYMBOL || get(y, 0) === NEGATIVE_SYMBOL

// NOTE: digital-string addtraction/subtraction
export const core = (...args) => {
  const { 0: rawX, 1: rawY, ...restRawArgs } = args;
  if (rawY === undefined)
    return +rawX;
  const negativeOutput = isNegativeOutputCheck(rawX, rawY);
  const isSubtraction = isSubtractionCheck(rawX, rawY);
  const newRestArgs = Object.entries(restRawArgs).map(({1: v}) => v);
  const rawDigitalX = getDigitalValue(rawX);
  const rawDigitalY = getDigitalValue(rawY);
  const [digitalX, digitalY] = rePosition(rawDigitalX, rawDigitalY);
  const x = [];
  const y = [];
  const z = [];
  let tmp = 0;
  console.log([
     negativeOutput,
     isSubtraction,
     newRestArgs,
     rawDigitalX,
     rawDigitalY,
     [digitalX, digitalY],
  ]);
  for(let char of digitalX)
    x.unshift(+char);
  for(let char of digitalY)
    y.unshift(+char);
  if (isSubtraction) {
    for(let idx = 0; idx < Math.max(x.length, y.length); idx++) {
      const subX = +get(x, idx, 0);
      const subY = +get(y, idx, 0);
      let subZ = subX - tmp - subY;
      if (subZ < 0) {
        subZ += 10;
        tmp = 1;
      } else {
        tmp = 0
      }
      z.unshift(subZ % 10);
    }
  } else {
    for(let idx = 0; idx < Math.max(x.length, y.length); idx++) {
      const subX = +get(x, idx, 0);
      const subY = +get(y, idx, 0);
      const subZ = subX + subY + tmp;
      tmp = subZ >= 10 ? 1 : 0;
      z.unshift(subZ % 10);
    }
  }
  if (negativeOutput) {
    const formattedZ = -`${tmp}${z.join('')}`;
    return core(formattedZ, ...newRestArgs);
  } else {
    const formattedZ = +`${tmp}${z.join('')}`;
    return core(formattedZ, ...newRestArgs);
  }
}
export default core;
