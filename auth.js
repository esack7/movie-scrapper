// const { format } = require('date-fns');
const fs = require('fs');
const puppeteer = require("puppeteer");
require("dotenv").config();

const username = process.env.USRNAME;
const password = process.env.PSWORD;
const loginURL = process.env.LOGINURL;
const cookiesPath = "./cookies.json";
// const current = Date.now();
// let reauthorize = false;

function cookiesExist(path) {
    return new Promise((resolve, reject) => {
        fs.access(path,fs.constants.F_OK, (err) => {
            if(err) {
                return reject(err);
            }
            console.log('It exists in promise')
            resolve(true);
        })
    })
}

function writeToFile (data, fileName) {
    const stringifiedData = JSON.stringify(data);
    fs.writeFile(`${fileName}.json`, stringifiedData, 'utf8', function (err) {
        if (err) {
            console.log(`An error occured while writing ${fileName} JSON file.`);
            return console.log(err);
        }

        console.log(`${fileName} JSON file has been saved.`);
    });
}

(async () => {
  let existCookies = false;
  try {
      existCookies = await cookiesExist(cookiesPath);
  } catch (error) {
      existCookies = false;
  }
  console.log(existCookies);
  if (existCookies) {
    return true;
  } else {
    const browser = await puppeteer.launch({ headless: false});
    const pages = await browser.pages();
    const page = pages[0];

    await page.goto(loginURL, { waitUntil: "domcontentloaded" });
    await page.waitFor("input[name=username]");
    await page.click("#login-fake-btn");
    await page.type("#email", username);
    await page.type("#password", password);
    await page.waitFor(3000);
    await page.click("button.btn-login");
    await page.waitForNavigation();

    cookies = await page.cookies();
    writeToFile(cookies, "cookies");
    // return false;
  }
})();
// cookies.map(cookie => {
//     if(cookie.expires === -1) {
//         console.log(`\n***\n${cookie.name}\nNo expiration\n***\n`)
//     } else {
//         console.log(cookie.name);
//         console.log("Expires:\n", format(cookie.expires * 1000, 'MMM yyyy d H:mm:ss'));
//         ((cookie.expires * 1000) <= current) ? console.log('Expired\n') : console.log('Current\n')
//     }
// })
