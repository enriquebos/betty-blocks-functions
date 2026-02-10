## Summary
Verify an OTP (TOTP) code with a Base32 secret using HMAC-SHA1.

## Inputs
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `secret` | Text | ✔︎ | Shared secret in Base32 format. |
| `otp` | Text | ✔︎ | OTP code to verify. |
| `digits` | Number |  | Number of digits in the OTP (default `6`). |
| `period` | Number |  | TOTP period in seconds (default `30`). |

## Outputs
| Name | Type | Description |
|------|------|-------------|
| `isValid` | Boolean | `true` when the OTP matches in the current or adjacent time step. |
