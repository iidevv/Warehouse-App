export const getFormattedDate = (inputDate, format) => {
  const date = inputDate ? new Date(inputDate) : new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  if (format == "non-dashed") return `${year}${month}${day}`;

  return `${year}-${month}-${day}`;
};
