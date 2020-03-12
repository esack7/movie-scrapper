const xlsx = require('xlsx');
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
        item.Link = `${domainURL}${groupURL}/profile/${item.userId}`;
        item.Date = item.createdAt;
        delete item.text;
        delete item.cost;
        delete item.postItemId;
        delete item.userId;
        delete item.createdAt;
        delete item.updatedAt;
        delete item.editedAt;
        return item;
    });
    const dataWorkSheet = xlsx.utils.json_to_sheet(newFeedData, { cellDates: true });

    for (let i = 2; i <= dataLength; i++) {
        dataWorkSheet[`D${i}`].t = 'd';
    }

    const userWorkSheet = xlsx.utils.json_to_sheet(dataJSON.users);

    xlsx.utils.book_append_sheet(WorkBook, dataWorkSheet, 'Movie Data');
    xlsx.utils.book_append_sheet(WorkBook, userWorkSheet, 'User Data');
    xlsx.writeFile(WorkBook, 'movieData.xlsx');
};

test();
