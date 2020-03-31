const readline = require('readline');
const { initializeDb } = require('./database.js');
const { fileExists, readJSONFile, deleteCookies, readInput } = require('./utils.js');
const scrapeData = require('./scrapeData.js');
const auth = require('./auth.js');
const processFeed = require('./processFeed.js');

const lineReader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function main() {
    const cookiesPath = './cookies.json';
    const cookieExist = await fileExists(cookiesPath);
    const dbExists = await fileExists('./MovieData.db');

    if (!dbExists) {
        await initializeDb();
    }

    if (!cookieExist) {
        await auth();
        main();
    } else {
        try {
            const cookies = await readJSONFile(cookiesPath);
            let input = '';
            let csrfToken;
            let cookieString = '';

            cookies.map(ele => {
                if (ele.name === 'csrf-token') {
                    csrfToken = ele.value;
                }
                cookieString += `${ele.name}=${ele.value};`;
                return null;
            });

            while (input.toLowerCase() !== 'q') {
                process.stdout.write(
                    '\nWhat do you want to do?:\n(s - search, r - scrape data, l - log out, q - quit)\n'
                );
                input = await readInput(lineReader);
                if (input === 's') {
                    process.stdout.write('What do you want to search for?\n');
                    const searchTerm = await readInput(lineReader);
                    await processFeed(searchTerm);
                }
                if (input === 'r') {
                    await scrapeData(csrfToken, cookieString);
                }
                if (input === 'l') {
                    await deleteCookies(cookiesPath, 'cookies.json');
                }
            }
            process.exit();
        } catch (error) {
            console.error('Error in Index:\n', error);
        }
    }
    return null;
}

main();
