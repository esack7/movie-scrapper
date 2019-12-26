const puppeteer = require('puppeteer');
const client = require('superagent');
const fs = require('fs');
require('dotenv').config();

const username = process.env.USRNAME;
const password = process.env.PSWORD;
const loginURL = process.env.LOGINURL;
const groupURL = process.env.GROUPURL;
const postURL = process.env.POSTURL;

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
    let cookies;
    let csrfToken;
    let cookieString = '';
    const browser = await puppeteer.launch({ headless: false});
    const pages = await browser.pages()
    const page = pages[0];

    
    await page.goto(loginURL, { waitUntil: 'domcontentloaded' });
    await page.waitFor('input[name=username]');
    await page.click('#login-fake-btn');
    await page.type('#email', username);
    await page.type('#password', password);
    await page.waitFor(3000);
    await page.click('button.btn-login');
    await page.waitForNavigation();

    cookies = await page.cookies();
    writeToFile(cookies, 'cookies')
    cookies.map(ele => {
        if (ele.name === "csrf-token") {
            csrfToken = ele.value;
        }
        cookieString = cookieString + `${ele.name}=${ele.value};`;
    })

    client.get(loginURL + postURL)
        .set("Cookie", cookieString)
        .set('x-csrf-token', `${csrfToken}`)
        .then(res => {
            writeToFile(res.body, 'postFeed');
        })
        .catch(err => console.error(`Error in posts request:\n${err}`))
    })()
    
        