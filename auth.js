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
    const browser = await puppeteer.launch({ headless: false });
    process.stdout.write('Starting Puppeteer\n');
    const pages = await browser.pages();
    const page = pages[0];
    await page.goto(`${domainURL}/login`);

    process.stdout.write('Loading Page\n');
    await page.waitForSelector('.login-form', { visible: true });
    await page.type('#email', username);
    await page.type('#password', password);

    process.stdout.write('Waiting to log in\n');
    await page.waitFor(3000);
    await page.click('button[type=submit]');
    process.stdout.write('Waiting for cookies. This can take some time...\n');
    let currentURL = await page.mainFrame().url();
    while (currentURL !== `${domainURL}/myworld`) {
        await page.waitFor(1000);
        currentURL = await page.mainFrame().url();
    }
    process.stdout.write(`Logged into ${currentURL}\n`);
    try {
        await page.waitForNavigation();

        const cookies = await page.cookies();
        await writeToFile(cookies, 'cookies');
        browser.close();
        return null;
    } catch (error) {
        process.stdout.write('Timed Out...cookies may be invalid.\n');
        const cookies = await page.cookies();
        await writeToFile(cookies, 'cookies');
        browser.close();
        return null;
    }
};
