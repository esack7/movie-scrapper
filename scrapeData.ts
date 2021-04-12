import { getTime, parseJSON, differenceInSeconds } from 'date-fns';
import { makeGetRequest, writeToFile, fileExists, formatFeed, formatPost, readJSONFile } from './utils';
import mergeData from './mergeData';
import createExcel from './createExcel';
require('dotenv').config();

const postURL = process.env.POSTURL;
const filePath: string  = `./postFeedData.json`;

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
    let postsToRemove = [];

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
    const timeScrapped = getTime(new Date());
    process.stdout.write(` done!\n`);

    // Add posts to users
    Object.keys(postItemsObj).map(ele => {
        const user = postItemsObj[`${ele}`].userId;
        userObj[`${user}`].posts.push(ele);
        return null;
    });

    // Populate postsToRemove array
    Object.keys(userObj).map(user => {
        const userPosts = userObj[`${user}`].posts;
        if (userPosts.length > 1) {
            let postToKeep = '';
            let ageOfPost = 1000000; // Should be amount greater than the oldest item to keep, 1 week === 604800
            postsToRemove = postsToRemove.concat(
                userPosts
                    .map(post => {
                        const age = differenceInSeconds(postItemsObj[`${post}`].createdAt, timeScrapped);
                        if (age < ageOfPost) {
                            ageOfPost = age;
                            postToKeep = post;
                        }
                        return post;
                    })
                    .filter(post => post !== postToKeep)
            );
            userObj[`${user}`].posts = [postToKeep];
        }
        if (userPosts.length === 0) {
            delete userObj[`${user}`];
        }
        return null;
    });

    postsToRemove.map(item => {
        delete postItemsObj[`${item}`];
        return null;
    });

    const filteredSortedFeed = feedArray
        .filter(item => !postsToRemove.includes(item.postItemId))
        .sort((a, b) => b.cost - a.cost);

    postFeedData = { feed: filteredSortedFeed, postItems: postItemsObj, users: userObj, time: parseJSON(timeScrapped) };

    if (postsFeedDataExists) {
        const priorPostFeedData = await readJSONFile(filePath);
        const mergedPostFeedData = await mergeData(priorPostFeedData, postFeedData);

        await writeToFile(mergedPostFeedData, 'postFeedData');
        await createExcel();
    } else {
        await writeToFile(postFeedData, 'postFeedData');
        await createExcel();
    }
};
