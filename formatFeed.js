const { formatPost } = require('./utils.js');

module.exports = async function(feed) {
    const formattedFeed = [];
    for (let i = 0; i < feed.length; i++) {
        const formattedPost = await formatPost(feed[i]);
        formattedFeed.push(formattedPost);
    }
    return formattedFeed;
};
