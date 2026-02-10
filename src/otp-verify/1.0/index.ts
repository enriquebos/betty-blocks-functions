import CryptoJS from "../../utils/crypto/hmac-sha1.min.js";
import type { OtpVerifyOptions } from "../../types/functions";
import { decodeBase32, toHex, counterToHex } from "../../utils";

const DEFAULT_TIME_WINDOW = 1;

const generateTotp = (secret: Uint8Array, counter: number, digits: number): string => {
  const key = CryptoJS.enc.Hex.parse(toHex(secret));
  const message = CryptoJS.enc.Hex.parse(counterToHex(counter));
  const hash = CryptoJS.HmacSHA1(message, key);
  const hashHex = hash.toString(CryptoJS.enc.Hex);
  const hashBytes = Uint8Array.from(
    hashHex.match(/.{1,2}/g)?.map((hex: string) => parseInt(hex, 16)) ?? [],
  );

  const offset = hashBytes[hashBytes.length - 1] & 0x0f;
  const binary =
    ((hashBytes[offset] & 0x7f) << 24) |
    ((hashBytes[offset + 1] & 0xff) << 16) |
    ((hashBytes[offset + 2] & 0xff) << 8) |
    (hashBytes[offset + 3] & 0xff);

  const otp = binary % 10 ** digits;
  return otp.toString().padStart(digits, "0");
};

const otpVerify = async ({
  secret,
  otp,
  digits = 6,
  period = 30,
}: OtpVerifyOptions): Promise<{ isValid: boolean }> => {
  if (!Number.isInteger(digits) || digits < 4 || digits > 10) {
    throw new Error("Digits must be an integer between 4 and 10");
  }

  if (!Number.isInteger(period) || period <= 0) {
    throw new Error("Period must be a positive integer");
  }

  const normalizedOtp = otp.replace(/\s/g, "");

  if (!new RegExp(`^\\d{${digits}}$`).test(normalizedOtp)) {
    return { isValid: false };
  }

  const secretBytes = decodeBase32(secret);
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const baseCounter = Math.floor(currentTimestamp / period);

  for (let offset = -DEFAULT_TIME_WINDOW; offset <= DEFAULT_TIME_WINDOW; offset += 1) {
    const expectedOtp = generateTotp(secretBytes, baseCounter + offset, digits);
    if (expectedOtp === normalizedOtp) {
      return { isValid: true };
    }
  }

  return { isValid: false };
};

export default otpVerify;
