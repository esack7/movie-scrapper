const sqlite = require('sqlite3').verbose();

const dbConnectString = `./MovieData.db`;

module.exports = {
    initializeDb: async () => {
        const db = new sqlite.Database(dbConnectString);
        db.serialize(() => {
            console.log('Test');
            db.run(`
            CREATE TABLE users (
                userId TEXT NOT NULL PRIMARY KEY,
                contactInviteId TEXT
            )`);
            db.run(
                `CREATE TABLE post_items (
                    postItemId TEXT NOT NULL PRIMARY KEY,
                    userId TEXT,
                    createdAt TEXT NOT NULL,
                    updatedAt TEXT,
                    editedAt TEXT,
                    FOREIGN KEY(userId) REFERENCES users(userId)
                )`
            );
            db.run(`
            CREATE TABLE feed (
                item_text TEXT NOT NULL,
                cost DECIMAL(5,2),
                postItem TEXT,
                FOREIGN KEY(postItem) REFERENCES post_items(postItemId)
            )`);
            db.run(`CREATE TABLE recent_time (time TEXT)`);
            console.log('Test2');
        });

        db.close();
    },
    addFeedItemsDb: async feed => {
        const db = new sqlite.Database(dbConnectString);
        const feedSql = `
        INSERT INTO feed(
            text,
            cost,
            postItem
        )
        VALUES ${feed.map(item => `("${item.text}", ${item.cost}, "${item.postItemId}")`).join(', ')}`;
        db.serialize(() => {
            db.run(feedSql);
        });
        db.close();
    },
    addScrapeDataToDb: async data => {
        const db = new sqlite.Database(dbConnectString);
        const feedSql = `
        INSERT INTO feed(
            item_text,
            cost,
            postItem
        )
        VALUES ${data.feed.map(item => `("${item.text}", ${item.cost}, "${item.postItemId}")`).join(', ')}`;
        const postItemsSql = `
        INSERT INTO post_items(
            postItemId,
            userId,
            createdAt,
            updatedAt,
            editedAt
        )
        VALUES ${Object.keys(data.postItems).map(post => {
            if (data.postItems[`${post}`].editedAt) {
                return `("${post}", "${data.postItems[`${post}`].userId}", "${data.postItems[`${post}`].createdAt}", "${
                    data.postItems[`${post}`].updatedAt
                }", "${data.postItems[`${post}`].editedAt}")`;
            }
            return `("${post}", "${data.postItems[`${post}`].userId}", "${data.postItems[`${post}`].createdAt}", "${
                data.postItems[`${post}`].updatedAt
            }")`;
        })}`;
        const usersSql = `
        INSERT INTO users(
            userId,
            contactInviteId
        )
        VALUES ${Object.keys(data.users).map(user => `("${user}", "${data.users[`${user}`].contactInviteId}")`)}`;

        db.serialize(() => {
            db.run(feedSql);
            db.run(postItemsSql);
            db.run(usersSql);
            db.run(`INSERT INTO recent_time(time) VALUES ("${data.time}")`);
        });

        db.close();
    },
    getPostItems: () => {
        const db = new sqlite.Database(dbConnectString);
        const sqlQuery = `SELECT postItemId FROM post_items`;
        return new Promise((resolve, reject) => {
            db.all(sqlQuery, [], (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        }).then(result => {
            db.close();
            return result;
        });
    },
    deleteFeedItemByPostIds: postIdArray => {
        const db = new sqlite.Database(dbConnectString);
        const deleteQuery = `DELETE FROM feed WHERE postItem IN ("${postIdArray.map(id => `${id}`).join('", "')}")`;
        // console.log(deleteQuery);
        return new Promise((resolve, reject) => {
            db.run(deleteQuery, [], err => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        }).then(() => {
            db.close();
            return null;
        });
    },
};
// const scrapeData = require('./postFeedData2.json');

// module.exports.addScrapeDataToDb(scrapeData);
