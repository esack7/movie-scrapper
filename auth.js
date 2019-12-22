const { format, addMilliseconds } = require('date-fns');
const cookies = require('./cookies.json');
const current = Date.now();
let reauthorize = false;

cookies.map(cookie => {
    if(cookie.expires === -1) {
        console.log("No expiration")
    } else {
        console.log(format(current, 'MMM yyyy d H:mm:ss'))
        console.log(format(addMilliseconds(current, cookie.expires), 'MMM yyyy d H:mm:ss'))
        console.log(current)
        console.log(addMilliseconds(current, cookie.expires))
        console.log(cookie.expires <= current)
        if (cookie.expires <= current) {
            reauthorize = true;
        }
    }
})