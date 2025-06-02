// @ts-nocheck
import { renderLiquidTemplate } from "../../utils";
import { variableMap } from "../../utils";

interface CustomHttpOptions {
  url: string;
  method: string;
  bodyType: string;
  body: string;
  headers: Array<{ key: string; value: string }>;
  protocol: string;
  queryParameters: Array<{ key: string; value: string }>;
  bodyParameters: Array<{ key: string; value: string }>;
  urlParameters: Array<{ key: string; value: string }>;
}

const parseQueryParameters = (queryParameters) =>
  queryParameters
    .map(({ key, value }, index) => {
      const paramKey = index === 0 ? `?${key}` : key;
      return `${paramKey}=${encodeURIComponent(value)}`;
    })
    .join("&");

const generateUrl = (url, protocol, queryParameters) => {
  let trimmedUrl = url;
  if (trimmedUrl.startsWith("http://")) {
    [, trimmedUrl] = trimmedUrl.split("http://");
  }
  if (trimmedUrl.startsWith("https://")) {
    [, trimmedUrl] = trimmedUrl.split("https://");
  }

  return `${protocol}://${trimmedUrl}${parseQueryParameters(queryParameters)}`;
};

function toFormUrlEncoded(data) {
  return Object.entries(data)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
}

const optionallyParseJson = (data) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
};

const http = async ({
  url,
  method,
  bodyType,
  body,
  headers = [],
  protocol,
  queryParameters = [],
  bodyParameters = [],
  urlParameters = [],
}: CustomHttpOptions) => {
  let parsedBody: string;
  const parsedUrl = await renderLiquidTemplate(url, urlParameters);

  switch (bodyType) {
    case "raw":
      parsedBody = await renderLiquidTemplate(body, bodyParameters);
      break;
    case "url_encoded":
      const contentTypeHeader = headers.find((header) => header.key === "Content-Type");
      if (!contentTypeHeader) {
        headers.push({
          key: "Content-Type",
          value: "application/x-www-form-urlencoded",
        });
      }
      parsedBody = toFormUrlEncoded(variableMap(bodyParameters));
      break;
  }

  const fetchUrl = generateUrl(parsedUrl, protocol, queryParameters);
  const options = {
    method,
    headers: variableMap(headers),
    ...(method !== "get" && { body: parsedBody }),
  };

  const response = await fetch(fetchUrl, options);
  console.log(JSON.stringify(response));
  const responseCode = response.status;
  const data = response.text();

  throw new Error(data);
  return { as: optionallyParseJson(data), responseCode };
};

export default http;
