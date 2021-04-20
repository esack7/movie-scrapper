import { getTime, differenceInMinutes, differenceInHours, parseISO } from 'date-fns';
import { readPostFeedDataJSONFile } from './utils.js';
require('dotenv').config();

const domainURL = process.env.DOMAINURL;
const groupURL = process.env.GROUPURL;

export default async function (searchTerm: string) {
    const searchRegex = new RegExp(searchTerm, 'i');
    const now = getTime(new Date());
    const data = await readPostFeedDataJSONFile('./postFeedData.json');
    // need to fix readJSONFile to reade both types of JSON files, change objects to either array or Map or Record
    data.feed.forEach(item => {
        // console.log(item);
        const diffHours = differenceInHours(now, data.postItems.get(item.postItemId)!.createdAt);
        const diffMinutes = differenceInMinutes(now, data.postItems.get(item.postItemId)!.createdAt);
        if (item.text.match(searchRegex)) {
            process.stdout.write(`\n${item.text}\n`);
            process.stdout.write(`Posted ${diffHours} hours ${diffMinutes - diffHours * 60} minutes ago\n`);
            process.stdout.write(`${domainURL}${groupURL}/profile/${data.postItems.get(item.postItemId)!.userId}\n`);
        }
    });
};
