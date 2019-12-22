const data = require('./postFeed.json');
// const data = JSON.parse(dataJSON);
data.feed.map(ele => {
    console.log(ele.text)
})
// console.log('Here is the data:\n', data.feed);