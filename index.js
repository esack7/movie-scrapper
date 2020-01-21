const { cookiesExist, readJSONFile, makeGetRequest, deleteCookies, writeToFile } = require('./utils.js');
const auth = require('./auth.js');
require('dotenv').config();

const postURL = process.env.POSTURL;

async function main() {
    let cookies;
    let csrfToken;
    let cookieString = '';
    const cookiesPath = "./cookies.json";
    
    let cookieExist = await cookiesExist(cookiesPath);
    
    if(!cookieExist) {
        await auth();
        main();
    } else {
        cookies = await readJSONFile(cookiesPath);
        let stop = false;
    
        cookies.map(ele => {
            if (ele.name === "csrf-token") {
                csrfToken = ele.value;
            }
            cookieString = cookieString + `${ele.name}=${ele.value};`;
        })
        
        let newURL = postURL;
        let postsArray = [];
        for(let i = 0; i < 11; i++) {
            stop = false;
            console.log("Token: ", csrfToken)
            let post = await makeGetRequest(newURL, cookieString, csrfToken).catch(err => {
                console.error('Here is the error in GET request:\n', err)
                stop = true;
            })
            if(stop) {
                await deleteCookies(cookiesPath, 'cookies.json');
                break;
            }
            newURL = post._links.nextPage.href;
            postsArray.push(post);
        }
        stop ? main() : await writeToFile(postsArray, 'postFeedArray').then(() => {
            process.exit();
        });
    }
    return null
}

main();