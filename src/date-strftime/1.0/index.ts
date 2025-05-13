import { strftime } from "../../utils/utilityFuncs";

interface DateStrftimeParams {
  datetime: Date | string | Number;
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
}: DateStrftimeParams): Promise<{ result: string }> => {
  const strFormat = strftimeDefault !== "custom" ? strftimeDefault : strftimeStr;
  let datetimeObject: Date;

  if (!strFormat) {
    throw new Error("Custom strtime is not defined");
  }

  switch (true) {
    case datetime instanceof Date:
      datetimeObject = datetime;
      break;

    case datetime === "now":
    case datetime === "today":
    case datetime === "":
      datetimeObject = new Date();
      break;

    case (typeof datetime === "string" && /^\d+$/.test(datetime)) || typeof datetime === "number":
      datetimeObject = new Date(typeof datetime === "number" ? datetime : parseInt(datetime) * 1000);
      break;

    case typeof datetime === "string":
      datetimeObject = new Date(datetime);
      break;

    default:
      throw new Error(`Invalid date object type (${typeof datetime}) for: ${datetime}`);
  }

  if (isNaN(datetimeObject.getTime())) {
    throw new Error("Invalid datetime input, is the notation correct?");
  }

  return { result: strftime(strFormat, locale, datetimeObject, timeZoneOffset, useUtc) };
};

export default dateStrftime;
