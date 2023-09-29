// ==UserScript==
// @name         Wikipedia Table to CSV
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extract tables from Wikipedia and save as CSV
// @author       Yofardev
// @match        *://*.wikipedia.org/wiki/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to download data to a file
    function download(data, filename, type) {
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    // Get all tables
    let tables = document.getElementsByTagName('table');

    // Iterate over tables
    for (let table of tables) {
        // Create download button
        let button = document.createElement('button');
        button.innerText = 'Download as CSV';
        button.onclick = function() {
            let csv = '';

            // Iterate over rows
            for (let row of table.rows) {
                let cells = Array.from(row.cells);
                csv += cells.map(cell => {
                    // Check if cell contains an image
                    let img = cell.querySelector('img');
                    if (img) {
                        // If so, return the image URL
                        return '"' + img.src.replace(/"/g, '""') + '"';
                    } else {
                        // Otherwise, return the cell text
                        return '"' + cell.innerText.replace(/"/g, '""') + '"';
                    }
                }).join(',') + '\n';
            }

            // Download the data
            download(csv, 'data.csv', 'text/csv');
        };

        // Add download button to the page
        table.parentNode.insertBefore(button, table);
    }
})();
