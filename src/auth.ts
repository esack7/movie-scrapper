import { writeToFile, combineCookies } from "./utils";

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
    combineCookies(cookies, cookieString);
    await writeToFile(cookies, "cookies");
  } catch (error) {
    firstTry = false;
    process.stdout.write("Error parsing cookie string\n");
  }
}
