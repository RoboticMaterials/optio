export const parseCSV = (content, strDelimiter=',') => {

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );  

    var table = [[]]; // Table array with empty first row
    var arrMatches = null; // Array to hold individual pattern matching groups

    // Keep looping over the regular expression matches until we can no longer find a match.
    while (arrMatches = objPattern.exec( content )){
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
            // Since we have reached a new row of data, add an empty row to our data array.
            table.push( [] );
        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way, let's check to see which kind of value we captured (quoted or unquoted).
        if (arrMatches[2]){
            // We found a quoted value. When we capture this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(new RegExp( "\"\"", "g" ), "\"" );

        } else {
            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }

        // Now that we have our value string, let's add it to the data array.
        table[table.length - 1].push( {value: strMatchedValue} );
    }

    // Return the parsed data.
    console.log(table)
    return( table );
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
        //console.log(xml.getElementsByTagName("row").length);
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

           csv += header + '\n'

        newXml.forEach((lot, index, array) => {
            let workOrderNumber = lot.children.find((att => att.name === 'WorkOrderNumber'))
            if(workOrderNumber.value.includes(' 1of')){
            var row = "";
            lot.children.forEach((child, index, array) => {
                row += child.value + "\t";
            });

            csv += row + "\n";
          }
        });

    }

    //console.log("!!", csv);

    var rows = csv.split("\n");
    let table = [];

    for (var y in rows) {
        var cells = rows[y].split("\t");
        if (cells.length>1) {
            table.push(cells.map((cell) => ({ value: cell })));
        }
    }

    return table;
};
