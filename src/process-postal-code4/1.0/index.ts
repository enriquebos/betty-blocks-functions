import { queryOne, mutationUpsertMany } from "../../utils/graphql";
import { getSheetData } from "../../utils/sheet";

const importFileFields = {
  id: Number,
  name: String,
  file: {
    name: String,
    url: String,
  },
  createdAt: Date,
  updatedAt: Date,
};

const advMapping = {
  "denhaag@discriminatie.nl": 14,
  "drenthe@discriminatie.nl": 4,
  "flevoland@discriminatie.nl": 13,
  "fryslân@discriminatie.nl": 3,
  "gelderlandno@discriminatie.nl": 17,
  "vizier@discriminatie.nl": 16,
  "gooienvechtstreek@discriminatie.nl": 11,
  "groningen@discriminatie.nl": 2,
  "kennemerland@discriminatie.nl": 10,
  "discriminatie@radar.nl": 14,
  "limburg@discriminatie.nl": 5,
  "peelenkempen@discriminatie.nl": 18,
  "nhn@discriminatie.nl": 8,
  "deventer@discriminatie.nl": 15,
  "utrecht@discriminatie.nl": 7,
  "regioamsterdam@discriminatie.nl": 1,
  "waterland@discriminatie.nl": 9,
  "zaanstreek@discriminatie.nl": 9,
  "zeeland@discriminatie.nl": 6,
};

interface PostalCodeRecord extends Record<string, unknown> {
  id: number;
  code: string;
  kind: "Bestaat" | "Wittevlek" | "Bestaat niet";
  region?: number;
}

const formatCode = (code: number) => code.toString().padStart(4, "0");

const toPostalCodeRecord = (
  code: number,
  kind: PostalCodeRecord["kind"],
  region?: number,
): PostalCodeRecord => ({
  id: code - 999,
  code: formatCode(code),
  kind,
  ...(region ? { region } : {}),
});

const importPostcode4 = async ({
  fileName,
  start,
  stop,
}: {
  fileName: string;
  start: number;
  stop: number;
}): Promise<{ as: string }> => {
  const fileRecord = await queryOne<importFile>("ImportFile", {
    fields: importFileFields,
    queryArguments: { where: { name: { eq: fileName } } },
  });

  if (!fileRecord) {
    throw new Error("File not found!");
  }

  const [advSheet, municipalitySheet] = await getSheetData(fileRecord.file.url);
  const wittevlekNumbers = municipalitySheet
    .flat()
    .filter((v): v is number => typeof v === "number")
    .map((n) => Number(n));

  const reformattedAdvSheet = Object.fromEntries(
    advSheet.map((row) => [row[3], row.slice(4).filter((n) => typeof n === "number")]),
  );

  const advData: PostalCodeRecord[] = Object.entries(reformattedAdvSheet).flatMap(
    ([email, codes]) => {
      const region = advMapping[email as keyof typeof advMapping];
      if (!region || !Array.isArray(codes)) return [];

      return codes.map((code) => toPostalCodeRecord(Number(code), "Bestaat", region));
    },
  );

  const regionAnchors = advData
    .filter((entry): entry is PostalCodeRecord & { region: number } => entry.region != null)
    .map((entry) => ({ code: Number(entry.code), region: entry.region as number }))
    .sort((a, b) => a.code - b.code);

  if (regionAnchors.length === 0) {
    throw new Error("No regions available to assign to postal codes.");
  }

  const postalCodeMap = new Map<string, PostalCodeRecord>();

  const resolveRegion = (code: number): number => {
    if (code <= regionAnchors[0].code) return regionAnchors[0].region;
    if (code >= regionAnchors[regionAnchors.length - 1].code) {
      return regionAnchors[regionAnchors.length - 1].region;
    }

    let afterIndex = regionAnchors.findIndex((anchor) => anchor.code > code);
    if (afterIndex === -1) afterIndex = regionAnchors.length - 1;
    const after = regionAnchors[afterIndex];
    const before = regionAnchors[afterIndex - 1];

    const gap = after.code - before.code - 1;
    const offset = code - before.code;
    if (gap <= 0) return before.region;

    const midpoint = Math.floor(gap / 2);
    return offset <= midpoint ? before.region : after.region;
  };

  const wittevlekData: PostalCodeRecord[] = wittevlekNumbers.map((n) =>
    toPostalCodeRecord(n, "Wittevlek", resolveRegion(n)),
  );

  advData.forEach((entry) => postalCodeMap.set(entry.code, entry));
  wittevlekData.forEach((entry) => {
    if (!postalCodeMap.has(entry.code)) {
      postalCodeMap.set(entry.code, entry);
    }
  });

  for (let code = 1000; code <= 9999; code += 1) {
    const codeStr = formatCode(code);
    if (!postalCodeMap.has(codeStr)) {
      postalCodeMap.set(codeStr, toPostalCodeRecord(code, "Bestaat niet", resolveRegion(code)));
    }
  }

  let postalCodes = Array.from(postalCodeMap.values()).sort(
    (a, b) => Number(a.code) - Number(b.code),
  );

  postalCodes = postalCodes.slice(Number(start), Number(stop));

  const groupedByRegion = new Map<string, PostalCodeRecord[]>();
  postalCodes.forEach((entry) => {
    const key = entry.region != null ? `region-${entry.region}` : "no-region";
    const list = groupedByRegion.get(key) || [];
    const cleaned = { ...entry };
    if (cleaned.region == null) {
      delete (cleaned as { region?: number }).region;
    }
    list.push(cleaned);
    groupedByRegion.set(key, list);
  });

  const chunkSize = 500;
  for (const group of groupedByRegion.values()) {
    for (let i = 0; i < group.length; i += chunkSize) {
      const chunk = group.slice(i, i + chunkSize);
      await mutationUpsertMany("PostalCode4", chunk);
    }
  }

  return {
    as: fileName,
  };
};

export default importPostcode4;
