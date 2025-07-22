interface JwtDecodeOptions {
  header?: boolean;
}

function polyfill(input: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  const str = String(input).replace(/=+$/, "");

  if (str.length % 4 == 1) {
    throw new Error("failed: The string to be decoded is not correctly encoded.");
  }

  let bc = 0;
  let bs = 0;
  let buffer: string;
  let idx = 0;
  let output = "";

  while ((buffer = str.charAt(idx++))) {
    const charIndex = chars.indexOf(buffer);
    if (charIndex !== -1) {
      bs = bc % 4 ? bs * 64 + charIndex : charIndex;
      if (bc++ % 4) {
        output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)));
      }
    }
  }

  return output;
}

function b64DecodeUnicode(str: string): string {
  return decodeURIComponent(
    polyfill(str).replace(/(.)/g, function (_m, p) {
      let code = p.charCodeAt(0).toString(16).toUpperCase();
      if (code.length < 2) {
        code = "0" + code;
      }
      return "%" + code;
    })
  );
}

function base64_url_decode(str: string): string {
  let output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw new Error("Illegal base64url string!");
  }

  try {
    return b64DecodeUnicode(output);
  } catch {
    return polyfill(output);
  }
}

export default function jwtDecode(token: string, options?: JwtDecodeOptions): object | void {
  if (typeof token !== "string") {
    throw new Error("Invalid token specified");
  }

  options = options || {};
  const pos = options.header === true ? 0 : 1;

  try {
    return JSON.parse(base64_url_decode(token.split(".")[pos]));
  } catch (e) {
    throw new Error("Invalid token specified: " + (e as Error).message);
  }
}
