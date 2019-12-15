const puppeteer = require('puppeteer');
require('dotenv');

(async () => {
    const username = process.env.USERNAME;
    const password = process.env.PASSWORD;
    const loginURL = process.env.LOGINURL;
    const pageURL = '';
    const browser = await puppeteer.launch({ headless: false, slowMo: 250 });
    const pages = await browser.pages()
    const page = pages[0];

    await page.goto(loginURL, { waitUntil: 'domcontentloaded' });
    await page.type('#email', username);
    await page.type('#password', password);
    await page.click('#btn-login')

})()