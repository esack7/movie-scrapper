const { makeGetRequest, writeToFile, fileExists, formatFeed, formatPost } = require('./utils');
require('dotenv').config();

const postURL = process.env.POSTURL;
const filePath = `./postFeedArray.json`;

module.exports = async function(csrfToken, cookieString) {
    let newURL = postURL;
    const postsArrayExists = await fileExists(filePath);
    console.log('Array exists? ', postsArrayExists);
    const feedArray = [];
    const usersArray = [];
    process.stdout.write(`Accessing Posts Data`);
    for (let i = 0; i < 10; i++) {
        process.stdout.write(` .`);
        const res = await makeGetRequest(newURL, cookieString, csrfToken).catch(err => {
            console.error('Something went wrong with the request:\n', err);
        });
        const { users } = res;
        const feed = await formatFeed(res.feed, formatPost);
        newURL = res._links.nextPage.href;
        feedArray.push(feed);
        usersArray.push(users);
    }
    process.stdout.write(` done!\n`);
    const flattenedFeed = [].concat(...[].concat(...feedArray)).sort((a, b) => b.cost - a.cost);
    const flattenedUsers = [].concat(...[].concat(...usersArray));
    const postFeedData = { feed: flattenedFeed, users: flattenedUsers };
    await writeToFile(postFeedData, 'postFeedData');
};
