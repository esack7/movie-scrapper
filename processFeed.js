const { getTime, differenceInMinutes, differenceInHours, parseISO } = require('date-fns');
const { readJSONFile } = require('./utils.js');
require('dotenv').config();

const domainURL = process.env.DOMAINURL;
const groupURL = process.env.GROUPURL;

module.exports = async function(searchTerm) {
    const searchRegex = new RegExp(searchTerm, 'i');
    const now = getTime(new Date());
    const data = await readJSONFile('./postFeedData.json');
    await data.feed.map(item => {
        // console.log(item);
        const diffHours = differenceInHours(now, parseISO(data.postItems[`${item.postItemId}`].createdAt));
        const diffMinutes = differenceInMinutes(now, parseISO(data.postItems[`${item.postItemId}`].createdAt));
        if (item.text.match(searchRegex)) {
            process.stdout.write(`\n${item.text}\n`);
            process.stdout.write(`Posted ${diffHours} hours ${diffMinutes - diffHours * 60} minutes ago\n`);
            process.stdout.write(`${domainURL}${groupURL}/profile/${data.postItems[`${item.postItemId}`].userId}\n`);
        }
        return null;
    });
};
