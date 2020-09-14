// export function generateOptions(length, excludedOptions) {
//   const arr = [];
//   for (let value = 0; value < length; value++) {
//     if (excludedOptions.indexOf(value) < 0) {
//       arr.push(value);
//     }
//   }
//   return arr;
// }
//
// export function disabledHours(a,b,c,d) {
//   return [];
// }

export function disabledMinutes(h) {
  switch (h) {
    case 0:
      return [0];
    default:
      return[];
  }
}

// export function disabledSeconds(h, m) {
//   return [h + m % 60];
// }
