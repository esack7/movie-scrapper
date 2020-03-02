const puppeteer = require('puppeteer');
const { writeToFile, readInput } = require('./utils.js');
require('dotenv').config();

let username = process.env.USRNAME;
let password = process.env.PSWORD;
const domainURL = process.env.DOMAINURL;

module.exports = async function() {
    if (!username) {
        process.stdout.write('What is your your "Username":\n');
        username = await readInput();
    }
    if (!password) {
        process.stdout.write('What is your your "Password":\n');
        password = await readInput();
    }
    const browser = await puppeteer.launch({ headless: true });
    process.stdout.write('Starting Puppeteer\n');
    const pages = await browser.pages();
    const page = pages[0];
    await page.goto(`${domainURL}/login`, { waitUntil: 'domcontentloaded' });

    process.stdout.write('Loading Page\n');
    await page.waitFor('.login-form');
    await page.type('#email', username);
    await page.type('#password', password);

    process.stdout.write('Waiting to log in\n');
    await page.waitFor('button[type=submit]');
    await page.waitFor(1500);
    await page.click('button[type=submit]');
    process.stdout.write('Waiting for cookies.\n');
    // await page.waitForNavigation();

    const cookies = await page.cookies();
    await writeToFile(cookies, 'cookies');
    return null;
};
