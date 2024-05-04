import { writeFile, unlink, access, readFile, constants } from "fs";
import { createInterface, Interface } from "readline";
import client from "superagent";
import { parseJSON } from "date-fns";
require("dotenv").config();

const domainURL = process.env.DOMAINURL;

const lineReader: Interface = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const readInput = () =>
  new Promise<string>((resolve, reject) => {
    try {
      lineReader.on("line", (input: string) => {
        resolve(input);
      });
    } catch (err) {
      reject(err);
    }
  });
const writeToFile = (data: Object, fileName: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const stringifiedData = JSON.stringify(data);
    writeFile(`${fileName}.json`, stringifiedData, "utf8", function (err) {
      if (err) {
        console.log(`An error occured while writing ${fileName} JSON file.`);
        return reject(err);
      }
      console.log(`${fileName} JSON file has been saved.`);
      resolve();
    });
  });

const deleteCookies = (path: string, fileName: string): Promise<void> =>
  new Promise((resolve, reject) => {
    unlink(path, (err) => {
      if (err) {
        console.log(`An error occured while deleting ${fileName} file.`);
        return reject(err);
      }
      console.log(`${fileName} has been deleted.`);
      resolve();
    });
  });

const makeGetRequest = (
  postURL: string,
  cookies: Map<string, CookieInterface>
): Promise<ResponseInterface> =>
  new Promise((resolve, reject) => {
    const { cookieString, csrfToken } = getCookieString(cookies);
    if (!cookieString || !csrfToken) {
      return reject("Error parsing cookie string or csrfToken");
    }
    client
      .get(domainURL + postURL)
      .set("Cookie", cookieString)
      .set("x-csrf-token", `${csrfToken}`)
      .then((res) => {
        const headersMap: Map<string, string | string[] | undefined> = new Map(
          Object.entries(res.headers)
        );
        const headerCookiesValue = headersMap.get("set-cookie");
        if (headerCookiesValue && typeof headerCookiesValue !== "string") {
          headerCookiesValue.forEach((cookie: string) => {
            const parsedCookie = parseCookieString(cookie);
            cookies.set(parsedCookie.name, parsedCookie);
          });
        }
        resolve(res.body);
      })
      .catch((err) => {
        return reject(err);
      });
  });

const fileExists = (path: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    access(path, constants.F_OK, (err) => {
      if (err) {
        return resolve(false);
      }
      resolve(true);
    });
  });

const readCookiesJSONFile = (
  path: string
): Promise<Map<string, CookieInterface>> =>
  new Promise((resolve, reject) => {
    readFile(path, (err, buf) => {
      if (err) {
        console.log(`There was an error reading json at ${path}.`);
        return reject(err);
      }
      // resolve(<Array<CookieInterface>>JSON.parse(buf.toString()));
      const jsonData = <Array<CookieInterface>>JSON.parse(buf.toString());
      const cookiesMap: Map<string, CookieInterface> = jsonData.reduce(
        (map, cookie) => {
          map.set(cookie.name, cookie);
          return map;
        },
        new Map<string, CookieInterface>()
      );
      resolve(cookiesMap);
    });
  });

const getCookieString = (
  cookies: Map<string, CookieInterface>
): CookieStringInterface => {
  let csrfToken = "";
  let cookieString = "";

  cookies.forEach((ele) => {
    if (ele.name === "csrf-token") {
      csrfToken = ele.value;
    }
    cookieString += `${ele.name}=${ele.value};`;
  });
  return { cookieString, csrfToken };
};

const combineCookies = (
  cookies: CookieInterface[],
  cookieString: string
): void => {
  cookieString.split(";").forEach((cookie) => {
    const trimmedCookie = cookie.trim();
    const [name, value] = trimmedCookie.split("=");
    if (!cookies.some((ele) => ele.name === name)) {
      cookies.push({ name, value });
    }
    //TODO: update cookie properties if it already exists
  });
};

const parseCookieString = (cookieString: string): CookieInterface => {
  const cookieParts = cookieString.split("; ");
  const cookieObj: CookieInterface = {
    name: "",
    value: "",
  };

  for (const part of cookieParts) {
    const [key, val] = part.split("=").map((item) => item.trim());
    switch (key.toLowerCase()) {
      case "expires":
        cookieObj.expires = Date.parse(val);
        break;
      case "domain":
        cookieObj.domain = val;
        break;
      case "path":
        cookieObj.path = val;
        break;
      case "secure":
        cookieObj.secure = true;
        break;
      case "httponly":
        cookieObj.httpOnly = true;
        break;
      case "samesite":
        cookieObj.sameSite = val;
        break;
      default:
        cookieObj.name = key;
        cookieObj.value = val;
    }
  }

  // Calculating size based on the length of name and value
  // cookieObj.size = (cookieObj.name.length + cookieObj.value.length) * 2;

  return cookieObj;
};

const readPostFeedDataJSONFile = (
  path: string
): Promise<PostFeedDataInterface> =>
  new Promise((resolve, reject) => {
    readFile(path, (err, buf) => {
      if (err) {
        console.log(`There was an error reading json at ${path}.`);
        return reject(err);
      }
      const jsonData = <PostFeedDataInterface>JSON.parse(
        buf.toString(),
        (key, value) => {
          if (key === "users") {
            const usersMap = new Map<string, UserTrackingInterface>();
            for (const user in value) {
              usersMap.set(user, value[user]);
            }
            return usersMap;
          }
          if (key === "postItems") {
            const postItemsMap = new Map<string, PostItemInterface>();
            for (const postItem in value) {
              postItemsMap.set(postItem, value[postItem]);
            }
            return postItemsMap;
          }
          return value;
        }
      );
      resolve(jsonData);
    });
  });

const formatPost = (post: PostInterface): FormattedPost[] =>
  post.text
    .split("\n")
    .map((ele) => {
      const eleObject = {
        text: ele,
        cost: 0,
        postItemId: post.postItemId,
        userId: post.userId,
        createdAt: parseJSON(post.createdAt * 1000),
        updatedAt: post.updatedAt ? parseJSON(post.updatedAt * 1000) : null,
        editedAt: post.editedAt ? parseJSON(post.editedAt * 1000) : null,
      };
      const splitMoney = ele.split("$");
      if (splitMoney.length > 1) {
        const detectedPrice = parseFloat(splitMoney[1].split(" ")[0]);
        if (detectedPrice) {
          eleObject.cost = detectedPrice;
        }
      }
      eleObject.text = eleObject.text.replace(/[^a-z0-9 ]/gi, "").trim();
      return eleObject;
    })
    .filter((obj) => !!obj.text.trim())
    .filter((obj) => obj.text.indexOf("#") === -1);

const formatFeed = async (feed: ResponseFeedItemInterface[]) => {
  const formattedFeed: FormattedPost[][] = [];

  for (let i = 0; i < feed.length; i++) {
    const formattedPost = await formatPost(feed[i]);
    formattedFeed.push(formattedPost);
  }
  return formattedFeed;
};

export {
  readInput,
  writeToFile,
  deleteCookies,
  makeGetRequest,
  fileExists,
  readCookiesJSONFile,
  getCookieString,
  combineCookies,
  parseCookieString,
  readPostFeedDataJSONFile,
  formatFeed,
  formatPost,
  lineReader,
};
