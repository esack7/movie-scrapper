// const dateFNS = require('date-fns');
const data = require("./postFeedArray.json");
const searchTerm = 'ad astra';
const searchRegex = new RegExp(searchTerm, 'i');
const now = 
data.map(post => {
  post.feed.map(ele => {
    ele.text.split("\n").map(line => {
      if (!!line.match(searchRegex)) {
        console.log(line);
        console.log(`https://mewe.com/group/5bbeb0304809905cc2eb7ac3/profile/${ele.userId}
        `)
      }
    });
  });
});
