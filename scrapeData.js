const { makeGetRequest, writeToFile } = require('./utils');
require('dotenv').config();

const postURL = process.env.POSTURL;

module.exports = async function(csrfToken, cookieString) {
    let newURL = postURL;
    const postsArray = [];
    for (let i = 0; i < 11; i++) {
        console.log('Token: ', csrfToken);
        const post = await makeGetRequest(newURL, cookieString, csrfToken).catch(err => {
            console.error('Something went wrong with the request:\n', err);
        });

        newURL = post._links.nextPage.href;
        postsArray.push(post);
    }

    await writeToFile(postsArray, 'postFeedArray');
};
