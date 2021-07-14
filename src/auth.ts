import puppeteer from 'puppeteer';
import { writeToFile, readInput } from './utils';

require('dotenv').config();

let logincred: string | undefined = process.env.LOGINCRED;
let password: string | undefined = process.env.PSWORD;
const username: string | undefined = process.env.USRNAME;
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
    process.stdout.write('Starting Puppeteer\n');
    const pages = await browser.pages();
    const page = pages[0];
    await page.goto(`${domainURL}/login`);

    process.stdout.write('Loading Page\n');
    await page.waitForSelector('.login-form', { visible: true });
    await page.type('#email', logincred);
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
}
