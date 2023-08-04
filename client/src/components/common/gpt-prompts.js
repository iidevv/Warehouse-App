export const searchKeywordsPrompt = (title, description) => {
  if (description) {
    description = `Product description: ${description}`;
  }
  return `Product ${title} create comma-separated list of 4 search keywords (Don't use quotation marks). ${description}`;
};

export const metaKeywordsPrompt = (title, description) => {
  if (description) {
    description = `Product description: ${description}`;
  }
  return `Product ${title} create comma-separated list of 4 meta keywords use DMG (Don't use quotation marks). ${description}`;
};

export const metaDescriptionPrompt = (title, description) => {
  if (description) {
    description = `Product description: ${description}`;
  }
  return `Product ${title} create meta description use Discount Moto Gear (Don't use quotation marks). ${description}`;
};

export const descriptionPrompt = (title, description) => {
  if (description) {
    description = `Combine description with existing description: ${description}`;
  }
  return `Product ${title} create description use Discount Moto Gear (html format response, don't use title tags (h1,h2,h3 etc), if contains a list before list use list title: <p><strong>Features:</strong></p>) ${description}`;
};