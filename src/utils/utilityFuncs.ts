export function* chunkArray<T>(array: T[], chunkSize: number): Generator<T[], void, void> {
  if (chunkSize <= 0 || !Number.isInteger(chunkSize)) {
    throw new RangeError("chunkSize must be a positive integer");
  }

  for (let i = 0; i < array.length; i += chunkSize) {
    yield array.slice(i, i + chunkSize);
  }
}

export function variableMap(variables: Array<{ key: string; value: string }>): Record<string, string> {
  return Object.fromEntries(variables.map(({ key, value }) => [key, value]));
}

export function formatStringMap(text: string, variables: Array<{ key: string; value: string }>): string {
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

export function strftime(sFormat: string, locale: string, d: Date, offset_in_minutes: number, useUtc: boolean): string {
  if (typeof sFormat !== "string") {
    return "";
  }

  locale = locale.toLowerCase();
  const nTime = d.getTime();
  const date = new Date(nTime + offset_in_minutes * 60_000);

  const nDate = useUtc ? date.getUTCDate() : date.getDate();
  const nYear = useUtc ? date.getUTCFullYear() : date.getFullYear();
  const nMonth = useUtc ? date.getUTCMonth() : date.getMonth();
  const nDay = useUtc ? date.getUTCDay() : date.getDay();
  const nHour = useUtc ? date.getUTCHours() : date.getHours();
  const nMinutes = useUtc ? date.getUTCMinutes() : date.getMinutes();
  const nSeconds = useUtc ? date.getUTCSeconds() : date.getSeconds();

  const aDayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const isLeapYear = (): boolean => (nYear % 4 === 0 && nYear % 100 !== 0) || nYear % 400 === 0;
  const zeroPad = (nNum: number, nPad: number): string => (Math.pow(10, nPad) + nNum + "").slice(1);
  const getThursday = (): Date => {
    const target = new Date(date);
    target.setUTCDate(nDate - ((nDay + 6) % 7) + 3);
    return target;
  };

  return sFormat.replace(/%[a-z]+\b/gi, (sMatch: string): string => {
    return (
      ({
        "%a": date.toLocaleString(locale, { weekday: "short" }),
        "%A": date.toLocaleString(locale, { weekday: "long" }),
        "%b": date.toLocaleString(locale, { month: "short" }),
        "%B": date.toLocaleString(locale, { month: "long" }),
        "%c": date.toUTCString().replace(",", ""),
        "%C": Math.floor(nYear / 100),
        "%d": zeroPad(nDate, 2),
        "%e": nDate,
        "%F": new Date(nTime - date.getTimezoneOffset() * 60 * 1000).toISOString().slice(0, 10),
        "%G": getThursday().getFullYear(),
        "%g": (getThursday().getFullYear() + "").slice(2),
        "%H": zeroPad(nHour, 2),
        "%I": zeroPad(((nHour + 11) % 12) + 1, 2),
        "%j": zeroPad(aDayCount[nMonth] + nDate + (nMonth > 1 && isLeapYear() ? 1 : 0), 3),
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

          return zeroPad(1 + Math.ceil((n1stThu - target.getTime()) / 604800000), 2);
        })(),
        "%w": nDay,
        "%x": date.toLocaleDateString(locale),
        "%X": date.toLocaleTimeString(locale),
        "%y": (nYear + "").slice(2),
        "%Y": nYear,
        "%z": date.toTimeString().replace(/.+GMT([+-]\d+).+/, "$1"),
        "%Z": date.toTimeString().replace(/.+\((.+?)\)$/, "$1"),
        "%Zs": new Intl.DateTimeFormat(locale, {
          timeZoneName: "short",
        })
          .formatToParts(date)
          .find((oPart) => oPart.type === "timeZoneName")?.value,
      }[sMatch] || "") + "" || sMatch
    );
  });
}
