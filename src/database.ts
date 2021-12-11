import mariadb from 'mariadb';
import { writeFile } from 'fs';

const connectionSettingsDB:mariadb.ConnectionConfig = {
    host: '192.168.1.240',
    user: 'root',
    password: 'heist072603',
    database: 'movie_db'
}

const writeToFile = (data: string, fileName: string): Promise<void> =>
    new Promise((resolve, reject) => {
        writeFile(`${fileName}.sql`, data, 'utf8', function (err) {
            if (err) {
                console.log(`An error occured while writing ${fileName} sql file.`);
                return reject(err);
            }
            console.log(`${fileName} sql file has been saved.`);
            resolve();
        });
    });

const initializeDB = async () => {
    const conn = await mariadb.createConnection(connectionSettingsDB);

    try {
        return await conn.query(`
        CREATE TABLE users (
            userId VARCHAR(100) NOT NULL PRIMARY KEY,
            contactInviteId VARCHAR(100)
        )`)
        .then(() => conn.query(`
        CREATE TABLE post_items (
            postItemId VARCHAR(100) NOT NULL PRIMARY KEY,
            userId VARCHAR(100),
            createdAt VARCHAR(100) NOT NULL,
            updatedAt VARCHAR(100),
            editedAt VARCHAR(100)
        )`))
        .then(() => conn.query(`
        CREATE TABLE feed (
            item_text VARCHAR(1000) NOT NULL,
            cost DECIMAL(5,2),
            postItem VARCHAR(100)
        )`))
        .then(() => conn.query(`CREATE TABLE recent_time (time VARCHAR(100))`));
    } catch (error) {
        console.error(error);
    } finally {
        conn.end();
    }
}

// Fix "any" data assignments
const addScrapeDataToDB = async (data:any) => {
    const conn = await mariadb.createConnection(connectionSettingsDB);

    try {
        const feedSql = `
        REPLACE INTO feed(
            item_text,
            cost,
            postItem
        )
        VALUES ${data.feed.map((item:any) => `("${item.text}", ${item.cost}, "${item.postItemId}")`).join(', ')}`;
        // writeToFile(feedSql, 'feedSQL');
        const postItemsSql = `
        REPLACE INTO post_items(
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
            }", null)`;
        })}`;
        // writeToFile(postItemsSql, 'postItemsSQL');
        const usersSql = `
        REPLACE INTO users(
            userId,
            contactInviteId
        )
        VALUES ${Object.keys(data.users).map(user => `("${user}", "${data.users[`${user}`].contactInviteId}")`)}`;

        return await conn.query(usersSql)
            .then(() => conn.query(postItemsSql))
            .then(() => conn.query(feedSql))
            .then(() => conn.query(`REPLACE INTO recent_time(time) VALUES ("${data.time}")`));
    } catch (error) {
        console.error(error);
    } finally {
        conn.end;
    }
}

const getListOfPostsFromDB = async() => {
    const conn = await mariadb.createConnection(connectionSettingsDB);

    try {
        return await conn.query(`SELECT postItemId FROM post_items`);
    } catch (error) {
        console.error(error);
    } finally {
        conn.end();
    }
}

// const template = async() => {
//     const conn = await mariadb.createConnection(connectionSettingsDB);

//     try {
//         return await conn.query(`
        
//         `);
//     } catch (error) {
//         console.error(error);
//     } finally {
//         conn.end();
//     }
// }

export { initializeDB, addScrapeDataToDB, getListOfPostsFromDB }