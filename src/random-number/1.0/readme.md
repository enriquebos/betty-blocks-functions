## Summary
Generates a random integer within a user-defined range. It is typically used for lightweight simulations (raffles, dice rolls, sampling) during a flow.

## Inputs
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `min` | number | ✔︎ | Lowest allowed value. |
| `max` | number | ✔︎ | Highest allowed value (inclusive). |

If `min` is greater than `max`, the function swaps them automatically.

## Output
```
{ value: number }
```
`value` is an integer between `min` and `max` (inclusive).

## Example
```ts
const { value } = await randomNumber({ min: 10, max: 15 });
// value: {10, 11, 12, 13, 14, 15}
```

## Notes
- The function uses `crypto.getRandomValues` when available, falling back to `Math.random`. This is sufficient for non-cryptographic workloads; do not use it for security decisions.
- Input validation happens at runtime, so prefer guarding your UI inputs as well.

### Prefab (function.json)
![function_prefab](https://github.com/user-attachments/assets/69d4ec8a-3fe6-4000-92bf-4612dbfb11f0)
