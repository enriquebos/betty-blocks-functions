import { strftime } from "../../utils/utilityFuncs";

interface DateStrftimeParams {
  datetime: Date | string;
  locale: string;
  strftimeDefault: string;
  strftimeStr?: string;
  timeZoneOffset: number;
  useUtc: boolean;
}

const dateStrftime = async ({
  datetime,
  locale,
  strftimeDefault,
  strftimeStr,
  timeZoneOffset,
  useUtc,
}: DateStrftimeParams): Promise<{ result: string | number | object }> => {
  console.log({ start: { datetime, locale, strftimeDefault, strftimeStr, timeZoneOffset, useUtc } });
  const strFormat = strftimeDefault !== "custom" ? strftimeDefault : strftimeStr;
  console.log({ strFormat });
  let datetimeObject: Date;

  if (!strFormat) {
    throw new Error("Custom strtime is not defined");
  }

  console.log({ typeofDate: typeof datetime });

  console.log({ dateInstance: datetime instanceof Date });

  if (datetime instanceof Date) {
    datetimeObject = datetime;
  } else if (
    !datetime ||
    (typeof datetime === "string" &&
      datetime
        .toLowerCase()
        .trim()
        .match(/^(now|today)$/))
  ) {
    datetimeObject = new Date();
  } else if (typeof datetime === "string" && datetime.match(/^\d+$/)) {
    datetimeObject = new Date(parseInt(datetime) * 1000);
  } else {
    datetimeObject = new Date(datetime);
  }

  console.log({ datetimeObject });

  if (isNaN(datetimeObject.getTime())) {
    throw new Error("Invalid datetime input, is the notation correct?");
  }
  const result = strftime(strFormat, locale, datetimeObject, timeZoneOffset, useUtc);

  console.log({ result });
  return { result };
};

export default dateStrftime;
