const { getTime, differenceInMinutes, differenceInHours } = require('date-fns');
const data = require("./postFeedArray.json");
require('dotenv').config();
const searchTermArray = process.argv;
const loginURL = process.env.LOGINURL;
const groupURL = process.env.GROUPURL;

let searchTerm = '';
for(let i = 2; i < searchTermArray.length; i++) {
  searchTerm = `${searchTerm} ${searchTermArray[i]}`
  searchTerm = searchTerm.trim();
}

const searchRegex = new RegExp(searchTerm, 'i');
const now = getTime(new Date());
data.map(post => {
  post.feed.map(ele => {
    const diffHours = differenceInHours(now, ele.createdAt * 1000);
    const diffMinutes = differenceInMinutes(now, ele.createdAt * 1000);
    ele.text.split("\n").map(line => {
      if (!!line.match(searchRegex)) {
        console.log(line);
        console.log(`Posted ${diffHours} hours ${diffMinutes - (diffHours * 60)} minutes ago`);
        console.log(`${loginURL}${groupURL}/profile/${ele.userId}
        `)
      }
    });
  });
});
