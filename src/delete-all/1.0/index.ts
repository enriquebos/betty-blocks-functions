import type { DeleteAllParams } from "../../types/functions";
import { replaceTemplateVariables } from "../../utils/templating";
import { whereToObject } from "../../utils/graphql/utils";
import { deleteWhere } from "../../utils/graphql/exts";

const deleteAll = async ({
  model: { name: modelName },
  amountToDelete,
  batchSize,
  filter,
  filterVars,
}: DeleteAllParams) => {
  if (amountToDelete <= 0 && amountToDelete != null) {
    throw new Error("Delete amount cannot be lower than or equal to 0");
  } else if (batchSize <= 0) {
    throw new Error("Batch size cannot be lower than or equal to 0");
  }

  const where = whereToObject(replaceTemplateVariables(filter, filterVars));
  const deletedIds = await deleteWhere(modelName, {
    amountToDelete,
    batchSize,
    where,
  });

  return {
    as: `${deletedIds.length} records from ${modelName} have been deleted`,
  };
};

export default deleteAll;
