import { jwtDecode } from "../../utils";

interface TokenParams {
  tokenEndpoint: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  grantType: string | "authorization_code" | "refresh_token";
  code: string;
}

interface AccessTokenResponse {
  access_token: string;
  refresh_token: string;
  id_token: string;
}

interface DecodedToken {
  [key: string]: any;
}

interface TokenResult {
  accessToken: string;
  refreshToken: string;
  as: DecodedToken;
}

const getAccessAndIdToken = async ({
  tokenEndpoint,
  clientId,
  clientSecret,
  redirectUri,
  grantType,
  code,
}: TokenParams): Promise<TokenResult> => {
  const formBody = Object.entries({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: grantType,
    code: code,
  }).map(([property, value]) => encodeURIComponent(property) + "=" + encodeURIComponent(value));

  const accessTokenResponse = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formBody.join("&"),
  });

  if (!accessTokenResponse.ok) {
    throw new Error(await accessTokenResponse.text());
  }

  const accessToken: AccessTokenResponse = await accessTokenResponse.json();

  return {
    accessToken: accessToken.access_token,
    refreshToken: accessToken.refresh_token,
    as: jwtDecode(accessToken.id_token),
  };
};

export default getAccessAndIdToken;
