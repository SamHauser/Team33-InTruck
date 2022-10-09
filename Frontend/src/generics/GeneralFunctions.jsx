import { apiGetCall } from "./APIFunctions";
import { COLOURS } from "../config";

//Used to sort an array of classes
function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {

        if (key.includes('[') || key.includes('.')) {
            a = getSubValue(a, { name: key });
            b = getSubValue(b, { name: key });

            //Format A
            if (Array.isArray(a)) {//If object is an array
                if (a.length > 0) {
                    var varA = a[0].toString();
                    for (let i = 1; i < a.length; i++) {//Add all values to a string
                        varA += `, ${a[i]}`;
                    }
                } else {
                    varA = "";
                }
            } else if (a === null) {
                varA = "";
            } else {
                varA = a;
            }

            //Format B
            if (Array.isArray(b)) {
                if (b.length > 0) {
                    var varB = b[0].toString();
                    for (let i = 1; i < b.length; i++) {
                        varB += `, ${b[i]}`;
                    }
                } else {
                    varB = "";
                }
            } else if (b === null) {
                varB = "";
            } else {
                varB = b;
            }

            if (typeof varA === 'string') {
                varA = varA.toUpperCase();
            }
            if (typeof varB === 'string') {
                varB = varB.toUpperCase();
            }

            const letters = /^[A-Za-z]+$/;
            if (!varA.includes(',') && !varB.includes(',')) {
                if (!varA.match(letters) && !varB.match(letters)) {//If both a and b are single numbers, interepret them as a number not a string
                    varA = Number(varA);
                    varB = Number(varB);
                }
            }
        } else {


            varA = (typeof a[key] === 'string')
                ? a[key].toUpperCase() : a[key];
            varB = (typeof b[key] === 'string')
                ? b[key].toUpperCase() : b[key];
        }


        let comparison = 0;
        if (isEmpty(varA)) {
            comparison = -1;
        } else if (isEmpty(varB)) {
            comparison = 1;
        } else if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }

        return (
            (order === 'desc') ? (comparison * -1) : comparison
        );
    };
}

//Used to sort an array of classes by Date strings, expecting format dd/mm/yyyy
function compareValuesDateStr(key, order = 'asc') {
    return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
        }

        var varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
        var varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];

        let comparison = 0;

        if (isEmpty(varA)) {
            comparison = -1;
        } else if (isEmpty(varB)) {
            comparison = 1;
        } else {


            varA = varA.split(" ");
            varB = varB.split(" ");
            //Find the part of the string that includes the date
            for (let i in varA) {
                if (varA[i].includes("/")) {
                    varA = varA[i];
                    varB = varB[i];
                    break;
                }
            }
            varA = varA.split("/");
            varB = varB.split("/");
            for (let i in varA) {
                varA[i] = Number(varA[i]);
                varB[i] = Number(varB[i]);
            }

            if (varA[2] > varB[2]) {//Compare years
                comparison = 1;
            } else if (varA[2] < varB[2]) {
                comparison = -1;
            } else {//Years are the same, compare months
                if (varA[1] > varB[1]) {
                    comparison = 1;
                } else if (varA[1] < varB[1]) {
                    comparison = -1;
                } else {//Month is the same, compare date
                    if (varA[0] > varB[0]) {
                        comparison = 1;
                    } else if (varA[0] < varB[0]) {
                        comparison = -1;
                    }
                }
            }
        }
        return (
            (order === 'desc') ? (comparison * -1) : comparison
        );
    };
}

//Splits a camelCased string from "camelCaseString" in "camel Case String"
function splitCamel(string) {
    return string.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
}

function copyArrByValue(originalArr) {
    var newArr = [];
    for (var i = 0; i < originalArr.length; i++) {
        newArr[i] = {}; // empty object to hold properties added below
        for (var prop in originalArr[i]) {
            newArr[i][prop] = originalArr[i][prop]; // copy properties from originalArr to newArr
        }
    }

    return newArr;
}

function sortByFrequencyAndRemoveDuplicates(array) {
    var frequency = {}, value;

    // compute frequencies of each value
    for (var i = 0; i < array.length; i++) {
        value = array[i];
        if (value in frequency) {
            frequency[value]++;
        }
        else {
            frequency[value] = 1;
        }
    }

    // make array from the frequency object to de-duplicate
    var uniques = [];
    for (value in frequency) {
        uniques.push(value);
    }

    // sort the uniques array in descending order by frequency
    function compareFrequency(a, b) {
        return frequency[b] - frequency[a];
    }

    return uniques.sort(compareFrequency);
}

