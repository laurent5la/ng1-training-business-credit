'use strict';

// This is in need of cleanup

var filePath = require('./file-paths');

var fs = require('fs');
var glob = require('glob');
var csv = require('csv');
var path = require('path');
var async = require('async');
var _ = require('lodash');

// local vars for persisting data between async tasks
var translations = {};
var csvReadFile;
var csvMap = {};
var csvData;
var newCSVData;
var fillInCSVFlag;
var untranslatedIdSuffix = '-untranslated';

var csvOptions = {
    delimiter: ',', //Set the field delimiter. One character only
    relax: true,  // Preserve quotes inside unquoted field.
    'skip_empty_lines': true, //Dont generate empty values for empty lines.
    trim: true, //If true, ignore whitespace immediately around the delimiter, defaults to false. Does not remove whitespace in a quoted field.
    quotedString: true,
    quotedEmpty: true
};

function sortObject(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
}

function getRemovedKeys(jsonTranslations, csvTranslations) {
    var removedKeys = [];
    _.forEach(jsonTranslations, function (value, key) {
        if (!csvTranslations[key]) {
            removedKeys.push(key);
        }
    });
    return removedKeys;
}

function getAddedKeys(jsonTranslations, csvTranslations) {
    var addedKeys = [];
    _.forEach(csvTranslations, function (value, key) {
        if (!jsonTranslations[key]) {
            addedKeys.push(key);
        }
    });
    return addedKeys;
}

function removeKeysFromCSVData(removedKeys, csvData) {
    var newCSVData;
    csvData.forEach(function (row, index) {
        if (removedKeys.indexOf(row[0]) > -1) {
            newCSVData = csvData.splice(index, 1);
        }
    });
    return csvData;
}

function addKeysToCSVData(addedKeys, csvData, translations) {
    var rowTemplate = _.clone(csvData[0]);

    addedKeys.forEach(function (key) {
        var newRow = [];
        rowTemplate.forEach(function (value, i) {
            if (fillInCSVFlag) {
                newRow[i] = translations[key];
            }
            else {
                newRow[i] = key + untranslatedIdSuffix;
            }
        });
        newRow[0] = key;
        newRow[1] = translations[key];
        csvData.push(newRow);
    });
    return csvData;
}

function getJSONTranslations(callback) {
    glob('./app/**/lang-en-us.json', function (err, files) {
        if (err) { console.log(err);}
        files.forEach(function (file) {
            translations = sortObject(_.merge(translations, require(path.resolve(file))));
        });
        callback();
    });
}

function readCSV(callback) {
    fs.readFile(filePath.literals.src, 'utf8', function (err, data) {
        if (err) { console.log(err);}
        csvReadFile = data;
        callback();
    });
}

function parseCSV(callback) {
    csv.parse(csvReadFile, csvOptions, function(err, parsedCSV){
        if (err) { console.log(err);}
        csvData = parsedCSV;
        callback();
    });
}

function createCSVMap(callback) {
    csvData.map(function (row, i) {
        if (i > 1) {
            csvMap[row[0]] = row[1];
        }
    });
    csvMap = sortObject(csvMap);
    callback();
}

function updateUntranslatedStringsWithEnglish(callback) {
    if (!fillInCSVFlag) {
        return;
    }
    newCSVData.forEach(function (row) {
        row.forEach(function (value, i) {
            if (fillInCSVFlag && value.indexOf(untranslatedIdSuffix) > -1) {
                row[i] = row[1];
            }
        });
    });
    callback();
}

function synchroniseCSV(callback) {
    var addedKeys = getAddedKeys(csvMap, translations);
    var removedKeys = getRemovedKeys(csvMap, translations);


    newCSVData = addKeysToCSVData(addedKeys, csvData, translations);
    newCSVData = removeKeysFromCSVData(removedKeys, newCSVData);
    callback();
}

function writeNewCSV(callback) {
    newCSVData[0][0] = 'key';    // make sure this does not have hidden unicode characters
    csv.stringify(newCSVData, csvOptions, function(err, newCSV){
        if (err) { console.log(err);}
        fs.writeFile(filePath.literals.src, newCSV, function() {
            if (err) { console.log(err);}
            console.log('The new csv file was saved!');
            callback();
        });
    });
}

function validateLiterals(callback) {
    // need to apply some validation here, but currently any key is a valid key
    callback();
}

function syncCSV(callback) {
    fillInCSVFlag = false;
    async.series([getJSONTranslations, readCSV, parseCSV, createCSVMap, synchroniseCSV, writeNewCSV, function () {
        callback();
    }]);
}

function fillInCSV(callback) {
    fillInCSVFlag = true;
    async.series([getJSONTranslations, readCSV, parseCSV, createCSVMap, synchroniseCSV, updateUntranslatedStringsWithEnglish, writeNewCSV, function () {
        callback();
    }]);
}

function validateCSV(callback) {
    async.series([readCSV, parseCSV, createCSVMap, validateLiterals, function () {
        callback();
    }]);
}

module.exports = {
    syncCSV: syncCSV,
    fillInCSV: fillInCSV,
    validateCSV: validateCSV,
};
