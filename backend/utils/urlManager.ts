export const validateURL = (url:string) => {
  var regExp =
    /^https:\/\/www\.google\.com\/maps\/dir\/.*?\/@-?\d+\.\d+,-?\d+\.\d+,\d+z/;
  return regExp.test(url);
};

export const getId = (url:string) => {
  var regExp = /\/dir\/([^\/]+)\/([^\/]+)\/@/;
  var match = url.match(regExp);
  if (match && match.length === 3) {
    var startPlace = decodeURIComponent(match[1].replace(/\+/g, " "))
      .toLowerCase()
      .replace(/\s+/g, "-");
    var endPlace = decodeURIComponent(match[2].replace(/\+/g, " "))
      .toLowerCase()
      .replace(/\s+/g, "-");
    return startPlace + "_" + endPlace;
  } else {
    return "";
  }
};
