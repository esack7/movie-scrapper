import { writeFile, unlink, access, readFile, constants } from 'fs';
import { createInterface, Interface } from 'readline';
import client from 'superagent';
import { parseJSON } from 'date-fns';
require('dotenv').config();

const domainURL = process.env.DOMAINURL;

const lineReader: Interface = createInterface({
    input: process.stdin,
    output: process.stdout,
});

const readInput = () =>
    new Promise<string>((resolve, reject) => {
        try {
            lineReader.on('line', (input: string) => {
                resolve(input);
            });
        } catch (err) {
            reject(err);
        }
    });
const writeToFile = (data: Object, fileName: string): Promise<void> =>
    new Promise((resolve, reject) => {
        const stringifiedData = JSON.stringify(data);
        writeFile(`${fileName}.json`, stringifiedData, 'utf8', function (err) {
            if (err) {
                console.log(`An error occured while writing ${fileName} JSON file.`);
                return reject(err);
            }
            console.log(`${fileName} JSON file has been saved.`);
            resolve();
        });
    });

const deleteCookies = (path: string, fileName: string): Promise<void> =>
    new Promise((resolve, reject) => {
        unlink(path, err => {
            if (err) {
                console.log(`An error occured while deleting ${fileName} file.`);
                return reject(err);
            }
            console.log(`${fileName} has been deleted.`);
            resolve();
        });
    });

const makeGetRequest = (postURL: string, cookieString: string, csrfToken: string): Promise<ResponseInterface> =>
    new Promise((resolve, reject) => {
        client
            .get(domainURL + postURL)
            .set('Cookie', cookieString)
            .set('x-csrf-token', `${csrfToken}`)
            .then(res => {
                resolve(res.body);
            })
            .catch(err => {
                return reject(err);
            });
    });

const fileExists = (path: string): Promise<boolean> =>
    new Promise((resolve, reject) => {
        access(path, constants.F_OK, err => {
            if (err) {
                return resolve(false);
            }
            resolve(true);
        });
    });

const readCookiesJSONFile = (path: string): Promise<Array<CookieInterface>> =>
    new Promise((resolve, reject) => {
        readFile(path, (err, buf) => {
            if (err) {
                console.log(`There was an error reading json at ${path}.`);
                return reject(err);
            }
            resolve(<Array<CookieInterface>>JSON.parse(buf.toString()));
        });
    });

const readPostFeedDataJSONFile = (path: string): Promise<PostFeedDataInterface> =>
    new Promise((resolve, reject) => {
        readFile(path, (err, buf) => {
            if (err) {
                console.log(`There was an error reading json at ${path}.`);
                return reject(err);
            }
            const jsonData = <PostFeedDataInterface>JSON.parse(buf.toString(), (key, value) => {
                if (key === 'users') {
                    const usersMap = new Map<string, UserTrackingInterface>();
                    for (const user in value) {
                        usersMap.set(user, value[user]);
                    }
                    return usersMap;
                }
                if (key === 'postItems') {
                    const postItemsMap = new Map<string, PostItemInterface>();
                    for (const postItem in value) {
                        postItemsMap.set(postItem, value[postItem]);
                    }
                    return postItemsMap
                }
                return value;
            });
            resolve(jsonData);
        });
    });

const formatFeed = async (feed: ResponseFeedItemInterface[]) => {
    const formattedFeed = [];

    const formatPost = (post: PostInterface) =>
        post.text
            .split('\n')
            .map(ele => {
                const eleObject = {
                    text: ele,
                    cost: 0,
                    postItemId: post.postItemId,
                    userId: post.userId,
                    createdAt: parseJSON(post.createdAt * 1000),
                    updatedAt: post.updatedAt ? parseJSON(post.updatedAt * 1000) : null,
                    editedAt: post.editedAt ? parseJSON(post.editedAt * 1000) : null,
                };
                const splitMoney = ele.split('$');
                if (splitMoney.length > 1) {
                    const detectedPrice = parseFloat(splitMoney[1].split(' ')[0]);
                    if (detectedPrice) {
                        eleObject.cost = detectedPrice;
                    }
                }
                eleObject.text = eleObject.text.replace(/[^a-z0-9 ]/gi, '').trim();
                return eleObject;
            })
            .filter(obj => !!obj.text.trim())
            .filter(obj => obj.text.indexOf('#') === -1);

    for (let i = 0; i < feed.length; i++) {
        const formattedPost = await formatPost(feed[i]);
        formattedFeed.push(formattedPost);
    }
    return formattedFeed;
};

export { readInput, writeToFile, deleteCookies, makeGetRequest, fileExists, readCookiesJSONFile, readPostFeedDataJSONFile, formatFeed, lineReader }