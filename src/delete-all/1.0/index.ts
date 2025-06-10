import type { DeleteAllParams } from "../../types/functions";
import { replaceTemplateVariables } from "../../utils/templating";
import { whereToObject } from "../../utils/graphql/utils";
import { mutationDeleteMany, queryAll } from "../../utils/graphql";

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
  const batchCount = Math.ceil(amountToDelete / batchSize) + 1;
  const combinedIds = [];
  const maxTake = 5000;

  for (let i = 0; i < batchCount; i++) {
    const skip = i * batchSize;
    const take = Math.max(0, Math.min(maxTake, amountToDelete - skip));
    const { data } = await queryAll(modelName, {
      queryArguments: {
        skip,
        take,
        where,
      },
    });

    const ids = data.map((item) => item.id);
    combinedIds.push(...ids);

    if (data.length !== batchSize) {
      break;
    }
  }

  await mutationDeleteMany(modelName, combinedIds);

  return {
    result: `${combinedIds.length} records from ${modelName} have been deleted`,
  };
};

export default deleteAll;
