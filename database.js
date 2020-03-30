const sqlite = require('sqlite3').verbose();
const { readJSONFile } = require('./utils.js');

const test = async function() {
    const dataJSON = await readJSONFile('./postFeedData.json');
    const db = new sqlite.Database('MovieData.db');
    const feedSql = `INSERT INTO feed(text, cost, postItem) VALUES ${dataJSON.feed
        .map(item => `("${item.text}", ${item.cost}, "${item.postItemId}")`)
        .join(', ')}`;
    const postItemsSql = `INSERT INTO post_items(postItemId, userId, createdAt, updatedAt, editedAt) VALUES ${Object.keys(
        dataJSON.postItems
    ).map(
        post =>
            `("${post}", "${dataJSON.postItems[`${post}`].userId}", "${dataJSON.postItems[`${post}`].createdAt}", "${
                dataJSON.postItems[`${post}`].updatedAt
            }", "${dataJSON.postItems[`${post}`].editedAt}")`
    )}`;
    const usersSql = `INSERT INTO users(userId, contactInviteId, currentPost) VALUES ${Object.keys(dataJSON.users).map(
        user => `("${user}", "${dataJSON.users[`${user}`].contactInviteId}", "${dataJSON.users[`${user}`].posts[0]}")`
    )}`;

    db.serialize(() => {
        db.run('CREATE TABLE feed (text TEXT, cost INTEGER, postItem TEXT)');
        db.run(feedSql);
        db.run('CREATE TABLE post_items (postItemId TEXT, userId TEXT, createdAt TEXT, updatedAt TEXT, editedAt TEXT)');
        db.run(postItemsSql);
        db.run('CREATE TABLE users (userId TEXT, contactInviteId TEXT, currentPost TEXT)');
        db.run(usersSql);
        db.run('CREATE TABLE recent_time (time TEXT)');
        db.run(`INSERT INTO recent_time(time) VALUES ("${dataJSON.time}")`);
    });

    db.close();
};

test();
