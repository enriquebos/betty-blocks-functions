## Summary
Perform an OAuth 1.0 (HMAC-SHA1) signed request without relying on browser APIs such as `URL` or `btoa`. All crypto comes from `src/utils/crypto`.

## Inputs
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `url` | Text | ✔︎ | Full endpoint URL. Existing query params are kept and signed. |
| `method` | Select |  | HTTP method (default `GET`). |
| `consumerKey` | Text | ✔︎ | OAuth consumer key. |
| `consumerSecret` | Text | ✔︎ | OAuth consumer secret. |
| `token` | Text |  | OAuth token (if required by the API). |
| `tokenSecret` | Text |  | OAuth token secret (if required). |
| `queryParams` | Map |  | Extra query parameters to append and sign. |
| `bodyParams` | Map |  | Key/value body parameters that will be included in the signature. |
| `rawBody` | MultilineText |  | Literal body string. When provided, `bodyParams` are ignored. |
| `sendAsForm` | Boolean |  | When true, body params are sent as `application/x-www-form-urlencoded`; otherwise JSON. |
| `headers` | Map |  | Additional request headers. |

## Outputs
| Name | Type | Description |
|------|------|-------------|
| `response` | Object | Parsed JSON when possible, otherwise raw text. |
| `status` | Number | HTTP status code. |
| `headersOut` | Object | Response headers as a key/value object. |

## Example
```ts
const result = await oath1Request({
  url: "https://example.com/wp-json/gf/v2/forms/1/entries",
  method: "GET",
  consumerKey: "ck_abc",
  consumerSecret: "cs_def",
  queryParams: {
    search:
      '{"field_filters":[{"key":"date_created","value":"01/05/2026","operator":"is"}]}',
  },
});

// result: { response, status, headersOut }
```

## Notes
- Nonce is generated with CryptoJS (fallback to `Math.random` when unavailable).
- If JSON parsing fails, the raw text body is returned instead of throwing.
- Signature parameters include URL query, extra query, OAuth params, and (when `sendAsForm` and method supports a body) `bodyParams`.
