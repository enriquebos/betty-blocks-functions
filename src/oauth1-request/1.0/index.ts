import CryptoJS from "../../utils/crypto/hmac-sha1.min.js";
import "../../utils/crypto/enc-base64.min.js";
import type { Oath1RequestOptions } from "../../types/functions.js";

type StringRecord = Record<string, string>;

const percentEncode = (value: string): string =>
  encodeURIComponent(value).replace(
    /[!'()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );

const safeDecode = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch (_error) {
    return value;
  }
};

const parseQuery = (url: string): { baseUrl: string; query: StringRecord } => {
  const withoutHash = url.split("#")[0];
  const [baseUrl, queryString] = withoutHash.split("?");

  if (!queryString) return { baseUrl, query: {} };

  const query = queryString.split("&").reduce((acc, pair) => {
    if (!pair) return acc;

    const [rawKey, ...rawValueParts] = pair.split("=");
    if (!rawKey) return acc;

    const key = safeDecode(rawKey);
    const value = safeDecode(rawValueParts.join("="));

    acc[key] = value;
    return acc;
  }, {} as StringRecord);

  return { baseUrl, query };
};

const toRecord = (entries?: { key: string; value: unknown }[]): StringRecord =>
  entries?.reduce((acc, { key, value }) => {
    if (!key || value === undefined) return acc;

    acc[key] = typeof value === "string" ? value : String(value);
    return acc;
  }, {} as StringRecord) ?? {};

const normalizeParams = (params: StringRecord): string =>
  Object.keys(params)
    .sort()
    .map((key) => `${percentEncode(key)}=${percentEncode(params[key])}`)
    .join("&");

const toQueryString = (params: StringRecord): string =>
  Object.keys(params)
    .map((key) => `${percentEncode(key)}=${percentEncode(params[key])}`)
    .join("&");

const generateNonce = (): string => {
  if (typeof CryptoJS !== "undefined" && CryptoJS.lib?.WordArray?.random) {
    const wordArray = CryptoJS.lib.WordArray.random(16);
    if (wordArray && typeof wordArray === "object" && "toString" in wordArray) {
      return (wordArray as { toString: () => string }).toString();
    }
  }

  return Math.random().toString(36).slice(2);
};

const methodAllowsBody = (method: string): boolean =>
  ["POST", "PUT", "PATCH"].includes(method.toUpperCase());

const oath1Request = async ({
  url,
  method = "GET",
  consumerKey,
  consumerSecret,
  token,
  tokenSecret,
  queryParams,
  bodyParams,
  rawBody,
  sendAsForm = false,
  headers,
}: Oath1RequestOptions): Promise<{
  response: unknown;
  status: number;
  headersOut: StringRecord;
}> => {
  const normalizedMethod = method.toUpperCase();
  const { baseUrl, query: existingQuery } = parseQuery(url);

  const userQuery = toRecord(queryParams);
  const bodyParamsRecord = toRecord(bodyParams);
  const headerRecord = toRecord(headers);

  const oauthParams: StringRecord = {
    oauth_consumer_key: consumerKey,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: generateNonce(),
    oauth_version: "1.0",
  };

  if (token) {
    oauthParams.oauth_token = token;
  }

  const signatureParams: StringRecord = {
    ...existingQuery,
    ...userQuery,
    ...(sendAsForm && methodAllowsBody(normalizedMethod) ? bodyParamsRecord : {}),
    ...oauthParams,
  };

  const signatureBaseString = [
    normalizedMethod,
    percentEncode(baseUrl),
    percentEncode(normalizeParams(signatureParams)),
  ].join("&");

  const signingKey = `${percentEncode(consumerSecret)}&${tokenSecret ? percentEncode(tokenSecret) : ""}`;
  const signature = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA1(signatureBaseString, signingKey),
  );

  const requestQuery: StringRecord = {
    ...existingQuery,
    ...userQuery,
    ...oauthParams,
    oauth_signature: signature,
  };

  const requestUrl = Object.keys(requestQuery).length
    ? `${baseUrl}?${toQueryString(requestQuery)}`
    : baseUrl;

  const finalHeaders: StringRecord = { ...headerRecord };
  const includeBody = methodAllowsBody(normalizedMethod);
  let body: string | undefined;

  if (includeBody) {
    if (rawBody) {
      body = rawBody;
      if (!finalHeaders["Content-Type"]) {
        finalHeaders["Content-Type"] = "application/json";
      }
    } else if (Object.keys(bodyParamsRecord).length > 0) {
      if (sendAsForm) {
        finalHeaders["Content-Type"] = "application/x-www-form-urlencoded";
        body = toQueryString(bodyParamsRecord);
      } else {
        finalHeaders["Content-Type"] = "application/json";
        body = JSON.stringify(bodyParamsRecord);
      }
    }
  }

  const response = await fetch(requestUrl, {
    method: normalizedMethod,
    headers: finalHeaders,
    body: includeBody ? body : undefined,
  });

  const text = await response.text();
  const responseHeaders =
    typeof (response.headers as unknown as { entries?: () => Iterable<[string, string]> })
      ?.entries === "function"
      ? Object.fromEntries(
          (response.headers as unknown as { entries: () => Iterable<[string, string]> }).entries(),
        )
      : ((response.headers as unknown as StringRecord) ?? {});

  let parsedBody: unknown = text;

  try {
    parsedBody = text ? JSON.parse(text) : null;
  } catch (_error) {
    // Fallback to raw text when JSON parsing fails
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}): ${text || response.statusText}`);
  }

  return { response: parsedBody, status: response.status, headersOut: responseHeaders };
};

export default oath1Request;
