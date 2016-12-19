/***************
    Contents
****************
****************
** Data Structure
** Populate Data
** Write HTML
** Transform Arrays
** Using LocalStorage
** Cleanup
** Testing
****************/

/*********************
**********************
    Data Structure
**********************
**********************/

function mylocal() { }

function setLocalStorage() {
    var mystorage = new mylocal();
    mystorage.arrElements1 = [];
    mystorage.arrElements2 = [];
    mystorage.arrElements3 = [];
    mystorage.arrElements4 = [];
    mystorage.arrElements5 = [];
    mystorage.arrElements6 = [];
    mystorage.arrElements7 = [];
    mystorage.arrElements8 = [];

    mystorage.arrSchedule = [];
    mystorage.arrSxPoints = {};

    localStorage.setObject('mystorage', mystorage);
}

//*****************************************************************
//*****************************************************************

function mysched() { };

function objSched(inType, inDesc, inSxPts) {

    var sched = new mysched();

    var d = new Date();
    var sDate = pad2(d.getMonth() + 1) + '/' + pad2(d.getDate());
    var sTime = pad2(d.getHours()) + ':' + pad2(d.getMinutes());

    var arrTimeEncrypt = [];
    var arrTimeEncryptKey = [];

    var arrRemaining = [0, 1, 2, 3, 4];
    var idx;
    for (var i = 0; i < 5; i++) {
        idx = Math.floor(Math.random() * arrRemaining.length);
        arrTimeEncryptKey.push(arrRemaining[idx]);
        arrTimeEncrypt.push(sTime.charAt(arrRemaining[idx]));
        arrRemaining.splice(idx, 1);
    }

    sched.date = sDate;

    sched.arrTimeEncrypt = arrTimeEncrypt;
    sched.arrReverseTimeEncryptKey = arrTimeEncryptKey.reverse();

    sched.type = inType;
    sched.desc = inDesc;
    sched.sxPts = inSxPts;

    return sched;
}

/*********************
**********************
    Populate Data
**********************
**********************/

function checkItem(inType, inName) {
    var mystorage = localStorage.getObject('mystorage');

    if (!((inType + "_" + inName) in mystorage)) {
        eval("mystorage." + inType + "_" + inName + "={ _isOpen:0, arrElements:[]};");
        localStorage.setObject('mystorage', mystorage);
    }
}

//*****************************************************************
//*****************************************************************

