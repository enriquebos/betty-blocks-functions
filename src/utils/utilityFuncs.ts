export function* chunkArray<T>(
  array: T[],
  chunkSize: number,
): Generator<T[], void, void> {
  if (chunkSize <= 0 || !Number.isInteger(chunkSize)) {
    throw new RangeError("chunkSize must be a positive integer");
  }

  for (let i = 0; i < array.length; i += chunkSize) {
    yield array.slice(i, i + chunkSize);
  }
}

export function variableMap(
  variables: { key: string; value: string }[],
): Record<string, string> {
  return Object.fromEntries(variables.map(({ key, value }) => [key, value]));
}

export function formatStringMap(
  text: string,
  variables: { key: string; value: string }[],
): string {
  const regex = /\{\{(!|&|\{)?\s*(.*?)\s*}}+/g;
  const variableMap = new Map(variables.map((v) => [v.key, v.value]));

  return text.replace(regex, (match, _prefix, key) => {
    if (variableMap.has(key)) {
      return variableMap.get(key);
    } else {
      console.log(`Unknown map variable '${key}' in text field`);
      return match;
    }
  });
}

export function strftime(sFormat: string, date: Date = new Date()): string {
  if (typeof sFormat !== "string") {
    return "";
  }

  const nDay = date.getUTCDay();
  const nDate = date.getUTCDate();
  const nMonth = date.getUTCMonth();
  const nYear = date.getUTCFullYear();
  const nHour = date.getUTCHours();
  const nMinutes = date.getUTCMinutes();
  const nSeconds = date.getUTCSeconds();
  const nTime = date.getTime();
  const aDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const aMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const aDayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const isLeapYear = (): boolean =>
    (nYear % 4 === 0 && nYear % 100 !== 0) || nYear % 400 === 0;
  const getThursday = (): Date => {
    const target = new Date(date);
    target.setUTCDate(nDate - ((nDay + 6) % 7) + 3);
    return target;
  };
  const zeroPad = (nNum: number, nPad: number): string =>
    (Math.pow(10, nPad) + nNum + "").slice(1);

  return sFormat.replace(/%[a-z]+\b/gi, (sMatch: string): string => {
    return (
      ({
        "%a": aDays[nDay].slice(0, 3),
        "%A": aDays[nDay],
        "%b": aMonths[nMonth].slice(0, 3),
        "%B": aMonths[nMonth],
        "%c": date.toUTCString().replace(",", ""),
        "%C": Math.floor(nYear / 100),
        "%d": zeroPad(nDate, 2),
        "%e": nDate,
        "%F": new Date(nTime - date.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 10),
        "%G": getThursday().getFullYear(),
        "%g": (getThursday().getFullYear() + "").slice(2),
        "%H": zeroPad(nHour, 2),
        "%I": zeroPad(((nHour + 11) % 12) + 1, 2),
        "%j": zeroPad(
          aDayCount[nMonth] + nDate + (nMonth > 1 && isLeapYear() ? 1 : 0),
          3,
        ),
        "%k": nHour,
        "%l": ((nHour + 11) % 12) + 1,
        "%m": zeroPad(nMonth + 1, 2),
        "%n": nMonth + 1,
        "%M": zeroPad(nMinutes, 2),
        "%p": nHour < 12 ? "AM" : "PM",
        "%P": nHour < 12 ? "am" : "pm",
        "%s": Math.round(nTime / 1000),
        "%S": zeroPad(nSeconds, 2),
        "%u": nDay || 7,
        "%V": (() => {
          const target = getThursday();
          const n1stThu = target.valueOf();
          target.setMonth(0, 1);
          const nJan1 = target.getDay();

          if (nJan1 !== 4) {
            target.setMonth(0, 1 + ((4 - nJan1 + 7) % 7));
          }

          return zeroPad(
            1 + Math.ceil((n1stThu - target.getTime()) / 604800000),
            2,
          );
        })(),
        "%w": nDay,
        "%x": date.toLocaleDateString(),
        "%X": date.toLocaleTimeString(),
        "%y": (nYear + "").slice(2),
        "%Y": nYear,
        "%z": date.toTimeString().replace(/.+GMT([+-]\d+).+/, "$1"),
        "%Z": date.toTimeString().replace(/.+\((.+?)\)$/, "$1"),
        "%Zs": new Intl.DateTimeFormat("default", {
          timeZoneName: "short",
        })
          .formatToParts(date)
          .find((oPart) => oPart.type === "timeZoneName")?.value,
      }[sMatch] || "") + "" || sMatch
    );
  });
}
