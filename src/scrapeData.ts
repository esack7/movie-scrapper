import { getTime, parseJSON, differenceInSeconds } from 'date-fns';
import { makeGetRequest, writeToFile, fileExists, formatFeed, readPostFeedDataJSONFile } from './utils';
import mergeData from './mergeData';
import createExcel from './createExcel';
require('dotenv').config();

const postURL = process.env.POSTURL!;
const filePath: string = `./postFeedData.json`;

export default async function (csrfToken: string, cookieString: string) {
    let newURL = postURL;
    const postsFeedDataExists = await fileExists(filePath);
    const userObj = new Map<string, UserTrackingInterface>();
    const postItemsObj = new Map<string, PostItemInterface>();
    const feedArray: FeedItemInterface[] = [];
    let postsToRemove: string[] = [];

    process.stdout.write(`Accessing Posts Data`);
    for (let i = 0; i < 10; i++) {
        process.stdout.write(` .`);
        try {
            const res = await makeGetRequest(newURL, cookieString, csrfToken);
            const { users } = res;
            const feed = await formatFeed(res.feed);
            newURL = res._links.nextPage.href;

            users.forEach(user => {
                userObj.set(user.id, {
                    name: user.name,
                    contactInviteId: user.contactInviteId,
                    posts: [],
                })
            });

            feed.forEach(posts => {
                posts.forEach(post => {
                    postItemsObj.set(post.postItemId, {
                        userId: post.userId,
                        createdAt: post.createdAt,
                        updatedAt: post.updatedAt ? post.updatedAt : undefined,
                        editedAt: post.editedAt ? post.editedAt : undefined,
                    })
                    feedArray.push({
                        text: post.text,
                        cost: post.cost,
                        postItemId: post.postItemId,
                    });
                });
            });

        } catch (err) {
            console.error('Something went wrong with the request:\n', err);
        }
    }
    const timeScrapped = getTime(new Date());
    process.stdout.write(` done!\n`);

    // Add posts to users
    postItemsObj.forEach((ele, postItemId) => {
        const user: string = ele.userId;
        userObj.get(user)!.posts.push(postItemId);
    });

    // Populate postsToRemove array
    userObj.forEach((user, userId) => {
        const userPosts = userObj.get(userId)!.posts;
        if (userPosts.length > 1) {
            let postToKeep = '';
            let ageOfPost = 1000000; // Should be amount greater than the oldest item to keep, 1 week === 604800
            postsToRemove = postsToRemove.concat(
                userPosts
                    .map(post => {
                        const age = differenceInSeconds(postItemsObj.get(post)!.createdAt, timeScrapped);
                        if (age < ageOfPost) {
                            ageOfPost = age;
                            postToKeep = post;
                        }
                        return post;
                    })
                    .filter(post => post !== postToKeep)
            );
            userObj.get(userId)!.posts = [postToKeep];
        }
        if (userPosts.length === 0) {
            userObj.delete(userId);
        }
    });

    postsToRemove.forEach(item => {
        postItemsObj.delete(item);
    });

    const filteredSortedFeed = feedArray
        .filter(item => !postsToRemove.includes(item.postItemId))
        .sort((a, b) => b.cost - a.cost);

    let postFeedData = {
        feed: filteredSortedFeed,
        postItems: Object.fromEntries(postItemsObj),
        users: Object.fromEntries(userObj),
        time: parseJSON(timeScrapped)
    };

    if (postsFeedDataExists) {
        const priorPostFeedData = await readPostFeedDataJSONFile(filePath);
        const mergedPostFeedData = await mergeData(priorPostFeedData, postFeedData);

        await writeToFile(mergedPostFeedData, 'postFeedData');
        await createExcel();
    } else {
        await writeToFile(postFeedData, 'postFeedData');
        await createExcel();
    }
};
