const fs = require('fs');
const client = require('superagent');
require('dotenv').config();

const loginURL = process.env.LOGINURL;

module.exports = {
    readInput: reader =>
        new Promise((resolve, reject) => {
            try {
                reader.on('line', input => {
                    resolve(input);
                });
            } catch (err) {
                reject(err);
            }
        }),
    writeToFile: (data, fileName) =>
        new Promise((resolve, reject) => {
            const stringifiedData = JSON.stringify(data);
            fs.writeFile(`${fileName}.json`, stringifiedData, 'utf8', function(err) {
                if (err) {
                    console.log(`An error occured while writing ${fileName} JSON file.`);
                    return reject(err);
                }
                console.log(`${fileName} JSON file has been saved.`);
                resolve();
            });
        }),
    deleteCookies: (path, fileName) =>
        new Promise((resolve, reject) => {
            fs.unlink(path, err => {
                if (err) {
                    console.log(`An error occured while deleting ${fileName} file.`);
                    return reject(err);
                }
                console.log(`${fileName} has been deleted.`);
                resolve();
            });
        }),
    makeGetRequest: (postURL, cookieString, csrfToken) =>
        new Promise((resolve, reject) => {
            client
                .get(loginURL + postURL)
                .set('Cookie', cookieString)
                .set('x-csrf-token', `${csrfToken}`)
                .then(res => {
                    resolve(res.body);
                })
                .catch(err => {
                    console.error(`Error in posts request:\n${err}`);
                    return reject();
                });
        }),
    cookiesExist: path =>
        new Promise((resolve, reject) => {
            fs.access(path, fs.constants.F_OK, err => {
                if (err) {
                    return resolve(false);
                }
                resolve(true);
            });
        }),
    readJSONFile: path =>
        new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err) {
                    console.log(`There was an error reading json at ${path}.`);
                    return reject(err);
                }
                resolve(JSON.parse(data));
            });
        }),
};
