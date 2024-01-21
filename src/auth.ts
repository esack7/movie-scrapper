import { writeToFile } from "./utils";

require("dotenv").config();

export default async function (firstTry: boolean) {
  const cookiesStringified = process.env.COOKIES_STRINGIFIED;
  const cookieString = process.env.COOKIE_STRING;
  try {
    if (cookiesStringified == null || cookieString == null) {
      throw new Error(
        "COOKIES_STRINGIFIED or COOKIE_STRING env variable is not set"
      );
    }
    const cookies: CookieInterface[] = JSON.parse(cookiesStringified);
    const combinedCookies = splitCookieString(cookieString);
    combinedCookies.forEach((cookie) => {
      if (!cookies.some((ele) => ele.name === cookie.name)) {
        cookies.push(cookie);
      }
    });
    await writeToFile(cookies, "cookies");
  } catch (error) {
    firstTry = false;
    process.stdout.write("Error parsing cookie string\n");
  }
}

function splitCookieString(cookieString: string): CookieInterface[] {
  return cookieString.split("; ").map((cookie) => {
    const [name, value] = cookie.split("=");
    return { name, value };
  });
}
