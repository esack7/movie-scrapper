const xlsx = require('xlsx');
const { readJSONFile } = require('./utils.js');

const test = async () => {
    const dataJSON = await readJSONFile('./postFeedData.json');
    const WorkBook = xlsx.utils.book_new();
    const dataWorkSheet = xlsx.utils.json_to_sheet(dataJSON.feed, { cellDates: true });
    const userWorkSheet = xlsx.utils.json_to_sheet(dataJSON.users);

    xlsx.utils.book_append_sheet(WorkBook, dataWorkSheet, 'Movie Data');
    xlsx.utils.book_append_sheet(WorkBook, userWorkSheet, 'User Data');
    xlsx.writeFile(WorkBook, 'movieData.xlsx');
};

test();
