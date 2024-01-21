Movie Scrapper

What is required

- NPM and Node.js v10.5.0
- .env file:

```
DOMAINURL='https://domain.com'
GROUP='group number'
COOKIES_STRINGIFIED='stingified cookies'
COOKIE_STRING='Cookie string in request'
```

To get the COOKIES_STRINGIFIED, log into your account and open the Developer Tools Console and paste the following javascript code:

```javascript
async function getCookies() {
  const cookies = await window.cookieStore.getAll();
  return JSON.stringify(cookies);
}

await getCookies();
```

Copy the resulting string and save it to COOKIES_STRINGIFIED in the .env file.

To get the COOKIE_STRING, log into your account and navigate to the group page, open Developer Tools, under the Network tab, inspect the request for the 'postfeed' and select the headers tab and copy the cookie string under Request Headers. Past this string and save it to COOKIE_STRING in the .env file.
