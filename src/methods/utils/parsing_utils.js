export const parseCSV = (content, delim=',') => {
    var rows = content.split("\n");
    let table = [];

    for (var y in rows) {
        var cells = rows[y].split(delim);
        if (cells.length) {
            table.push(cells.map((cell) => ({ value: cell })));
        }
    }

    return table;
}

export const parseXML = (content) => {
    var XMLParser = require("react-xml-parser");
    var xml = new XMLParser().parseFromString(content);
    var newXml = xml.getElementsByTagName("row");
    var header = "";
    var csv = "";

    if (xml.getElementsByTagName("Roww").length !== 0) {
        newXml = xml.getElementsByTagName("Row");
        var fieldName = "";
        var fieldValue = "";
        let inches = /&quot;/gi;
        let ampersand = /&amp;/gi;
        let sendIt = false;
        let inViewItems = false;
        let inViewItem = false;
        let row = "";

        for (const index in newXml) {
            let data = newXml[index].children[0].children[0].value;

            fieldName = data.replace(/(^.*\&lt;|&gt;.*$)/g, "");
            fieldName = fieldName.replace("/", "");

            let string1 = "&lt;" + fieldName + "&gt;";
            let string2 = "&lt;/" + fieldName + "&gt;";

            if (fieldName === "ViewItem" && sendIt === true) break;

            if (!!sendIt) {
                header += fieldName + "\t";
            }

            if (fieldName === "ViewItem" && sendIt === false) sendIt = true;
        }
        csv += header + "AssemblyQuantity" + "\n";

        for (const index in newXml) {
            let data = newXml[index].children[0].children[0].value;

            fieldName = data.replace(/(^.*\&lt;|&gt;.*$)/g, "");
            fieldName = fieldName.replace("/", "");

            let string1 = "&lt;" + fieldName + "&gt;";
            let string2 = "&lt;/" + fieldName + "&gt;";

            fieldValue = data.replace(string1, "");
            fieldValue = fieldValue.replace(string2, "");
            fieldValue = fieldValue.replace(inches, '"');
            fieldValue = fieldValue.replace(ampersand, "&");

            if (fieldName === "ViewItems" && inViewItems === true) break;
            if (fieldName === "ViewItems" && inViewItems === false) {
                inViewItems = true;
            }

            if (!!inViewItem && !!inViewItems) {
                if (fieldName === "ViewItem") {
                    csv += row + "1" + "\n";
                    row = "";
                } else {
                    row += fieldValue + "\t";
                }
            }
            if (fieldName === "ViewItem") {
                inViewItem = !inViewItem;
            }
        }
        csv = csv.replace(/^\s+|\s+$/g, ""); //get rid of trailing spaces
    } else if (xml.getElementsByTagName("row").length !== 0) {
        console.log(xml.getElementsByTagName("row").length);
        newXml[0].children.forEach((attribute, index, array) => {
            header += attribute.name + "\t";
        });

        csv += header + "\n";

        newXml.forEach((lot, index, array) => {
            var row = "";
            lot.children.forEach((child, index, array) => {
                row += child.value + "\t";
            });
            if (index === array.length - 1) {
                csv += row;
            } else {
                csv += row + "\n";
            }
        });
    } else if (xml.getElementsByTagName("ViewItem").length !== 0) {
        var newXml = xml.getElementsByTagName("ViewItem");
        newXml[0].children.forEach((attribute, index, array) => {
            header += attribute.name + "\t";
        });

        //   csv += header + '\n'

        newXml.forEach((lot, index, array) => {
            var row = "";
            lot.children.forEach((child, index, array) => {
                row += child.value + "\t";
            });
            if (index === array.length - 1) {
                csv += row + "1";
            } else {
                csv += row + "\n";
            }
        });
    }

    console.log("!!", csv);

    var rows = csv.split("\n");
    let table = [];

    for (var y in rows) {
        var cells = rows[y].split("\t");
        if (cells.length) {
            table.push(cells.map((cell) => ({ value: cell })));
        }
    }

    return table;
};
