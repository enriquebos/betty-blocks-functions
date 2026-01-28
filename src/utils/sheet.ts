import { read, utils } from "xlsx/xlsx.mjs";
import type { WorkBook } from "xlsx";

type Cell = string | number;
type SheetData = Cell[][];

const flipSheetAndClean = (workbook: WorkBook, sheetIndex: number): SheetData => {
  const sheet = workbook.Sheets[workbook.SheetNames[sheetIndex]];
  const aoa = utils.sheet_to_json(sheet, { header: 1 }) as Cell[][];
  const columns = aoa[0].map((_, colIndex: number) => aoa.map((row: Cell[]) => row[colIndex]));

  return columns.map((col: Cell[]) => col.filter((v: Cell) => v != null));
};

export const getSheetData = async (fileUrl: string): Promise<SheetData[]> => {
  const { buffer } = (await (await fetch(fileUrl)).blob()) as unknown as Blob;
  const workbook = read(buffer, { raw: true, dense: true, cellDates: true });

  return workbook.SheetNames.map((_, index) => flipSheetAndClean(workbook, index));
};