//Removes any duplicates in an array of objects based on a specified field
function UniqateObjArray(array, field) {
    var newArr = [], uniqueVals = [];
    for (let i in array) {

        let found = false;
        for (let j in uniqueVals) {
            if (uniqueVals[j] === array[i][field]) {
                found = true;
                break;
            }
        }

        if (!found) {
            newArr.push(array[i]);
            uniqueVals.push(array[i][field]);
        }
    }

    return newArr;
}

//Removes any duplicates in an array
function UniqateArray(array) {
    let uniqueVals = []
    for (let i in array) {
        if (uniqueVals.includes(array[i])) { continue; }
        uniqueVals.push(array[i]);
    }

    return uniqueVals;
}

//Removes a row from an array by the field value, returns the new array
function RemoveByField(array, field, value) {
    for (let i in array) {
        if (array[i][field] === value) {
            array.splice(i, 1);
            break;//Only removes the first instance
        }
    }

    return array;
}

function formatTime(d) {//Gets just the time form a DateStr
    return d.substr(11, 5);
}

function formatDatefromStr(d) {// Gets just the date from a DateStr

    if (d === null || d === "") {
        return null;
    }

    //If D/M/YYYY only take 8
    if (d[1] === "/" && d[3] === "/") {
        var length = 8;
    } else {
        length = 10;
    }
    return d.substr(0, length);
}

function formatDateFromDate(d, addMonth) {//Returns dd/mm/yyyy from Date()
    let month = d.getMonth() + 1;
    if (addMonth) {
        month++;
    }
    let date = `${d.getDate()}/${month}/${d.getFullYear()}`;
    date = formatDateToLength(date);
    return date;
}

function formatTimeFromDate(d, showSeconds, twelveHours) {//Returns hh:mm(optional ss) from Date()
    let hours = d.getHours();
    let minutes = d.getMinutes();
    let seconds = d.getSeconds();
    let time = "";

    if (twelveHours && hours > 12) {
        hours -= 12
    }

    //Make sure to always show 8 characters in hh:mm:ss
    if (hours < 10) {
        hours = `0${hours}`;
    }
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    time = `${hours}:${minutes}`;
    if (showSeconds) {
        time += `:${seconds}`;
    }


    return time;
}

function formatDateAndTimeFromDate(d, addMonth, showSeconds, twelveHours) {//Returns dd/mm/yy hh:mm:ss from Date()
    let date = formatDateFromDate(d, addMonth);
    let time = formatTimeFromDate(d, showSeconds, twelveHours);

    return `${date} ${time}`;
}

function formatDateStrFromDate(d) {//    Date() to DD/MM/YYYY HH:MM:SS Z
    d = new Date(d);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    let hours = d.getHours();
    const min = d.getMinutes();
    const sec = d.getSeconds();
    let zone = "AM";

    if (hours >= 12) {
        zone = "PM";
        hours -= 12;
    }

    const result = `${day}/${month}/${year} ${hours}:${min}:${sec} ${zone}`;
    return result;
}

function formatDateToLength(d) {//Assures full date
    d = d.split('/');
    for (let i in d) {
        if (d[i].length === 1) {
            d[i] = `0${d[i]}`;
        }
    }
    d = `${d[0]}/${d[1]}/${d[2]}`;
    return d;
}

function addDays(d, amount) {
    d = d.split('/');
    d[0] = Number(d[0]) + amount;//Add the amount of days
    let newDate = new Date(d[2], d[1], d[0]);//Create a new date based on that new number
    newDate = formatDateFromDate(newDate);//Format as dd/mm/yyyy

    return newDate;
}

function reverseDate(d, mdy) {//     YYYY/MM/DD <--> DD/MM/YYYY  or   DD/MM/YYYY <-->  MM/DD/YYYY
    d = d.split('/');
    if (mdy) {
        d = `${d[1]}/${d[0]}/${d[2]}`;
    } else {//YMD
        d = `${d[2]}/${d[1]}/${d[0]}`;
    }
    return d;
}

function formatDateToMDY(d) {//DD/MM/YYY to MM/DD/YYYY
    d = formatDatefromStr(d);
    d = d.split('-');
    d = `${d[2]}/${d[1]}/${d[0]}`;
    return d;
}

