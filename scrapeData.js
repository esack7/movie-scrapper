const { getTime, parseJSON } = require('date-fns');
const { makeGetRequest, writeToFile, fileExists, formatFeed, formatPost, readJSONFile } = require('./utils');
require('dotenv').config();

const postURL = process.env.POSTURL;
const filePath = `./postFeedData.json`;

module.exports = async function(csrfToken, cookieString) {
    let newURL = postURL;
    const postsFeedDataExists = await fileExists(filePath);
    let postFeedData = {};
    let userObj = {};
    let postItemsObj = {};
    let feedArray = [];

    if (postsFeedDataExists) {
        postFeedData = readJSONFile(filePath);
        userObj = postFeedData.users;
        postItemsObj = postFeedData.postItems;
        feedArray = postFeedData.feed;
    }

    process.stdout.write(`Accessing Posts Data`);
    for (let i = 0; i < 10; i++) {
        process.stdout.write(` .`);
        const res = await makeGetRequest(newURL, cookieString, csrfToken).catch(err => {
            console.error('Something went wrong with the request:\n', err);
        });
        const { users } = res;
        const feed = await formatFeed(res.feed, formatPost);
        newURL = res._links.nextPage.href;
        // feedArray.push(feed);
        feed.map(posts => {
            // console.log(posts);
            posts.map(
                post =>
                    // console.log(post);
                    null
            );
            return null;
        });
        users.map(user => {
            console.log('User: ', user);
            // userObj[`${user.id}`] = {
            //     name: user.name,
            //     contactInviteId: user.contactInviteId,
            // };
            return null;
        });
    }
    const timeScrapped = parseJSON(getTime(new Date()));
    process.stdout.write(` done!\n`);

    const flattenedFeed = [].concat(...[].concat(...feedArray)).sort((a, b) => b.cost - a.cost);

    postFeedData = { feed: flattenedFeed, postItems: postItemsObj, users: userObj, time: timeScrapped };

    await writeToFile(postFeedData, 'postFeedData');
};
