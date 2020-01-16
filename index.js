const puppeteer = require('puppeteer');
const client = require('superagent');
const fs = require('fs');
require('dotenv').config();

const username = process.env.USRNAME;
const password = process.env.PSWORD;
const loginURL = process.env.LOGINURL;
const postURL = process.env.POSTURL;

function writeToFile (data, fileName) {
    return new Promise((resolve, reject) => {
        const stringifiedData = JSON.stringify(data);
        fs.writeFile(`${fileName}.json`, stringifiedData, 'utf8', function (err) {
            if (err) {
                console.log(`An error occured while writing ${fileName} JSON file.`);
                return reject(err);
            }
            console.log(`${fileName} JSON file has been saved.`);
            resolve();
        });
    })
}

function makeGetRequest (postURL, cookieString, csrfToken) {
    return new Promise((resolve, reject) => {
        client.get(loginURL + postURL)
            .set("Cookie", cookieString)
            .set('x-csrf-token', `${csrfToken}`)
            .then(res => {
                resolve(res.body);
            })
            .catch(err => {
                console.error(`Error in posts request:\n${err}`);
                return reject();
            })
    });
}

function cookiesExist(path) {
    return new Promise((resolve, reject) => {
        fs.access(path,fs.constants.F_OK, (err) => {
            if(err) {
                return resolve(false);
            }
            resolve(true);
        })
    })
}

(async () => {
    let cookies;
    let csrfToken;
    let cookieString = '';
    const cookiesPath = "./cookies.json";

    let cookieExist = await cookiesExist(cookiesPath);

    if(!cookieExist) {
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
    } else {
        cookies = require(cookiesPath);
    
        cookies.map(ele => {
            if (ele.name === "csrf-token") {
                csrfToken = ele.value;
            }
            cookieString = cookieString + `${ele.name}=${ele.value};`;
        })
        
        let newURL = postURL;
        let postsArray = [];
        for(let i = 0; i < 10; i++) {
            console.log("Token: ", csrfToken)
            let post = await makeGetRequest(newURL, cookieString, csrfToken)
            newURL = post._links.nextPage.href;
            postsArray.push(post);
        }
    
        await writeToFile(postsArray, 'postFeedArray');
    }


    })()
    
        