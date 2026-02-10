import otpVerify from "../src/otp-verify/1.0";
import CryptoJS from "../src/utils/crypto/hmac-sha1.min.js";

describe("otpVerify", () => {
  // RFC 6238 shared secret for SHA1 in Base32.
  const secret = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";

  it("validates a known RFC 6238 vector", async () => {
    const result = await otpVerify({
      secret,
      otp: "94287082",
      digits: 8,
      period: 30,
      window: 0,
      timestamp: 59,
    });

    expect(result).toEqual({ isValid: true });
  });

  it("rejects an invalid OTP", async () => {
    const result = await otpVerify({
      secret,
      otp: "00000000",
      digits: 8,
      period: 30,
      window: 0,
      timestamp: 59,
    });

    expect(result).toEqual({ isValid: false });
  });

  it("accepts neighbor time steps when window allows it", async () => {
    const result = await otpVerify({
      secret,
      otp: "94287082",
      digits: 8,
      period: 30,
      window: 1,
      timestamp: 89,
    });

    expect(result).toEqual({ isValid: true });
  });

  it("throws for invalid Base32 secret", async () => {
    await expect(
      otpVerify({
        secret: "INVALID*SECRET",
        otp: "123456",
      }),
    ).rejects.toThrow("Invalid Base32 secret character: *");
  });

  it("throws for invalid digits option", async () => {
    await expect(
      otpVerify({
        secret,
        otp: "123456",
        digits: 3,
      }),
    ).rejects.toThrow("Digits must be an integer between 4 and 10");
  });

  it("throws for invalid period option", async () => {
    await expect(
      otpVerify({
        secret,
        otp: "123456",
        period: 0,
      }),
    ).rejects.toThrow("Period must be a positive integer");
  });

  it("throws for invalid window option", async () => {
    await expect(
      otpVerify({
        secret,
        otp: "123456",
        window: -1,
      }),
    ).rejects.toThrow("Window must be a non-negative integer");
  });

  it("returns false when otp has non-digit characters", async () => {
    const result = await otpVerify({
      secret,
      otp: "12a456",
    });

    expect(result).toEqual({ isValid: false });
  });

  it("uses current time when timestamp is not provided", async () => {
    jest.spyOn(Date, "now").mockReturnValue(59_000);

    const result = await otpVerify({
      secret,
      otp: "94287082",
      digits: 8,
      period: 30,
      window: 0,
    });

    expect(result).toEqual({ isValid: true });
  });

  it("handles unexpected empty hmac hex output path", async () => {
    const hmacSpy = jest
      .spyOn(CryptoJS, "HmacSHA1")
      .mockReturnValue({ toString: () => "" } as unknown as ReturnType<typeof CryptoJS.HmacSHA1>);

    await expect(
      otpVerify({
        secret,
        otp: "94287082",
        digits: 8,
        period: 30,
        window: 0,
        timestamp: 59,
      }),
    ).resolves.toEqual({ isValid: false });

    hmacSpy.mockRestore();
  });
});
