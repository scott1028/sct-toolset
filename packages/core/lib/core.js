'use strict';

import get from 'lodash/get';

// NOTE: digital-string addtraction/subtraction
export const core = (...args) => {
  const { 0: rawX, 1: rawY, ...restRawArgs } = args;
  if (rawY === undefined)
    return +rawX;
  const newRestArgs = Object.entries(restRawArgs).map(({1: v}) => v);
  const x = [];
  const y = [];
  const z = [];
  let tmp = 0;
  for(let char of `${rawX}`)
    x.unshift(+char);
  for(let char of `${rawY}`)
    y.unshift(+char);
  for(let idx = 0; idx < Math.max(x.length, y.length); idx++) {
    const sub = get(x, idx, 0) + get(y, idx, 0) + tmp;
    tmp = sub >= 10 ? 1 : 0;
    z.unshift(sub % 10);
  }
  return core(`${tmp}${z.join('')}`, ...newRestArgs);
}

export default core;
