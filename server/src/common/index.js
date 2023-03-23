export const createNewDate = () => {
  const options = {
    timeZone: "America/Los_Angeles",
  };
  const date = new Date();
  const dateString = date.toLocaleString("en-US", options);
  return dateString;
};
