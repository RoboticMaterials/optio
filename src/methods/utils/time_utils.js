export const getMinutesFromMoment = (m) => {
  return m.minutes() + m.hours() * 60;
};
