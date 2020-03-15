/* eslint-disable prefer-destructuring */
// eslint-disable-next-line import/prefer-default-export
export function checkCoordinates(coordsStr) {
  const crd = [];
  let latitudeTest = null;
  let longitudeTest = null;
  const coordsClear = coordsStr.replace(/\s+|\[|\]/g, '');
  const coordsSplit = coordsClear.split(',');
  if (coordsSplit.length === 2) {
    latitudeTest = coordsSplit[0].match(/^(-|–)?\d+\.\d+$/);
    longitudeTest = coordsSplit[1].match(/^(-|–)?\d+\.\d+$/);
    if (latitudeTest && longitudeTest) {
      crd[0] = latitudeTest[0];
      crd[1] = longitudeTest[0];
    } else {
      throw new Error('Введены некорректные координаты.');
    }
  } else {
    throw new Error('Введены некорректные координаты. Должны быть указаны широта и долгота.');
  }
  return crd;
}
