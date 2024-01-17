import puppeteer from "puppeteer";
import { writeToFile, readInput } from "./utils";

require("dotenv").config();

let logincred: string | undefined = process.env.LOGINCRED;
let password: string | undefined = process.env.PSWORD;
const domainURL = process.env.DOMAINURL;

export default async function () {
  if (!logincred) {
    process.stdout.write('What is your your "Username":\n');
    logincred = await readInput();
  }
  if (!password) {
    process.stdout.write('What is your your "Password":\n');
    password = await readInput();
  }
  const browser = await puppeteer.launch({ headless: false });
  process.stdout.write("Starting Puppeteer\n");
  const pages = await browser.pages();
  const page = pages[0];
  await page.goto(`${domainURL}/web3/login`);

  process.stdout.write("Loading Page\n");
  await page.waitForSelector(".c-mw-home-login-form", { visible: true });
  // await page.type("#email-or-phone", logincred);
  // await page.type("#password", password);

  process.stdout.write("Waiting to log in\n");
  // await page.waitForSelector("button[type=submit]");
  // process.stdout.write("Waiting for cookies. This can take some time...\n");
  let currentURL = page.mainFrame().url();

  while (currentURL !== `${domainURL}/myworld`) {
    // await page.$eval("button[type=submit]", (elem) => elem.click());
    currentURL = page.mainFrame().url();
  }
  currentURL = page.mainFrame().url();
  process.stdout.write(`Logged into ${currentURL}\n`);
  try {
    await page.waitForNavigation();

    const cookies = await page.cookies();
    await writeToFile(cookies, "cookies");
    browser.close();
    return null;
  } catch (error) {
    process.stdout.write("Timed Out...cookies may be invalid.\n");
    const cookies = await page.cookies();
    await writeToFile(cookies, "cookies");
    browser.close();
    return null;
  }
}
