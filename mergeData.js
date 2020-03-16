module.exports = (priorData, data) =>
    new Promise((resolve, reject) => {
        // console.log('Need to implement "MERGE"!');
        try {
            const newDataObj = {
                users: priorData.users,
                postItems: {},
                feed: [],
                time: data.time,
            };

            resolve(newDataObj);
        } catch (err) {
            reject(err);
        }
    });
