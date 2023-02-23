let fs = require('fs');

function splitCSV(csvRow) {
    let rowDividers = [];
    let insideQuote = false;
    rowDividers.push(-1);
    for (let j=0; j<csvRow.length; j++) {
        let char = csvRow.charAt(j);
        if (char == ',' && !insideQuote) {
            rowDividers.push(j);
        }
        else if (char == '"') {
            if (!insideQuote) {
                insideQuote = true;
            }
            else {
                insideQuote = false;
            }
        }
    }
    rowDividers.push(csvRow.length);

    let csvColumns = [];
    for (let j=1; j<rowDividers.length; j++) {
        let csvColumn = csvRow.substring(rowDividers[j-1] + 1, rowDividers[j]);
        if (csvColumn.charAt(0) === csvColumn.charAt(csvColumn.length - 1) && (csvColumn.charAt(0) === "'" || csvColumn.charAt(0) === '"')) {
            csvColumn = csvColumn.substring(1, csvColumn.length - 1);
        }
        csvColumns.push(csvColumn);
    }

    return csvColumns;
}

function csvToText(csvName) {
    let csvText = fs.readFileSync(csvName, 'utf8');
    let csvRows = csvText.split("\n");

    let firstRow = csvRows[0].split(",");
    firstRow.splice(0, 1);

    let textDictionary = {};
    console.log(csvName);
    firstRow.forEach((lang, langIndex) => {
        let text = "";

        if (lang.replace("\r", "") === "Тип" || lang.replace("\r", "") === "Note") {
            return;
        }

        csvRows.forEach((row, index) => {
            if (index === 0) {
                return;
            }

            let columns = splitCSV(row);
            text += columns[0] + "=" + columns[langIndex + 1] + "\n";
        });

        textDictionary[lang.replace("\r", "")] = text;

        console.log("Write: " + lang);
    });

    return textDictionary;
}

let textArray = [];

textArray.push(csvToText("upgrade_names/upg_names.csv"));
textArray.push(csvToText("upgrade_names/upg_description.csv"));
textArray.push(csvToText("upgrade_names/missions.csv"));
textArray.push(csvToText("upgrade_names/units.csv"));

for (let key in textArray[0]) {
    let finalText = "";

    for (let i=0; i<textArray.length; i++) {
        finalText += textArray[i][key];
    }

    let filePath = "upgrade_names/csvtext_" + key.toLowerCase() + ".txt";
    fs.writeFileSync(filePath, finalText);
}