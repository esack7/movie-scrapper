import {
  fileExists,
  readCookiesJSONFile,
  deleteCookies,
  readInput,
  writeToFile,
} from "./utils";
import scrapeData from "./scrapeData";
import auth from "./auth";
import processFeed from "./processFeed";

async function main() {
  const cookiesPath = "./cookies.json";
  const cookieExist = await fileExists(cookiesPath);
  const firstTry = true;

  if (!cookieExist && firstTry) {
    await auth(firstTry);
    main();
  } else if (firstTry) {
    try {
      const cookies = await readCookiesJSONFile(cookiesPath);
      let input = "";

      while (input.toLowerCase() !== "q") {
        process.stdout.write(
          "\nWhat do you want to do?:\n(s - search, r - scrape data, l - log out, q - quit)\n"
        );
        try {
          input = await readInput();
          if (input === "s") {
            process.stdout.write("What do you want to search for?\n");
            const searchTerm = await readInput();
            await processFeed(searchTerm);
          }
          if (input === "r") {
            await scrapeData(cookies);
            await writeToFile(Array.from(cookies.values()), "cookies");
          }
          if (input === "l") {
            await deleteCookies(cookiesPath, "cookies.json");
          }
        } catch (error) {
          console.log("There is an error: ", error);
        }
      }
      process.exit();
    } catch (error) {
      console.error("Error in Index:\n", error);
    }
  } else {
    process.stdout.write("Error parsing cookie string\n");
  }
}

main();
