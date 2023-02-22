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
        if (csvColumn.charAt(0) === csvColumn.charAt(csvColumn.length - 1)) {
            csvColumn = csvColumn.substring(1, csvColumn.length - 1);
        }
        csvColumns.push(csvColumn);
    }

    return csvColumns;
}

function csvToText(csvName, textName) {
    let fs = require('fs');
    let csvText = fs.readFileSync(csvName, 'utf8');
    let csvRows = csvText.split("\n");

    let firstRow = csvRows[0].split(",");
    firstRow.splice(0, 1);

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

        let filePath = textName + "_" + lang.replace("\r", "").toLowerCase() + ".txt";
        fs.writeFileSync(filePath, text);
        console.log("Write: " + lang);
    });
}

csvToText("upgrade_names/names.csv", "upgrade_names/upgrades");
csvToText("upgrade_names/description.csv", "upgrade_names/upgr_decription");
csvToText("upgrade_names/missions.csv", "upgrade_names/missions");