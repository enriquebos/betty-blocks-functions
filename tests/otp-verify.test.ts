import otpVerify from "../src/otp-verify/1.0";

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
});
