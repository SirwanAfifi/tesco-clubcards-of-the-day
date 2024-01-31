export const getTodayDate = () => {
  const date = new Intl.DateTimeFormat("en-GB").format(new Date());
  const today = date.replace(/\//g, "-");
  return today;
};
