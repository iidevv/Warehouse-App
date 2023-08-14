export const removeDuplicateWords = (title, variation) => {
  const titleWords = new Set(title.toLowerCase().split(" "));
  const variationWords = variation.toLowerCase().split(" ");

  const filteredVariation = variationWords.filter(
    (word) => !titleWords.has(word)
  );

  return filteredVariation
    .join(" ")
    .toLowerCase()
    .replace(/(^\W+|\W+$)/g, "");
};
