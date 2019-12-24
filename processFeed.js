const data = require('./postFeed.json');
// const data = JSON.parse(dataJSON);
data.feed.map(ele => {
    // console.log(ele.text.search(/Ad Astra/i))
    if(ele.text.search(/harry potter/i) > 0) {
        console.log(ele.text);
    }
})
// console.log('Here is the data:\n', data.feed);