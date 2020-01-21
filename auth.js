const { writeToFile } = require('./utils.js')
require('dotenv').config();

const puppeteer = require("puppeteer");
const username = process.env.USRNAME;
const password = process.env.PSWORD;
const loginURL = process.env.LOGINURL;

module.exports = async function() {
  const browser = await puppeteer.launch({ headless: false});
  console.log("Starting Puppeteer")
  const pages = await browser.pages()
  const page = pages[0];
  await page.goto(loginURL, { waitUntil: 'domcontentloaded' });
  
  console.log("Loading Page");
  await page.waitFor('input[name=username]');
  await page.click('#login-fake-btn');
  await page.type('#email', username);
  await page.type('#password', password);
  
  console.log("Waiting to log in")
  await page.waitFor(3000);
  await page.click('button.btn-login');
  await page.waitForNavigation();
  
  cookies = await page.cookies();
  await writeToFile(cookies, 'cookies');
  return null;
}


