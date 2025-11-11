# Render Batched Collection

## Summary
Utility prefab that resolves a lazy/iterator-based collection into an eager array so it can be used by components that expect a plain list (e.g. renderers, validations or exports).

## Input
| Name | Type | Description |
|------|------|-------------|
| `collection.data` | `Iterable<object>` | Any iterable source such as a Lazy Collection, Generator or Set. |

## Output
```
{ resolved: object[] }
```
The `resolved` array contains every item produced by the incoming iterator in the order it was yielded.

## Example
```ts
const result = await resolveLazyCollection({
  collection: { data: new Set([{ id: 1 }, { id: 2 }]) },
});

// result => { resolved: [{ id: 1 }, { id: 2 }] }
```

Use this prefab when a downstream step cannot handle iterables, or when you want to batch work in memory before applying further logic.
