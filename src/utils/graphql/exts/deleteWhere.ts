import { queryAll, mutationDeleteMany } from "../";

interface DeleteWhereOptions {
  amountToDelete: number;
  batchSize: number;
  where?: object;
  maxTake?: number;
  _log_request?: boolean;
}

export default async function deleteWhere(
  modelName: string,
  { amountToDelete, batchSize, where, maxTake = 5000, _log_request }: DeleteWhereOptions,
): Promise<number[]> {
  const deletedIds: number[] = [];

  if (amountToDelete <= 0 || batchSize <= 0) {
    return deletedIds;
  }

  const batchCount = Math.ceil(amountToDelete / batchSize) + 1;

  for (let i = 0; i < batchCount; i++) {
    const skip = i * batchSize;
    const remaining = amountToDelete - skip;
    if (remaining <= 0) {
      break;
    }

    const take = Math.min(maxTake, remaining);
    if (take <= 0) {
      break;
    }

    const { data } = await queryAll<{ id: number }>(modelName, {
      queryArguments: {
        skip,
        take,
        where,
      },
      _log_request,
    });

    if (data.length === 0) {
      break;
    }

    const ids = data.map((item) => item.id);
    deletedIds.push(...ids);

    if (ids.length !== batchSize) {
      break;
    }
  }

  if (deletedIds.length > 0) {
    await mutationDeleteMany(modelName, deletedIds);
  }

  return deletedIds;
}
