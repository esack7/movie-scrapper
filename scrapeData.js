const { getTime, parseJSON } = require('date-fns');
const { makeGetRequest, writeToFile, fileExists, formatFeed, formatPost, readJSONFile } = require('./utils');
const mergeData = require('./mergeData');
require('dotenv').config();

const postURL = process.env.POSTURL;
const filePath = `./postFeedData.json`;

module.exports = async function(csrfToken, cookieString) {
    let newURL = postURL;
    const postsFeedDataExists = await fileExists(filePath);
    let postFeedData = {
        users: {},
        postItems: {},
        feed: [],
    };
    const userObj = {};
    const postItemsObj = {};
    const feedArray = [];

    process.stdout.write(`Accessing Posts Data`);
    for (let i = 0; i < 10; i++) {
        process.stdout.write(` .`);
        const res = await makeGetRequest(newURL, cookieString, csrfToken).catch(err => {
            console.error('Something went wrong with the request:\n', err);
        });
        const { users } = res;
        const feed = await formatFeed(res.feed, formatPost);
        newURL = res._links.nextPage.href;

        users.map(user => {
            userObj[`${user.id}`] = {
                name: user.name,
                contactInviteId: user.contactInviteId,
                posts: [],
            };
            return null;
        });

        feed.map(posts => {
            posts.map(post => {
                postItemsObj[`${post.postItemId}`] = {
                    userId: post.userId,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                    editedAt: post.editedAt,
                };
                feedArray.push({
                    text: post.text,
                    cost: post.cost,
                    postItemId: post.postItemId,
                });
                return null;
            });
            return null;
        });
    }
    const timeScrapped = parseJSON(getTime(new Date()));
    process.stdout.write(` done!\n`);

    Object.keys(postItemsObj).map(ele => {
        const user = postItemsObj[`${ele}`].userId;
        userObj[`${user}`].posts.push(ele);
        return null;
    });

    const sortedFeed = feedArray.sort((a, b) => b.cost - a.cost);
    postFeedData = { feed: sortedFeed, postItems: postItemsObj, users: userObj, time: timeScrapped };

    if (postsFeedDataExists) {
        const priorPostFeedData = await readJSONFile(filePath);
        const mergedPostFeedData = await mergeData(priorPostFeedData, postFeedData);

        await writeToFile(mergedPostFeedData, 'postFeedData');
    } else {
        await writeToFile(postFeedData, 'postFeedData');
    }
};
