const mergeData = require('../mergeData');

const oldData = require(`../postFeedDataOld.json`);
const newData = require(`../postFeedDataNew.json`);

async function Test() {
    const result = await mergeData(oldData, newData);
    console.log(result);
}

Test();
