export default function (priorData: object, data: object): Promise<Object> {
    return new Promise((resolve, reject) => {
        console.log('Need to implement "MERGE"!');
        try {
            resolve(data);
        } catch (err) {
            reject(err);
        }
    });
}