function formatAMPMdatetimeFromDate(d) {
    const AM = d.getHours() < 12
    d = formatDateAndTimeFromDate(d, 0, false, true)
    if (AM) {
        d += " AM"
    } else {
        d += " PM"
    }
    return d

}

function formatISOFromDate(d) {//Date() to YYYY-MM-DDTHH:MM:SSZ
    d = new Date(d);
    let day = d.getDate().toString();
    let month = (d.getMonth() + 1).toString();
    const year = d.getFullYear();
    let hours = d.getHours().toString();
    let min = d.getMinutes().toString();
    let sec = d.getSeconds().toString();

    //Make sure everything is the correct length
    if (day.length < 2) {
        day = "0" + day;
    }
    if (month.length < 2) {
        month = "0" + month;
    }
    if (hours.length < 2) {
        hours = "0" + hours;
    }
    if (min.length < 2) {
        min = "0" + min;
    }
    if (sec.length < 2) {
        sec = "0" + sec;
    }

    const result = `${year}-${month}-${day}T${hours}:${min}:${sec}Z`;
    return result;
}

function formatMaterialUIFromDate(d) {//Date() to YYYY-MM-DD, this is the format that Material UI accepts in their Text Fields
    if (d === null || d === "") {
        return "1970-01-01";
    }

    d = formatISOFromDate(d);//Format Date() to YYYY-MM-DDTHH:MM:SSZ

    d = d.substring(0, d.indexOf("T"));//Only use YYYY-MM-DD

    //Assure full date (YYYY-MM-DD not YYYY-M-D)
    d = d.split("-");
    for (let i in d) {
        if (d[i].length < 2) {
            d[i] = `0${d[i]}`;
        }
    }

    d = `${d[0]}-${d[1]}-${d[2]}`;
    return d;
}

function formatDateFromTime(t, type) {//Create a date from a given "HH:mm" or "mm:ss" time
    let d = new Date()
    if (type === "mm:ss") {
        t = "00:" + t
    }

    d = `${d.getDay()}/${d.getMonth()}/${d.getFullYear()} ${t}`
    return d
}


//Current data value, array of options, true if the option should be evaluated from the value, else it is evaluated from the label
function formatSelect(data, arr, reverse) {
    if (data === null || data === "" || data === undefined || arr.length === 0) {
        data = { label: "None Selected", value: "" };
        return data;
    }

    let found = false;
    if (data.value) {
        data = data.value;
    }

    for (let i in arr) {
        if (reverse) {//If the value is given but the label is needed to display
            if (arr[i].value === data) {
                found = true;
                data = { value: data, label: arr[i].label };
                break;
            }
        } else {//If the label is given to display but the value is needed
            if (arr[i].label === data) {
                found = true;
                data = { value: arr[i].value, label: data };
                break;
            }
        }
    }

    //If the current value doesn't match any given values
    if (!found) {
        data = { label: "None Selected", value: "" };
    }

    return data;
}

//Converts the string value into the object value defined by the API list of values
function formatLookup(curVal, fieldname, url, dataFormat, isselByValue, isMultival, callback) {
    if (url === "") { return; }
    const objify = (value, label) => {//Create a {value, label} object
        return { value: value, label: label };
    }

    let finalVal = isMultival ? [objify("", "")] : objify("", "");


    const error = e => {
        throw new Error(e);
    }


    const callback1 = data => {
        if (isMultival) {
            const curValArr = curVal.split(",");

            for (let j in curVal) {//For every value in the original string
                for (let i in data) {//For every row in the API data
                    if (isselByValue) {
                        if (data[i][dataFormat.descField.name] === curVal[j]) {
                            // {value: codeField, label: descField}
                            curValArr[j] = objify(data[i][dataFormat.codeField.name], data[i][dataFormat.descField.name]);
                            break;
                        }
                    } else {
                        if (data[i][dataFormat.codeField.name] === curVal[j]) {
                            // {value: codeField, label: descField}
                            curValArr[j] = objify(data[i][dataFormat.codeField.name], data[i][dataFormat.descField.name]);
                            break;
                        }
                    }
                }
            }

            callback(curValArr, fieldname);
        } else {//Just a single value
            curVal = curVal.toString();
            for (let i in data) {//For every row in the API data
                if (!isselByValue) {
                    //If this columns value matches the current obj value to be replaced
                    if (data[i][dataFormat.descField.name].toString() === curVal) {
                        // {value: codeField, label: descField}
                        finalVal = objify(data[i][dataFormat.codeField.name], data[i][dataFormat.descField.name]);
                        break;
                    }
                } else {
                    if (data[i][dataFormat.codeField.name].toString() === curVal) {
                        // {value: codeField, label: descField}
                        finalVal = objify(data[i][dataFormat.codeField.name], data[i][dataFormat.descField.name]);
                        break;
                    }
                }
            }

            callback(finalVal, fieldname);
        }
    }

    apiGetCall(url, callback1, error, true);
}

