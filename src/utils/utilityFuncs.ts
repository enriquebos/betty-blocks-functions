export function* chunkArray<T>(array: T[], chunkSize: number): Generator<T[], void, void> {
  if (chunkSize <= 0 || !Number.isInteger(chunkSize)) {
    throw new RangeError("chunkSize must be a positive integer");
  }

  for (let i = 0; i < array.length; i += chunkSize) {
    yield array.slice(i, i + chunkSize);
  }
}

export function variableMap(variables: { key: string; value: string }[]): Record<string, string> {
  return Object.fromEntries(variables.map(({ key, value }) => [key, value]));
}

export function mergeAndUpdate(
  source: Record<string, unknown>,
  target: Record<string, unknown>,
  flipUpdate = false,
): Record<string, unknown> {
  return Object.keys(source).reduce(
    (acc, key) => (key in acc ? { ...acc, [key]: flipUpdate ? target[key] : source[key] } : acc),
    { ...target },
  );
}

export function transformData(input: MappingItem[]): Record<string, unknown> {
  return input.reduce(
    (acc, { key, value }) => {
      const keyName = key[0]?.name;
      if (!keyName) return acc;

      acc[keyName] =
        value !== null && typeof value === "object" && "id" in value
          ? (value as { id: unknown }).id
          : value;

      return acc;
    },
    {} as Record<string, unknown>,
  );
}

export function getAllValues(obj: Record<string, unknown>): unknown[] {
  let values: unknown[] = [];

  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      values = values.concat(getAllValues(obj[key] as Record<string, unknown>));
    } else {
      values.push(obj[key]);
    }
  }

  return values;
}

export function strftime(
  sFormat: string,
  locale: string,
  date: Date,
  offset_in_minutes: number,
  useUtc: boolean,
): string {
  if (typeof sFormat !== "string") {
    return "";
  }

  locale = locale.toLowerCase();
  const nTime = date.getTime();
  const newDate = new Date(nTime + offset_in_minutes * 60_000);

  const nDate = useUtc ? newDate.getUTCDate() : newDate.getDate();
  const nYear = useUtc ? newDate.getUTCFullYear() : newDate.getFullYear();
  const nMonth = useUtc ? newDate.getUTCMonth() : newDate.getMonth();
  const nDay = useUtc ? newDate.getUTCDay() : newDate.getDay();
  const nHour = useUtc ? newDate.getUTCHours() : newDate.getHours();
  const nMinutes = useUtc ? newDate.getUTCMinutes() : newDate.getMinutes();
  const nSeconds = useUtc ? newDate.getUTCSeconds() : newDate.getSeconds();

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
        "%a": newDate.toLocaleString(locale, {
          weekday: "short",
          ...(useUtc ? { timeZone: "UTC" } : {}),
        }),
        "%A": newDate.toLocaleString(locale, {
          weekday: "long",
          ...(useUtc ? { timeZone: "UTC" } : {}),
        }),
        "%b": newDate.toLocaleString(locale, {
          month: "short",
          ...(useUtc ? { timeZone: "UTC" } : {}),
        }),
        "%B": newDate.toLocaleString(locale, {
          month: "long",
          ...(useUtc ? { timeZone: "UTC" } : {}),
        }),
        "%c": newDate.toUTCString().replace(",", ""),
        "%C": Math.floor(nYear / 100),
        "%d": zeroPad(nDate, 2),
        "%e": nDate,
        "%F": new Date(nTime - newDate.getTimezoneOffset() * 60 * 1000).toISOString().slice(0, 10),
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
        "%x": newDate.toLocaleDateString(locale),
        "%X": newDate.toLocaleTimeString(locale),
        "%y": (nYear + "").slice(2),
        "%Y": nYear,
        "%z": newDate.toTimeString().replace(/.+GMT([+-]\d+).+/, "$1"),
        "%Z": newDate.toTimeString().replace(/.+\((.+?)\)$/, "$1"),
        "%Zs": new Intl.DateTimeFormat(locale, {
          timeZoneName: "short",
        })
          .formatToParts(newDate)
          .find((oPart) => oPart.type === "timeZoneName")?.value,
      }[sMatch] || "") + "" || sMatch
    );
  });
}
