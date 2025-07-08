import getAccessAndIdToken from "../src/oauth-login/1.0";
import { jwtDecode } from "../src/utils";

global.fetch = jest.fn();

jest.mock("../src/utils", () => ({
  jwtDecode: jest.fn(),
}));

describe("getAccessAndIdToken", () => {
  const mockTokenResponse = {
    access_token: "mockAccessToken",
    refresh_token: "mockRefreshToken",
    id_token: "mockIdToken",
  };

  const mockDecodedToken = {
    sub: "1234567890",
    name: "John Doe",
    email: "john@example.com",
  };

  const tokenParams = {
    tokenEndpoint: "https://example.com/token",
    clientId: "client123",
    clientSecret: "secret123",
    redirectUri: "https://example.com/callback",
    grantType: "authorization_code",
    code: "authCode123",
  };

  beforeEach(() => {
    // Reset mocks
    (fetch as jest.Mock).mockReset();
    (jwtDecode as jest.Mock).mockReset();
  });

  it("should fetch tokens and decode the id_token", async () => {
    // Mock fetch response
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTokenResponse,
    });

    // Mock jwtDecode response
    (jwtDecode as jest.Mock).mockReturnValue(mockDecodedToken);

    const result = await getAccessAndIdToken(tokenParams);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(jwtDecode).toHaveBeenCalledWith("mockIdToken");

    expect(result).toEqual({
      accessToken: "mockAccessToken",
      refreshToken: "mockRefreshToken",
      as: mockDecodedToken,
    });
  });

  it("should throw an error when fetch fails", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      text: async () => "Unauthorized",
    });

    await expect(getAccessAndIdToken(tokenParams)).rejects.toThrow("Unauthorized");
  });
});
