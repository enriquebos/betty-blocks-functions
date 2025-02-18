import { strftime } from "../../utils/utilityFuncs";

interface DateStrftimeParams {
  datetime: Date | string;
  strftimeDefault: string;
  strftimeStr: string;
  timeZoneOffset: string;
}

const dateStrftime = async ({
  datetime,
  strftimeDefault,
  strftimeStr,
  timeZoneOffset,
}: DateStrftimeParams): Promise<{ result: string | number | object }> => {
  const strFormat = strftimeDefault !== "custom" ? strftimeDefault : strftimeStr;
  let datetimeObject: Date;

  if (!strFormat) {
    throw new Error("Custom strtime is not defined");
  }

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

  if (isNaN(datetimeObject.getTime())) {
    throw new Error("Invalid datetime input, is the notation correct?");
  }

  datetimeObject.setTime(datetimeObject.getTime() + parseInt(timeZoneOffset.toString()) * 60 * 1000);
  return { result: strftime(strFormat, datetimeObject) };
};

export default dateStrftime;
