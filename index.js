const puppeteer = require('puppeteer');
const client = require('superagent');
require('dotenv').config();

const username = process.env.USRNAME;
const password = process.env.PSWORD;
const loginURL = process.env.LOGINURL;
const groupURL = process.env.GROUPURL;
const postURL = process.env.POSTURL;

(async () => {
    let cookies;
    const browser = await puppeteer.launch({ headless: false});
    const pages = await browser.pages()
    const page = pages[0];

    
    await page.goto(loginURL, { waitUntil: 'domcontentloaded' });
    await page.waitFor('input[name=username]');
    await page.click('#login-fake-btn');
    await page.type('#email', username);
    await page.type('#password', password);
    await page.waitFor(1500);
    await page.click('button.btn-login');
    await page.waitForNavigation();

    cookies = await page.cookies();

    client.get(loginURL + postURL)
        .set("Cookie", `${cookies[0].name}=${cookies[0].value};${cookies[1].name}=${cookies[1].value};${cookies[2].name}=${cookies[2].value};${cookies[3].name}=${cookies[3].value};${cookies[4].name}=${cookies[4].value};${cookies[5].name}=${cookies[5].value};${cookies[6].name}=${cookies[6].value};${cookies[7].name}=${cookies[7].value};`)
        .set(`x-${cookies[1].name}`, `${cookies[1].value}`)
        .then(res => {
            console.log(res.body);
        })
        .catch(err => console.error(`Error in posts request:\n${err}`))
    // await page.goto(loginURL + groupURL, { waitUntil: "domcontentloaded" })
    
    // console.log(`${cookies[0].name}=${cookies[0].value};${cookies[1].name}=${cookies[1].value};${cookies[2].name}=${cookies[2].value};${cookies[3].name}=${cookies[3].value};${cookies[4].name}=${cookies[4].value};${cookies[5].name}=${cookies[5].value};${cookies[6].name}=${cookies[6].value};${cookies[7].name}=${cookies[7].value};`);
})()
