const puppeteer = require('puppeteer');
const { writeToFile, readInput } = require('./utils.js');
require('dotenv').config();

let username = process.env.USRNAME;
let password = process.env.PSWORD;
const loginURL = process.env.LOGINURL;

module.exports = async function() {
    if (!username) {
        process.stdout.write('What is your your "Username":\n');
        username = await readInput();
    }
    if (!password) {
        process.stdout.write('What is your your "Password":\n');
        password = await readInput();
    }
    const browser = await puppeteer.launch({ headless: false });
    process.stdout.write('Starting Puppeteer\n');
    const pages = await browser.pages();
    const page = pages[0];
    await page.goto(loginURL, { waitUntil: 'domcontentloaded' });

    process.stdout.write('Loading Page\n');
    await page.waitFor('input[name=username]');
    await page.click('#login-fake-btn');
    await page.type('#email', username);
    await page.type('#password', password);

    process.stdout.write('Waiting to log in\n');
    await page.waitFor(3000);
    await page.click('button.btn-login');
    await page.waitForNavigation();

    const cookies = await page.cookies();
    await writeToFile(cookies, 'cookies');
    return null;
};
