const { getTime, differenceInMinutes, differenceInHours } = require('date-fns');
const data = require("./postFeedArray.json");
require('dotenv').config();

const loginURL = process.env.LOGINURL;
const groupURL = process.env.GROUPURL;

const searchTerm = 'back to the future';
const searchRegex = new RegExp(searchTerm, 'i');
const now = getTime(new Date());
data.map(post => {
  post.feed.map(ele => {
    ele.text.split("\n").map(line => {
      if (!!line.match(searchRegex)) {
        const hours = differenceInHours(now, ele.createdAt * 1000);
        const minutes = differenceInMinutes(now, ele.createdAt * 1000);
        console.log(line);
        console.log(`${hours} hours ${minutes - (hours * 60)} minutes old`);
        console.log(`${loginURL}${groupURL}/profile/${ele.userId}
        `)
      }
    });
  });
});