function reOrderElements(inType, inName, inArray, inArrayMeta) {
    var mystorage = localStorage.getObject('mystorage');
    var curnotes;

    if ((inType + "_" + inName) in mystorage) {
        for (var i = 0; i < inArray.length; i++) {

            // get rid of single-quotes
            inArray[i] = inArray[i].replace(/'/g, '');
            // and backslashes
            inArray[i] = inArray[i].replace(/\\/g, '');

            // make sure the elements exists
            if (!(inArray[i] in eval("mystorage." + inType + "_" + inName))) {
                eval("mystorage." + inType + "_" + inName + "['" + inArray[i] + "']={count:0, hidden:0, warning:'', notes:''};");
            }

            if (inArrayMeta) {
                if (inType == 'bg') {
                    if (inArrayMeta[i].length > 0
                        || eval("mystorage." + inType + "_" + inName + "['" + inArray[i] + "'].warning.length>0;"))
                        eval("mystorage." + inType + "_" + inName + "['" + inArray[i] + "'].warning=inArrayMeta[i];");
                }
                else {
                    if (inArrayMeta[i].length > 0
                        || eval("mystorage." + inType + "_" + inName + "['" + inArray[i] + "'].notes.length>0;"))
                        eval("mystorage." + inType + "_" + inName + "['" + inArray[i] + "'].notes=inArrayMeta[i];");
                }
            }
        }

        eval("mystorage." + inType + "_" + inName + ".arrElements=inArray;");
        localStorage.setObject('mystorage', mystorage);
    }
}

//*****************************************************************
//*****************************************************************

function addElement(inType, inName, inElement, inPlus, inMinus) {
    var mystorage = localStorage.getObject('mystorage');

    // this should never happen
    // because Add only gets called
    // from within the website
    // AFTER an item is written
    // but ...
    if (!((inType + "_" + inName) in mystorage))
        eval("mystorage." + inType + "_" + inName + "={ _isOpen:0, arrElements:[]};");

    // get rid of single quotes
    inElement = inElement.replace(/'/g, '');
    // and backslashes
    inElement = inElement.replace(/\\/g, '');

    var buf;
    var inElementStripped = '';
    var inElementMeta = '';

    buf = inElement.split(';');
    inElementStripped = buf[0];
    inElementMeta = buf[1] ? buf[1] : '';

    // very small possibility that element already exists in item
    if (!(inElement in eval("mystorage." + inType + "_" + inName))) {
        eval("mystorage." + inType + "_" + inName + "['" + inElementStripped + "']={count:0, hidden:0, warning:'', notes:''};");
    }

    eval("mystorage." + inType + "_" + inName + ".arrElements.push('" + inElementStripped + "');");

    if(inElementMeta.length > 0)
        eval("mystorage." + inType + "_" + inName + "['" + inElementStripped + "'].notes=inElementMeta;");
    
    // keep it closed after adding something
    eval("mystorage." + inType + "_" + inName + "._isOpen=0;");
    localStorage.setObject('mystorage', mystorage);

    // couldn't call addToSched before because
    // mystorage can only be checked out once at a time
    addToSched('list', inElement, inPlus, inMinus);
}

/***************
****************
    Interact
****************
****************/

// lists manage with only the data-structure functions

function pushButton(inType, inName, inContent, isSequential) {

    var mystorage = localStorage.getObject('mystorage');

    var warning = '';

    eval("mystorage." + inType + "_" + inName + "['" + inContent + "'].count++;");
    
    eval("warning = mystorage." + inType + "_" + inName + "['" + inContent + "'].warning;");
    if (warning.length > 0)
        alert(warning);

    if (isSequential==1) {
        eval("mystorage." + inType + "_" + inName + "['" + inContent + "'].hidden=1;");
    }

    localStorage.setObject('mystorage', mystorage);
    addToSched('button',inContent);

}

//*********************************************************************************
//*********************************************************************************

function unhideButtons(inType, inName) {
    var mystorage = localStorage.getObject('mystorage');

    var elements;
    eval("elements=mystorage." + inType + "_" + inName + ".arrElements;");

    for (var i = 0; i < elements.length; i++) {
        eval("mystorage." + inType + "_" + inName + "['" + elements[i] + "'].hidden=0;");
    }

    localStorage.setObject('mystorage', mystorage);
}

//*********************************************************************************
//*********************************************************************************

function addToSched(inType, inDesc, inPlus, inMinus) {
    if (!inPlus)
        inPlus = 0;

    if (!inMinus)
        inMinus = 0;

    var mystorage = localStorage.getObject('mystorage');

    var d = new Date();
    var sDate = pad2(d.getMonth() + 1) + '/' + pad2(d.getDate());

    if (!(sDate in mystorage.arrSxPoints)) {
        mystorage.arrSxPoints[sDate] = { count: 0 };
    }

    mystorage.arrSxPoints[sDate].count += (parseInt(inPlus) + parseInt(inMinus));
    mystorage.arrSchedule.push(objSched(inType, inDesc, mystorage.arrSxPoints[sDate].count));

    localStorage.setObject('mystorage', mystorage);
}

//*********************************************************************************
//*********************************************************************************

function delProperty(inProp) {
    var mystorage = localStorage.getObject('mystorage');

    // even though deleted from variable
    // it stays in the arrElementsN inactively
    // a bug would happen if we reuse the same name
    // as a previously deleted list or button-group
    // so manual deletes would be good
    eval("delete mystorage." + inProp + ";");

    localStorage.setObject('mystorage', mystorage);
}

//*********************************************************************************
//*********************************************************************************

function wipeSched() {
    var mystorage = localStorage.getObject('mystorage');

    delete mystorage.arrSchedule;
    mystorage.arrSchedule = [];

    localStorage.setObject('mystorage', mystorage);
}

/******************
*******************
    write HTML
*******************
*******************/

function writeList(inType, inName,
        hasAdd, hasUpDownX, hasSxPts) {

    if (!hasAdd)
        hasAdd = 0;

    if (!hasUpDownX)
        hasUpDownX = 0;

    if (!hasSxPts)
        hasSxPts = 0;

    var html = '';

    var isOpen = 0;
    var notes = '';

    var elements;

    var mystorage = localStorage.getObject('mystorage');

    // may have been deleted!
    if ((inType + "_" + inName) in mystorage) {

        eval("isOpen=mystorage."+inType + "_" + inName+"._isOpen");

        if (hasAdd == 1) {
            html += '<section class="addElement">'
                    + '<label for="input_' + inType + '_' + inName + '">' + inName + ':</label>'
                    + '<div class="addElement">'
                    + '<input type="text" class="addElement" name="input_' + inType + "_" + inName + '" id="input_' + inType + '_' + inName + '"/>'
                    + ' </div>'
                    + '<div class="addElement">'
                    + '<button class="addElement" onclick="'
                    + 'addElement('
                    + '&quot;' + inType + '&quot;,&quot;' + inName + '&quot;,'
                    + 'document.getElementById(&quot;input_' + inType + '_' + inName + '&quot;).value,'
                    + 'document.getElementById(&quot;' + inType + '_' + inName + '_plusPts' + '&quot;).value,'
                    + 'document.getElementById(&quot;' + inType + '_' + inName + '_minusPts' + '&quot;).value);'
                    + 'location.reload();">Add</button></div>';


                html += '<div class="sxPtsContainer"';

                if (hasSxPts == 0)
                    html += ' style="visibility:hidden;"'

                html += '><div class="sxPts"></div>'
                        + '<div class="sxPtsRow">'
                        + '<div class="sxPts"></div>'
                        + '<div class="sxPts"><input disabled type="text" class="sxPts" id="' + inType + '_' + inName + '_plusPts" value="0"/></div>'
                        + '<div class="sxPts"><button class="sxPts" onclick="document.getElementById(&quot;' + inType + '_' + inName + '_plusPts&quot;).value=parseInt(document.getElementById(&quot;' + inType + '_' + inName + '_plusPts&quot;).value) + 1;">+</button></div>'
                        + '<div class="sxPts"></div>'
                        + '<div class="sxPts"></div></div>'
                        + '<div class="sxPtsRow">'
                        + '<div class="sxPts"></div>'
                        + '<div class="sxPts"></div>'
                        + '<div class="sxPts"></div>'
                        + '<div class="sxPts"><input disabled type="text" class="sxPts" id="' + inType + '_' + inName + '_minusPts" value="0"/></div>'
                        + '<div class="sxPts"><button class="sxPts" style="font:50px;" onclick="document.getElementById(&quot;' + inType + '_' + inName + '_minusPts&quot;).value=parseInt(document.getElementById(&quot;' + inType + '_' + inName + '_minusPts&quot;).value) - 1;">-</button></div>'
                        + '<div class="sxPts"></div></div>'
                        + '</div></div>';

            html += '</section>';
        }

        html += '<div class="spacer25"></div>';
        html += '<details'
        
        if (isOpen == 1) {
            html += ' open';

            //once is enough--we don't want everything staying open every refresh
            eval("mystorage." + inType + "_" + inName + "._isOpen=0;");
        }

        html += '><summary>' + inName + '</summary>';

        eval("elements=mystorage." + inType + "_" + inName + ".arrElements;");


        html += '<div class="spacer25"></div>';
        html += '<div class="modArray"><table>';
        for (var i = 0; i < elements.length; i++) {
            html += '<tr class="list">';

            if (hasUpDownX == 1)
                html += '<td class="width60">' + elements[i] + '</td>';
            else
                html += '<td class="width90">' + elements[i] + '</td>';

            eval("notes=mystorage." + inType + "_" + inName + "['" + elements[i] + "'].notes;");

            html += '<td class="listButtons"><button class="modArray" ';

            if (notes.length == 0)
                html += 'style="visibility:hidden"></button></td>';
            else
                html += 'onclick="alert(&quot;' + notes + '&quot;);">n</button></td>'

            //buttons will be distracting for list-talks
            if (hasUpDownX == 1) {
                html += ''
                      + '<td class="listButtons"><img src="img/arrow_up.gif" onclick="moveUpInArray(&quot;' + inType + '&quot;,&quot;' + inName + '&quot;,' + i + ');location.reload();"/></td>'
                      + '<td class="listButtons"><img src="img/arrow_down.gif" onclick="moveDownInArray(&quot;' + inType + '&quot;,&quot;' + inName + '&quot;,' + i + ');location.reload();"/></td>'
                      + '<td class="listButtons"><button class="modArray" onclick="removeFromArray(&quot;' + inType + '&quot;,&quot;' + inName + '&quot;,' + i + ');location.reload();">x</button></td>'
                      + '<td class="listButtons"></td>';
            }

            html += '</tr>';
        }

        html += '</table></div></details>';
    }

    localStorage.setObject('mystorage', mystorage);

    html += '<div class="spacer200"></div>';
    return html;
}

//*****************************************************************
//*****************************************************************

function writeButtons(inType, inName, hasSequential) {

    var html = '';

    if (!hasSequential)
        hasSequential = 0;

    var mystorage = localStorage.getObject('mystorage');
    var buttons;
    var isHidden;

    // may have been deleted!
    if ((inType + "_" + inName) in mystorage) {

        eval("buttons=mystorage." + inType + "_" + inName + ".arrElements;");
        for (var i = 0; i < buttons.length; i++) {
            eval("isHidden=mystorage." + inType + "_" + inName + "['" + buttons[i] + "'].hidden;");

            if (!(isHidden == 1))
                html +=
                    '<button class="st" '
                    + 'onclick="pushButton('
                        + "'" + inType + "',"
                        + "'" + inName + "',"
                        + "'" + buttons[i] + "',"
                        + "'" + hasSequential + "');location.reload();\">"
                    + buttons[i] + "</button>";
        }

        if (hasSequential)
            html += '<button class="st" onclick="unhideButtons('
                    + "'" + inType + "','" + inName + "'" + ");location.reload();\">reset</button>"

    }

    html += '<div class="spacer200"></div>';
    return html;
}

//*****************************************************************
//*****************************************************************

function writeSched(option, hasNoTime) {
    // option 0 is just sched tasks
    // option 1 includes buttons as well
    // option 2 includes list items also

    if (!hasNoTime)
        hasNoTime = 0;

    var html = '';

    var mystorage = localStorage.getObject('mystorage');
    var schedule = mystorage.arrSchedule;
    var time = '';
    var arrBuf;
    var arrTimeEncryptKey;
    html += '<details><summary>schedule</summary><table class="schedule">'

    for (var i = 0; i < schedule.length; i++) {
        if ((schedule[i].type == 'sched')
            || (schedule[i].type == 'button' && option > 0)
            || (schedule[i].type == 'list' && option > 1)) {

            if (hasNoTime)
                time = 'time';
            else {
                arrBuf = [0, 0, 0, 0, 0];
                arrTimeEncryptKey = schedule[i].arrReverseTimeEncryptKey.reverse();
                for (var j = 0; j < arrTimeEncryptKey.length; j++)
                    arrBuf[arrTimeEncryptKey[j]] = schedule[i].arrTimeEncrypt[j];
                time = arrBuf.join('');
            }

            html += '<tr class="schedule">'
                    + '<td class="schedule">'
                    + schedule[i].sxPts + '</td>'
                    + '<td class="schedule">'
                    + schedule[i].date + '</td>'
                    + '<td class="schedule">'
                    + time + '</td>'
                    + '<td class="schedule">'
                    + schedule[i].type + '</td>'
                    + '<td class="schedule">'
                    + schedule[i].desc + '</td></tr>';
        }
    }

    html += '</table></details>';
    html += '<div class="spacer200"></div>';

    return html;
}

//*****************************************************************
//*****************************************************************

function propToComboBox() {
    var html = '';
    var arrBuf = [];

    var mystorage = localStorage.getObject('mystorage');

    // alphabetize first
    for (prop in mystorage) {
        // semantic preference
        arrBuf.push(prop);
    }
    arrBuf = arrBuf.sort();

    for (var i = 0; i < arrBuf.length; i++) {
        if (arrBuf[i] == 'arrSchedule' || arrBuf[i] == 'arrSxPoints') // reserved
            ;
        else
            html += '<option value="' + arrBuf[i] + '">' + arrBuf[i] + '</option>';
    }

    return html;
}

function contentsToStr(num) {
    var str = '';
    var elements;

    var mystorage = localStorage.getObject('mystorage');

    eval("elements=mystorage.arrElements" + num);
    for (var i = 0; i < elements.length; i++) {
            str += "&nbsp;|&nbsp;" + elements[i].split(':')[1];
    }

    // remove first divider
    return str.substring(13);
}

//*****************************************************************
//*****************************************************************

function writePage(num) {
    var html = '';

    var mystorage = localStorage.getObject('mystorage');
    var elements;

    // may have been deleted!
    if (mystorage) {
        if (("arrElements" + num) in mystorage) {

            eval("elements=mystorage.arrElements" + num + ";");

            var buf = [];
            var hasAdd = 0;
            var hasUpDownX = 0;
            var hasSxPoints = 0;

            // ideally we would like to use error-handling
            // to flag null-pointers here, to prevent bug (see above)
            // but manual tweaking is good for now
            for (var i = 0; i < elements.length; i++) {

                // hasAdd, hasUpDownX, hasSxPoints

                buf = elements[i].split(':');

                if (buf[0].startsWith('sched')) {
                    if (buf[0].indexOf('0') > 0)
                        html += writeSched(buf[1], 1);
                    else
                        html += writeSched(buf[1]);
                }

                else if (buf[0].startsWith('bg')) {
                    if (buf[0].indexOf('seq') > 0)
                        html += writeButtons('bg', buf[1], 1);
                    else
                        html += writeButtons(buf[0], buf[1]);
                }

                else if (buf[0].startsWith('lt')) {
                    html += writeList(buf[0], buf[1], 0, 0, 0);
                }

                else if (buf[0].startsWith('l')) {
                    hasAdd = 0;
                    hasUpDownX = 0;
                    hasSxPoints = 0;

                    if (buf[0].indexOf('a') > 0)
                        hasAdd = 1;

                    if (buf[0].indexOf('u') > 0)
                        hasUpDownX = 1;

                    if (buf[0].indexOf('x') > 0)
                        hasSxPoints = 1;

                    html += writeList('list', buf[1], hasAdd, hasUpDownX, hasSxPoints);
                }
            }
        }
        return html;
    }
}

/************************
*************************
    Transform Arrays
*************************
*************************/

function modArray_pull(inMember) {

    var foo = '';

    var mystorage = localStorage.getObject('mystorage');
    var elements;
    var notes = '';

    // these are special objects
    if (inMember.startsWith('arrElements')) {
        eval("elements=mystorage." + inMember + ";");

        for (var i = 0; i < elements.length; i++)
            foo += '\n' + elements[i];
    }

    else {
        eval("elements=mystorage." + inMember + ".arrElements;");

        for (var i = 0; i < elements.length; i++) {
            foo += '\n' + elements[i];

            if (inMember.startsWith('bg'))
                eval("notes=mystorage." + inMember + "['" + elements[i] + "'].warning;");
            else
                eval("notes=mystorage." + inMember + "['" + elements[i] + "'].notes;");

            if (notes.length > 0)
                foo += ';' + notes;
        }
    }

    document.getElementById('modArray').value = foo.substring(1);
}

//*********************************************************************************
//*********************************************************************************

function modArray_push(inMember) {

    var inArray = document.getElementById('modArray').value.split(/\n/);
    var inArrayStripped = [];
    var inArrayMeta = [];

    // arrElements are critical arrays
    // that structures the whole webpage
    // therefore, make sure elements exist

    var buf;
    var idxOf = 0;

    if (inMember.startsWith('arrElements')) {
        for (var i = 0; i < inArray.length; i++) {
            buf = inArray[i].split(':');

            // don't know why but
            // prefer to input as l:
            // but stored as list_
            if (buf[0].startsWith('sched')) // reserved
                ;
            else if (buf[0].startsWith('bg-'))
                checkItem('bg', buf[1]);
            else if (buf[0].startsWith('bg'))
                checkItem('bg', buf[1]);
            else if (buf[0].startsWith('lt-'))
                checkItem('lt', buf[1]);
            else if (buf[0].startsWith('lt'))
                checkItem('lt', buf[1]);
            else if (buf[0].startsWith('l-'))
                checkItem('list', buf[1]);
            else if (buf[0].startsWith('l'))
                checkItem('list', buf[1]);
            else
                checkItem(buf[0], buf[1]);
        }

        //raw but who cares
        setArray(inMember, inArray);
    }
    else {

        for (var i = 0; i < inArray.length; i++) {
            buf = inArray[i].split(';');
            inArrayStripped[i] = buf[0];
            inArrayMeta[i] = buf[1] ? buf[1] : '';
        }

        idxOf = inMember.indexOf('_');

            reOrderElements(
                inMember.substring(0, idxOf),
                inMember.substring(idxOf + 1),
                inArrayStripped, inArrayMeta);

    }
}

//*********************************************************************************
//*********************************************************************************

function moveUpInArray(inType, inName, inIndex) {
    var mystorage = localStorage.getObject('mystorage');

    if (inIndex > 0)
        eval("mystorage." + inType + "_" + inName + ".arrElements.splice(" + (inIndex - 1) + ",0,"
            + "mystorage." + inType + "_" + inName + ".arrElements.splice(" + inIndex + ",1)[0]);");

    eval("mystorage." + inType + "_" + inName + "._isOpen=1;");
    localStorage.setObject('mystorage', mystorage);
}

//*********************************************************************************
//*********************************************************************************

function moveDownInArray(inType, inName, inIndex) {
    var mystorage = localStorage.getObject('mystorage');

    //the down case doesn't need extra checking, it seems
    eval("mystorage." + inType + "_" + inName + ".arrElements.splice(" + (inIndex + 1) + ",0,"
        + "mystorage." + inType + "_" + inName + ".arrElements.splice(" + inIndex + ",1)[0]);");

    eval("mystorage." + inType + "_" + inName + "._isOpen=1;");
    localStorage.setObject('mystorage', mystorage);
}

function removeFromArray(inType, inName, inIndex) {
    var mystorage = localStorage.getObject('mystorage');

    var buf = '';
    eval("buf=mystorage." + inType + "_" + inName + ".arrElements[" + inIndex + "];");
    eval("delete mystorage." + inType + "_" + inName + "['" + buf + "'];");
    eval("mystorage." + inType + "_" + inName + ".arrElements.splice(" + inIndex + ",1);");

    eval("mystorage." + inType + "_" + inName + "._isOpen=1;");
    localStorage.setObject('mystorage', mystorage);
}

//*********************************************************************************
//*********************************************************************************

function setArray(inMember, inArray) {
    var mystorage = localStorage.getObject('mystorage');
    eval("mystorage." + inMember + "=inArray;");
    localStorage.setObject('mystorage', mystorage);
}

/**************************
***************************
    Using LocalStorage
***************************
***************************/

Storage.prototype.getObject = function (key) {
    return this.getItem(key) && JSON.parse(this.getItem(key));
}

Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
}

function pad2(iDigit) {
    if (iDigit < 10)
        return "0" + iDigit;
    else
        return iDigit;
}

//*********************************************************************************
//*********************************************************************************

function stringifyMyStorage() {
    var mystorage = localStorage.getObject('mystorage');
    return JSON.stringify(mystorage);
}

function parseMyStorage(input) {
    localStorage.setObject('mystorage', JSON.parse(input));
}

/***************
****************
    Cleanup
****************
****************/

// for data-structure changes
// we carefully copy the old data-structure into new data-structure

// todo: move warning and notes into a meta property
// todo: remove orphaned properties
// todo: ideally alphabetize new object

function cleanupMyStorage() {

    var mystorage = localStorage.getObject('mystorage');
    var mystorage2 = new mylocal();

    // reserved arrays
    mystorage2.arrElements1 = [];
    mystorage2.arrElements2 = [];
    mystorage2.arrElements3 = [];
    mystorage2.arrElements4 = [];
    mystorage2.arrElements5 = [];
    mystorage2.arrElements6 = [];
    mystorage2.arrElements7 = [];
    mystorage2.arrElements8 = [];

    var buf;

    // copy reserved arrays first
    for (prop in mystorage2) {

        eval("buf=mystorage." + prop + ";");

        for (var i = 0; i < buf.length; i++)
            eval("mystorage2." + prop + ".push('" + buf[i] + "');");

    }

    // copy custom objects
    // arrSchedule
    // arrSxPoints

    // copy user objects
    for (prop in mystorage) {

        if (!(prop.startsWith('arr') || prop in mystorage2)) {
            eval("mystorage2." + prop + "={ _isOpen:0, arrElements:[]};");

        }
    }
}

/***************
****************
    Testing
****************
****************/