//Convert a list of data into a list of options for a select field
function formatOptions(data, labelField, valueField) {
    for (let i in data) {
        data[i] = {
            label: data[i][labelField],
            value: data[i][valueField]
        };
    }

    return data;
}


function getHistory() {
    const history = JSON.parse(sessionStorage.getItem("history"));

    return history;
}

function setHistory(history) {
    sessionStorage.setItem("history", JSON.stringify(history));
}

/*Returns a sub value of an object    e.g.   Engineers[0].EngineerNo returns 5
    oldRow - the object the data is fetched from
    col - use if using col.name
    fieldname - use if not using col.name
*/
function getSubValue(oldRow, col, fieldname) {
    const row = JSON.parse(JSON.stringify(oldRow));//Removes any references to the state
    const field = fieldname ? fieldname : col.name;
    let first = true;
    var val = "";

    if (!field) { return "" }

    if (field.includes('[') || field.includes('.')) {//If this is a sub property/array
        const subNames = field.split('.');
        for (let i in subNames) {
            let subName = subNames[i];
            if (subName.includes('[')) {//If grabbing an array element
                const start = subName.indexOf('[');
                const end = subName.indexOf(']');
                const index = Number(subName.substr(start + 1, end - 1 - start));//Index of the array is between the []
                subName = subName.substr(0, start);//Set the subname to just the array name without the index
                if (first) {//Get value from the row
                    val = row[subName][index];
                    first = false;
                } else {//Get value from the altered row
                    if (Array.isArray(val)) {
                        for (let j in val) {
                            val[j] = val[j][subName][index];
                        }
                    } else {
                        val = val[subName][index];
                    }
                }
            } else {
                if (first) {//Get value from the row
                    val = row[subName];
                    first = false;
                } else {//Get value from the altered row
                    if (Array.isArray(val)) {
                        for (let j in val) {
                            if (val[j]) {
                                val[j] = val[j][subName];
                            }
                        }
                    } else {
                        val = val[subName];
                    }
                }
            }
            if (!val) {
                break;
            }
        }
    }
    else {
        val = row[field];
    }

    return val;
}

//Sets the subfield value of an object
function setSubValue(obj, fieldname, newVal) {
    if (!fieldname.includes(".")) {//No subvalues left to find
        obj[fieldname] = newVal;//Set the value of the final sub field

        return obj;
    } else {//Search for the subfield through a child field
        const childFieldname = fieldname.substr(0, fieldname.indexOf("."));//Name of the next requested child field
        const restFieldname = fieldname.substr(fieldname.indexOf(".") + 1, fieldname.length - fieldname.indexOf(".") - 1);//Rest of the fieldname not yet used

        obj[childFieldname] = setSubValue(obj[childFieldname], restFieldname, newVal);//Recursively search in the child field for the requested field

        return obj;//Final value has been set. Return the parent object
    }
}


function getRandomColour() {//Returns a random colour as a hex value, Credit: Paolo Forgia; Stack Overflow
    //Get one of the main colours
    var colour = null;
    switch (Math.floor(Math.random() * 3)) {
        case 0:
            colour = COLOURS[0];
            break;
        case 1:
            colour = COLOURS[1];
            break;
        case 2:
            colour = localStorage.getItem("tertiaryColour");
            break;
        default:
            colour = COLOURS[0];
            break;
    }
    colour = hexToRGBA(colour, 1);
    colour = colour.substr(5, colour.length - 6).split(",");//Remove the rgb( and )
    const multiplier = 40;

    //Randomly add or subtract anywhere from 0 to the multiplier to each RGB
    for (let i in colour) {
        colour[i] = Number(colour[i]);

        //Randomly either add or subtract
        let direction = 1;
        if (Math.random() < 0.5) {
            direction = -1;
        }

        colour[i] += direction * multiplier * Math.random();
        if (colour[i] < 0) {
            colour[i] = 0;
        } else if (colour[i] > 255) {
            colour[i] = 255;
        }

        colour[i] = Math.round(colour[i]);
    }
    colour = `rgba(${colour[0]},${colour[1]},${colour[2]},1)`;
    colour = RGBAToHex(colour);
    return colour;
}

