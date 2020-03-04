const { getTime, differenceInMinutes, differenceInHours } = require('date-fns');
const { readJSONFile } = require('./utils.js');
require('dotenv').config();

const domainURL = process.env.DOMAINURL;
const groupURL = process.env.GROUPURL;

module.exports = async function(searchTerm) {
    const searchRegex = new RegExp(searchTerm, 'i');
    const now = getTime(new Date());
    const data = await readJSONFile('./postFeedData.json');
    await data.feed.map(item => {
        const diffHours = differenceInHours(now, item.createdAt * 1000);
        const diffMinutes = differenceInMinutes(now, item.createdAt * 1000);
        if (item.text.match(searchRegex)) {
            process.stdout.write(`\n${item.text}\n`);
            process.stdout.write(`Posted ${diffHours} hours ${diffMinutes - diffHours * 60} minutes ago\n`);
            process.stdout.write(`${domainURL}${groupURL}/profile/${item.userId}\n`);
        }
        return null;
    });
};
