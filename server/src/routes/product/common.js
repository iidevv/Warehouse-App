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

export const createOptions = (name, brand) => {
  const options = [];
  const extractedOptions = extractColorAndSize(name);
  if (extractedOptions.options) {
    options.push({
      option_display_name: `${brand} options`,
      label: extractedOptions.options,
    });
  }
  if (extractedOptions.color) {
    options.push({
      option_display_name: `Color`,
      label: extractedOptions.color,
    });
  }
  if (extractedOptions.size) {
    options.push({
      option_display_name: `Size`,
      label: standardizeSize(extractedOptions.size),
    });
  }
  return options;
};

export const standardizeSize = (sizeStr) => {
  const sizes = {
    osfa: "One size",
    os: "One size",
    "one size": "One size",

    xxs: "XXS",

    xs: "XS",
    "x-small": "XS",

    s: "S",
    sm: "S",
    small: "S",

    m: "M",
    md: "M",
    med: "M",
    medium: "M",

    l: "L",
    lg: "L",
    large: "L",

    xl: "XL",
    xlarge: "XL",
    "x-large": "XL",
    extralarge: "XL",

    "2x": "2XL",
    "2xl": "2XL",
    xxlarge: "2XL",
    xxl: "2XL",
    "xx-large": "2XL",
    "double xl": "2XL",

    "3x": "3XL",
    "3xl": "3XL",
    xxxl: "3XL",
    "3X-Large": "3XL",
    "triple xl": "3XL",

    "4x": "4XL",
    "4xl": "4XL",

    "5x": "5XL",
    "5xl": "5XL",

    "6xl": "6XL",

    yl: "Y-L",

    "s-m": "S-M",
    "xl/2xl": "XL-2XL",
  };
  console.log(sizeStr);
  console.log(sizes[sizeStr.toLowerCase()]);
  return sizes[sizeStr.toLowerCase()] || sizeStr;
};

export const extractColorAndSize = (name) => {
  name = name.toLowerCase();
  const sizePattern =
    /(\bextralarge\b|\bdouble xl\b|\btriple xl\b|\b\d{1,2}x?\b|\bxx-large\b|\bx-small\b|\bx-large\b|\bmedium\b|\bxlarge\b|\bxl\/2xl\b|\bsmall\b|\blarge\b|\bxxxl\b|\bxxs\b|\bmed\b|\b2xl\b|\bxxl\b|\b3xl\b|\b4xl\b|\b5xl\b|\b6xl\b|\bs-m\b|\bxs\b|\bsm\b|\bmd\b|\blg\b|\bxl\b|\b2x\b|\b3x\b|\b4x\b|\b5x\b|\byl\b|\bs\b|\bm\b|\bl\b)/i;
  const response = {};
  if (
    name.includes(" - ") &&
    name.match(sizePattern) &&
    !name.match(/[0-9]"/) &&
    name.split("-")[1].trim().match(sizePattern)
  ) {
    response.id = 1;
    response.color = name.split("-")[0].trim();
    response.size = name.split("-")[1].replace("size", "").trim();
  } else if (name.includes("sz")) {
    response.id = 2;
    if (name.split("sz")[0].trim().length > 0)
      response.color = name.split("sz")[0].trim();
    response.size = name.split("sz")[1].trim();
  } else if (name.split(" ").length == 1 && name.match(sizePattern)) {
    response.id = 3;
    response.size = name;
  } else if (
    name.split(" ").pop().match(sizePattern) &&
    !name.match(/[0-9]"/) &&
    !name.includes("chest")
  ) {
    response.id = 4;
    response.color = name.replace(name.split(" ").pop(), "");
    response.size = name.split(" ").pop();
  } else {
    response.id = 5;
    response.options = name;
  }
  return response;
};

// Testing the function

(function extractTest() {
  const data = [
    "black - large",
    "phantom 2x",
    "indigo sz 10",
    "hi-vis sm/md",
    "sm",
    "matte black 2x",
    "oiled brown - us 8",
    "gray/burnt orange - 2xl",
    "gloss white xs",
    "light gray/blue - medium",
    "flat black factory - 2xl",
    "black/white - us 38 / eu 48",
    "metallic gray/black/yellow/red fluorescent - us 50 / eu 60",
    "SUPER 2.0 10L STRP TNKBAG BK",
    "motorcycle carrier",
    "fatbike",
    "MATTE ",
    "Matte",
    "504 wh",
    '10" - 400w',
    "2 ohm - black",
    "2-way 2 ohm",
    '8" - 7-color',
    "SHOEI RACING HELMET BAG BKBL",
    "18-30",
    "yamaha - royal",
    "Molecule",
    "2 ohm - chrome",
    'speaker bar - 21" - 4 subwoofers/2 tweeters - black',
    "2-way 2 ohm",
    '6"x9" speakers - 2 ohm',
    "md mesh blk",
    "lrg mesh sfty grn",
    "black & white flag",
    "black",
    "multi brush camo",
    "mossy oak break up country",
    "1:16 polaris pro-x 800 blue",
    "black/red md",
    "tall sm chest 38-40",
    "sz 06",
    "GREY - SIZE 7",
    "slate blue/black sz 38",
    "grey md",
  ];

  data.map((name) => {
    console.log(extractColorAndSize(name));
  });
});
