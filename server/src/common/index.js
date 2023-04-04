export const createNewDate = () => {
  const options = {
    timeZone: "America/Los_Angeles",
  };

  const date = new Date();
  const sixHoursInMilliseconds = 7 * 60 * 60 * 1000; // 6 hours * 60 minutes * 60 seconds * 1000 milliseconds
  const adjustedDate = new Date(date.getTime() + sixHoursInMilliseconds);
  const dateString = adjustedDate.toLocaleString("en-US", options);

  return dateString;
};
