const { getTime, differenceInMinutes, differenceInHours } = require('date-fns');
const data = require("./postFeedArray.json");
require('dotenv').config();

const loginURL = process.env.LOGINURL;
const groupURL = process.env.GROUPURL;

const searchTerm = 'ad astra';
const searchRegex = new RegExp(searchTerm, 'i');
const now = getTime(new Date());
data.map(post => {
  post.feed.map(ele => {
    const diffHours = differenceInHours(now, ele.createdAt * 1000);
    const diffMinutes = differenceInMinutes(now, ele.createdAt * 1000);
    ele.text.split("\n").map(line => {
      if (!!line.match(searchRegex)) {
        console.log(line);
        console.log(`${diffHours} hours ${diffMinutes - (diffHours * 60)} minutes old`);
        console.log(`${loginURL}${groupURL}/profile/${ele.userId}
        `)
      }
    });
  });
});
