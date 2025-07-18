import { strftime } from "../../utils";

interface DateStrftimeParams {
  datetime: Date | string | number;
  offsetType: string;
  offset: number;
  useUtc: boolean;
  locale: string;
  strftimeDefault: string;
  strftimeStr?: string;
}

const dateStrftime = async ({
  datetime,
  offsetType,
  offset,
  useUtc,
  locale,
  strftimeDefault,
  strftimeStr,
}: DateStrftimeParams): Promise<{ as: string }> => {
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
      datetimeObject = new Date(
        typeof datetime === "number" ? datetime : parseInt(datetime) * 1000,
      );
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

  if (offset && offsetType) {
    switch (offsetType) {
      case "ss":
        offset = offset / 60;
        break;
      case "mm":
        offset = offset;
        break;
      case "hh":
        offset = offset * 60;
        break;
      case "DD":
        offset = offset * 3600;
        break;
      case "WW":
        offset = offset * 21600;
        break;
      case "MM":
        offset = offset * 12_960_000;
        break;
      case "YYYY":
        offset = offset * 777_600_000;
        break;
    }
  }

  return { as: strftime(strFormat, locale, datetimeObject, offset, useUtc) };
};

export default dateStrftime;
