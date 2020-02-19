const { getTime, differenceInMinutes, differenceInHours } = require('date-fns');
const data = require('./postFeedArray.json');
require('dotenv').config();

const loginURL = process.env.LOGINURL;
const groupURL = process.env.GROUPURL;

module.exports = async function(searchTerm) {
    const searchRegex = new RegExp(searchTerm, 'i');
    const now = getTime(new Date());
    await data.map(post => {
        post.feed.map(ele => {
            const diffHours = differenceInHours(now, ele.createdAt * 1000);
            const diffMinutes = differenceInMinutes(now, ele.createdAt * 1000);
            ele.text.split('\n').map(line => {
                if (line.match(searchRegex)) {
                    process.stdout.write(`\n${line}\n`);
                    process.stdout.write(`Posted ${diffHours} hours ${diffMinutes - diffHours * 60} minutes ago\n`);
                    process.stdout.write(`${loginURL}${groupURL}/profile/${ele.userId}\n`);
                }
                return null;
            });
            return null;
        });
        return null;
    });
};