function RGBAToHex(colour) {
    colour = colour.substr(5, colour.length - 6).split(",");//Split into R,G and B
    for (let i = 0; i < 3; i++) {
        colour[i] = Number(colour[i]);
        colour[i] = colour[i].toString(16);

        if (colour[i].length === 1) {//This is in format 'a', needs to be '0a'
            colour[i] = `0${colour[i]}`;
        }
    }
    colour = `#${colour[0]}${colour[1]}${colour[2]}`;

    return colour;
}

function hexToRGBA(hex, alpha) {//Converts a hex colour into rgba, Credit: Kennebec; Stack Overflow
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
    }
    throw new Error('Bad Hex');
}

//Returns {background, foreground}
function stringToColorCode(str) {
    let sum = 0;
    let foreground = "#ffffff";

    const hexToInt = hex => {
        hex = "0x" + hex;
        return parseInt(hex, 10);
    }


    for (let i in str) {
        sum += str.charCodeAt(i) * i;
    }

    sum *= sum * sum;
    sum /= 2.8;
    sum = Math.round(sum);
    sum = sum.toString(16);
    sum = sum.substr(0, 6);//Make sure only 6 hex characters
    sum = sum.replace(".", sum[0]);//Remove any decimal points

    //Red*0.299 + Green*0.587 + Blue*0.114
    if (hexToInt(sum.substr(0, 2)) * 0.299 + hexToInt(sum.substr(2, 2)) * 0.587 + hexToInt(sum.substr(4, 2)) * 0.114 > 160) {
        //Text should be black
        foreground = "#000000";
    }
    sum = "#" + sum;


    return { background: sum, foreground: foreground };
}

function timeDiff(dt2, dt1) {//Returns a difference in minutes
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;

    return Math.abs(Math.round(diff));

}

//Converts and array into a string separated by commas
function stringListFromArray(arr) {
    let str = "";
    for (let i in arr) {

        if (i === "0" || arr[i - 1] === "") {//Dont add a comma to the first item
            str += `${arr[i]}`;
        } else {
            str += `, ${arr[i]}`
        }
    }

    return str;
}

function convertTimeZoneOffset(hrs, mins) {
    return ((hrs > 0) ? '+' : '-') +
        Math.abs(hrs).toString().padStart(2, '0') +
        ':' +
        mins.toString().padStart(2, '0') +
        ' GMT';
}

//Is this field empty?
function isEmpty(str) {
    if ((!str && str !== 0) || str === "" || str === null || str.length === 0) {
        return true;
    } else if (typeof (str) === "object") {
        if (Object.keys(str).length === 0 && str.constructor === Object) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function checkRoleAuth(moduleName, accessType) {
    return true;//VRents doesn't yet use Role Auths

    const role = JSON.parse(sessionStorage.getItem("role")).viewList;
    const module = role.find(e => e.ModuleView.ViewName === moduleName);
    if (module) {
        return module[accessType];
    } else {
        return false;
    }

}

function getLongLat(returnCallback, error) {
    const callback = pos => {
        returnCallback({
            long: pos.coords.longitude,
            lat: pos.coords.latitude
        })
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callback, error)
    } else {
        returnCallback(null)
    }
}

//Returns a string if the value is empty
function valueOrEmpty(value) {
    if (isEmpty(value)) {
        return "No data"
    }
    return value
}



export {
    compareValues,
    compareValuesDateStr,
    splitCamel,
    copyArrByValue,
    sortByFrequencyAndRemoveDuplicates,
    UniqateObjArray,
    UniqateArray,
    formatDatefromStr,
    formatDateFromDate,
    formatTimeFromDate,
    formatDateAndTimeFromDate,
    formatDateToMDY,
    formatDateToLength,
    formatISOFromDate,
    formatMaterialUIFromDate,
    formatDateStrFromDate,
    formatDateFromTime,
    formatAMPMdatetimeFromDate,
    formatTime,
    formatSelect,
    formatLookup,
    formatOptions,
    addDays,
    reverseDate,
    RemoveByField,
    getHistory,
    setHistory,
    getSubValue,
    setSubValue,
    getRandomColour,
    hexToRGBA,
    RGBAToHex,
    stringToColorCode,
    timeDiff,
    stringListFromArray,
    convertTimeZoneOffset,
    isEmpty,
    valueOrEmpty,
    checkRoleAuth,
    getLongLat,
};
