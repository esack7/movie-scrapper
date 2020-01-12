const data = require("./postFeedArray.json");
const searchTerm = 'avatar';
const searchRegex = new RegExp(searchTerm, 'i');
data.map(post => {
  post.feed.map(ele => {
    ele.text.split("\n").map(line => {
      if (!!line.match(searchRegex)) {
        console.log(line);
      }
    });
  });
});
