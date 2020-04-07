const { getPostItems, deleteFeedItemByPostIds } = require('./database.js');

const prior = require('./postFeedData2.json');
const current = require('./postFeedData.json');

module.exports = (priorData, newData) =>
    new Promise(async (resolve, reject) => {
        console.log('Need to implement "MERGE"!');
        // console.log(priorData);
        try {
            const savedPostItems = {};
            const postsToAdd = [];
            const postsToUpdate = [];
            // Get saved post_items and create object to compare to new data
            const savedPostItemsArray = await getPostItems();
            savedPostItemsArray.map(post => {
                savedPostItems[`${post.postItemId}`] = {
                    userId: post.userId,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                    editedAt: post.editedAt,
                };
                return null;
            });
            // Compare new and saved data to determine which posts to add and which to update
            Object.keys(newData.postItems).map(postId => {
                if (!savedPostItems[`${postId}`]) {
                    postsToAdd.push(postId);
                } else {
                    const newPost = newData.postItems[`${postId}`];
                    const savedPost = savedPostItems[`${postId}`];
                    if (newPost.updatedAt !== savedPost.updatedAt || newPost.editedAt !== savedPost.editedAt) {
                        postsToUpdate.push(postId);
                        postsToAdd.push(postId);
                    }
                }
                return null;
            });

            await deleteFeedItemByPostIds(postsToUpdate);
            console.log('Posts To Add: ', postsToAdd.length);
            console.log('New Data Posts: ', Object.keys(newData.postItems).length);
            console.log('Old Data Posts: ', savedPostItemsArray.length);
            console.log('Posts To Update: ', postsToUpdate);

            resolve(newData);
        } catch (err) {
            reject(err);
        }
    });

// module.exports(prior, current);
