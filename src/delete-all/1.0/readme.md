# Delete All Records

## Summary
Deletes a configurable amount of records from a model in batches. Filters are templated with `replaceTemplateVariables`, translated to a GraphQL `where` object and then processed via the shared `deleteWhere` extension so the logic can be re-used elsewhere in your app.

## Inputs
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `model.name` | string | ✔︎ | Name of the model to delete records from. |
| `amountToDelete` | number | ✔︎ | Total amount of records you want to remove. Must be `> 0`. |
| `batchSize` | number | ✔︎ | Amount of records requested per batch. Must be `> 0`. |
| `filter` | string | ✔︎ | Where-clause template (Liquid) used to target rows. |
| `filterVars` | `MappingItem[]` | ✖︎ | Variables passed to the template. |

## Behaviour
1. Validates `amountToDelete` and `batchSize`, throwing early when either value is invalid.
2. Applies `replaceTemplateVariables` and `whereToObject` to turn the filter string into a safe GraphQL `where`.
3. Calls the shared `deleteWhere` helper which pages through `queryAll` + `mutationDeleteMany` until the requested amount is deleted or the dataset is exhausted.
4. Returns a readable message that includes the actual amount of deleted records.

## Example
```ts
await deleteAll({
  model: { name: "Order" },
  amountToDelete: 250,
  batchSize: 50,
  filter: '{ status: { eq: "{{ status }}" } }',
  filterVars: [
    { key: [{ kind: "Variable", name: "status" }], value: "CANCELLED" },
  ],
});
// => { as: "240 records from Order have been deleted" }
```

The returned count can differ from `amountToDelete` when fewer records match the filter.

## Notes
- `deleteWhere` caps every `take` at 5000 to stay within platform limits.
- When you need the same deletion strategy elsewhere, import `deleteWhere` from `src/utils/graphql/exts` directly; this prefab is a thin wrapper that handles templating and validation for you.
