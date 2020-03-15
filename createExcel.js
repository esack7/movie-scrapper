const xlsx = require('xlsx');
// const { differenceInMilliseconds, parseJSON, parseISO } = require('date-fns');
const { readJSONFile } = require('./utils.js');
require('dotenv').config();

const domainURL = process.env.DOMAINURL;
const groupURL = process.env.GROUPURL;

const test = async () => {
    const dataJSON = await readJSONFile('./postFeedData.json');
    const dataLength = dataJSON.feed.length + 1;
    const WorkBook = xlsx.utils.book_new();
    const newFeedData = dataJSON.feed.map(item => {
        item.Movie = item.text;
        item.Price = item.cost;
        item.Link = `${domainURL}${groupURL}/profile/${dataJSON.postItems[`${item.postItemId}`].userId}`;
        item.Posted = dataJSON.postItems[`${item.postItemId}`].createdAt;
        item.Seller = dataJSON.users[`${dataJSON.postItems[`${item.postItemId}`].userId}`].name;
        delete item.text;
        delete item.cost;
        delete item.postItemId;
        return item;
    });
    const dataWorkSheet = xlsx.utils.json_to_sheet(newFeedData, { cellDates: true });

    for (let i = 2; i <= dataLength; i++) {
        const link = dataWorkSheet[`C${i}`].v;
        dataWorkSheet[`C${i}`].t = 'l';
        dataWorkSheet[`C${i}`].v = 'Link';
        dataWorkSheet[`C${i}`].l = { Target: link };
        dataWorkSheet[`D${i}`].t = 'd';
        dataWorkSheet[`D${i}`].z = 'm/d/yy h:mm AM/PM';
    }
    dataWorkSheet['!autofilter'] = { ref: `A1:E${dataLength}` };

    xlsx.utils.book_append_sheet(WorkBook, dataWorkSheet, 'Movie Data');
    xlsx.writeFile(WorkBook, 'movieData.xlsx');
};

test();
