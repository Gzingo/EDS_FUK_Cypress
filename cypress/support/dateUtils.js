import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

let lastRecordedTime = null;

export function compareDateTime(dateText, format = 'DD.MM.YYYY HH:mm', minutesTolerance = 5) {
  const cleanedText = dateText.replace(/\u00a0/g, ' ').trim();
  const dateOnUI = dayjs(cleanedText, format);
  const timeNow = dayjs();
  const timeGap = Math.abs(timeNow.diff(dateOnUI, 'minute'));
  console.log('cleaned: ', cleanedText);
  console.log('onUI: ', dateOnUI);
  console.log('realTime: ', timeNow);
  console.log('gap: ', timeGap);
  expect(timeGap).to.be.lessThan(minutesTolerance);
}

export function recordCurrentTimestamp() {
  lastRecordedTime = dayjs().format('DD.MM.YYYY HH:mm');
  cy.wrap(lastRecordedTime).as('savedTime');
  return lastRecordedTime;
}

export function getRecordedTimestamp() {
  return lastRecordedTime;
}

export function assertTimestampInList(selector, timestamp) {
  const expected = dayjs(timestamp, 'DD.MM.YYYY HH:mm');

  cy.get(selector).then(($rows) => {
    const match = [...$rows].some((row) => {
      const text = row.textContent.trim();
      const timeMatch = text.match(/\d{2}\.\d{2}\.\d{4}\. \d{2}:\d{2}/);

      if (timeMatch) {
        const actual = dayjs(timeMatch[0], 'DD.MM.YYYY HH:mm');
        const diff = Math.abs(actual.diff(expected, 'minute'));
        return diff <= 2;
      }

      return false;
    });

    expect(
      match,
      match
        ? `Timestamp close to ${timestamp} (±2min) was found in the list`
        : `Timestamp close to ${timestamp} (±2min) was NOT found in the list`
    ).to.be.true;
  });
}

export function assertTimestampNotInList(selector, timestamp) {
  const forbiddenTime = dayjs(timestamp, 'DD.MM.YYYY. HH:mm');

  cy.get(selector).then(($rows) => {
    const match = [...$rows].some((row) => {
      const text = row.textContent.trim();
      const timeMatch = text.match(/\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}/);

      if (timeMatch) {
        const actual = dayjs(timeMatch[0], 'DD.MM.YYYY HH:mm');
        const diff = Math.abs(actual.diff(forbiddenTime, 'minute'));
        return diff <= 1;
      }

      return false;
    });

    expect(match, `No timestamp within ±2min of ${timestamp} should exist`).to.be.false;
  });
}

export function assertTimestampInSecondCellOfFirstRow(expectedTimestamp) {
  cy.get('td')
    .eq(1)
    .invoke('text')
    .then((actualText) => {
      const trimmedText = actualText.trim();
      // Parse the time from the cell
      const actualTime = dayjs(trimmedText, 'DD.MM.YYYY HH:mm');
      if (!actualTime.isValid()) {
        throw new Error(`Invalid date in the cell: "${trimmedText}"`);
      }
      // Parse expected Time
      const expectedTime = dayjs(expectedTimestamp, 'DD.MM.YYYY HH:mm');
      if (!expectedTime.isValid()) {
        throw new Error(`Invalid expected date: "${expectedTimestamp}"`);
      }
      // Calculate the difference
      const timeDiff = Math.abs(actualTime.valueOf() - expectedTime.valueOf());
      const allowedTime = 60 * 5000;
      expect(timeDiff).to.be.lessThan(allowedTime);
    });
}
