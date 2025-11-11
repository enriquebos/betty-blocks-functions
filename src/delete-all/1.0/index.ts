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
  const deletedIds = await deleteWhere(modelName, {
    amountToDelete,
    batchSize,
    where: whereToObject(replaceTemplateVariables(filter, filterVars)),
  });

  return {
    as: `${deletedIds.length} records from ${modelName} have been deleted`,
  };
};

export default deleteAll;
