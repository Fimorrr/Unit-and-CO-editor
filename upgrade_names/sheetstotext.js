function getRowText(row, langKey) {
    let nameProp = "";

    for (let key in row) {
        if (nameProp == "") {
            nameProp = key;
            break;
        }
    }

    if (row[nameProp].includes("//")) {
        return row[nameProp] + "\n";
    }

    if (!row[langKey]) {
        return "";
    }

    return row[nameProp] + "=" + row[langKey] + "\n";
    //return row[langKey] + "\n";
}

function getLangKeys(row) {
    let keys = [];
    let index = 0;

    for (let key in row) {
        if (index > 0) {
            keys.push(key);
        }

        index++;
    }

    return keys;
}

function initLangTexts(langKeys) {
    let langTexts = {};

    langKeys.forEach((langKey) => {
        langTexts[langKey] = "";
    });

    return langTexts;
}

let fs = require('fs');
const PublicGoogleSheetsParser = require('public-google-sheets-parser');
const parser = new PublicGoogleSheetsParser();

let spreadsheetIDs = [
    "1DSEB6FD2t3hj0KB7zs9GPVCmZFTt2FRgGq5FpylEs34",
    "1AZXP32r5bzz-271epw_gaeQpnATeAK1FmzncGAlUrno"
];

let sheetIDs = [
    [
        "0",
        "2023378533",
        "939974803",
        "1627763192",
        "556119218"
    ],
    [
        "0",
        "1092236439"
    ]
];

let langKeys = [];
let langTexts = {};
let aPromise = [];

spreadsheetIDs.forEach((spreadsheetID, index) => {
    sheetIDs[index].forEach((sheetID) => {
        aPromise.push(new Promise((resolve) => {
            parser.parse(spreadsheetID, { sheetId: sheetID }).then((rows) => {
                rows.forEach(row => {
                    if (langKeys.length == 0) {
                        langKeys = getLangKeys(row);
                        langTexts = initLangTexts(langKeys);
                    }

                    langKeys.forEach((langKey) => {
                        langTexts[langKey] += getRowText(row, langKey);
                    })
                });

                console.log("Read: " + sheetID + " OK");
                resolve();
            });
        }));
    });
});

Promise.all(aPromise).then(() => {
    for (let key in langTexts) {
        let filePath = "upgrade_names/csvtext_" + key.toLowerCase() + ".txt";
        fs.writeFileSync(filePath, langTexts[key]);

        console.log("Write " + key + ": OK");
    }
});
