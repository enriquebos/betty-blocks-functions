## Summary
Verify an OTP (TOTP) code with a Base32 secret using HMAC-SHA1.

## Inputs
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `secret` | Text | ✔︎ | Shared secret in Base32 format. |
| `otp` | Text | ✔︎ | OTP code to verify. |
| `digits` | Number |  | Number of digits in the OTP (default `6`). |
| `period` | Number |  | TOTP period in seconds (default `30`). |
| `window` | Number |  | Allowed time-step drift backward/forward (default `1`). |
| `timestamp` | Number |  | Optional Unix timestamp in seconds (defaults to current time). |

## Outputs
| Name | Type | Description |
|------|------|-------------|
| `isValid` | Boolean | `true` when the OTP matches within the configured time window. |
