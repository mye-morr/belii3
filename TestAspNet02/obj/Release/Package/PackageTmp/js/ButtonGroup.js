"use strict";

class ButtonGroup {
    constructor(inName, objStorage) {

        if (!objStorage)
            throw new Error("ButtonGroup: constructor: must call with parameter objStorage")

        this._s = objStorage;

        this._inName = inName;
        var objNames = new Names(inName, { _s: this._s }).objNames;
        this._type = objNames._type;
        this._flags = objNames._flags;
        this._objFlags = new Flags(this._flags);
    }

    writeButtons(nameLocal) {
        var objFlags = this._objFlags;
        var objItem = new Item(this._type, this._inName,
                                { _s: this._s }).objItem;

        var objSched = new Schedule(this._s);
        var sDate = objSched.sDate;

        var html = '';

        if (objFlags.isCollapsible) {
            html += '<details';

            if (objItem._isOpen)
                html += ' open';

            html += '><summary>' + this._inName + '</summary><div class="spacer25"></div>';
        }

        var arrOrder = objItem._arrOrder;

        var arrRandom = [];
        if (objFlags.isRandomized) {
            var arrRemaining = [];

            if (objFlags.hasRandomMemory) {
                for (var i = 0, len = objItem._arrRandomMemory.length; i < len; i++)
                    arrRemaining.push(objItem._arrRandomMemory[i]);
            }
            else {
                for (var i = 0, len = arrOrder.length; i < len; i++)
                    arrRemaining.push(arrOrder[i]);
            }

            var numElements = arrRemaining.length;

            var idx = 0;
            for (var i = 0, len = numElements; i < len; i++) {
                idx = Math.floor(Math.random() * arrRemaining.length);
                arrRandom.push(arrRemaining[idx]);
                arrRemaining.splice(idx, 1);
            }
        }
        else { // not randomized
            arrRandom = arrOrder;
        }

        var bAtLeastOne = 0;
        var bAtLeastOneQuota = 0;
        var element;
        for (var i = 0, len = arrRandom.length; i < len; i++) {
            element = objItem[arrRandom[i]];

            if (!element._hideButton) {
                html +=
                    '<button class="st" '
                    + 'onclick="ButtonGroup.pushButton('
                        + "'" + this._inName + "',"
                        + "'" + arrRandom[i] + "',"
                        + "'" + element._meta + "',"
                        + "'" + nameLocal + "');location.reload();\">";

                var idxFind;
                if ("_numQuota" in element) {
                    idxFind = arrRandom[i].indexOf("|");
                    if (idxFind >= 0) {
                        if (sDate in element._arrCount) {
                            if (element._arrCount[sDate].remaining > 0)
                                html += arrRandom[i].substring(0, idxFind) + ")-" + element._arrCount[sDate].remaining;
                            else
                                html += arrRandom[i].substring(0, idxFind) + ")-*";
                        }
                        else {
                            html += arrRandom[i].substring(0, idxFind) + ")-" + element._numQuota;
                        }
                    }
                    else {
                        html += arrRandom[i];
                    }
                }
                else {
                    html += arrRandom[i];
                }

                html += "</button>";

                bAtLeastOne = 1;
            }

            // will stop processing loop
            if (objFlags.isShowJustOne
                && bAtLeastOne==1)
                i = len;

            if (element._numQuota > 0)
                bAtLeastOneQuota = 1;
        }

        if (objFlags.isSequential || bAtLeastOneQuota)
            if(!objFlags.hasRandomMemory) // will reset itself
                html += '<button class="st" onclick="unhideButtons('
                    + "'" + this._inName + "',"
                    + "'" + nameLocal + "'"
                    + ");location.reload();\">reset</button>"

        if (objFlags.hasTinkBox == 1) {
            html += '<textarea class="modArray" rows="15"></textarea>';
        }

        if (objFlags.isCollapsible)
            html += '</details>';

        return html;
    }

    static pushButton(inName, inEncrypt, inMeta, nameStorage) {
        var objMyLocal = new MyLocal(nameStorage);

        var objStorage = objMyLocal.objStorage;
        var objNames = new Names(inName, { _s: objStorage }).objNames;

        var type = objNames._type;
        var flags = objNames._flags;
        var objFlags = new Flags(flags);

        var objItem = new Item(type, inName,
            {
                _s: objStorage
            }
            ).objItem;

        var objElement = new Element(type, inName, inEncrypt,
            {
                _s: objStorage
            }
            ).objElement;

        if (!objFlags.isSilent)
            if (objFlags.hasFeedback)
                alert(sGenericFeedback());
            else
                if (inMeta.length > 0)
                    alert(inMeta);

        var objSched = new Schedule(objStorage);
        var sDate = objSched.sDate;

        if (!(sDate in objElement._arrCount))
            objElement._arrCount[sDate] = { count: 1, remaining: objElement._numQuota };
        else
            objElement._arrCount[sDate].count++;

        if (!(sDate in objStorage["_arrSePoints"]))
            objStorage["_arrSePoints"][sDate] = { cumPts:0};

        if ("_pointVal" in objElement)
            objStorage["_arrSePoints"][sDate].cumPts += objElement._pointVal;
        
        if ("_numQuota" in objElement)
            if (objElement._arrCount[sDate].remaining > 0)
                objElement._arrCount[sDate].remaining = objElement._arrCount[sDate].remaining - 1;
            else
                objElement._arrCount[sDate].remaining = objElement._numQuota;

        if (objFlags.isAlwaysOpen)
            objItem._isOpen = 1;
        else
            objItem._isOpen = 0;

        if (objFlags.isSequential) {
            objElement._hideButton = 1;
        }

        if (objFlags.hasRandomMemory) {
            // take it out of arrRandomMemory
            var idx = objItem._arrRandomMemory.indexOf(inEncrypt);
            objItem._arrRandomMemory.splice(idx, 1);

            // if we're removing last element
            // restore arrRandomMemory array
            if (objItem._arrRandomMemory.length == 0)
                objItem._arrRandomMemory = objItem._arrOrder;
        }

        var cumPts;
        if (parseInt(objElement._pointVal) == 0)
            cumPts = '-';
        else
            cumPts = objStorage["_arrSePoints"][sDate].cumPts;

        objItem[inEncrypt] = objElement;
        objStorage[type + "_" + inName] = objItem;
        objStorage["_arrSchedule"].push(
            objSched.newSchedItem(
                                inName,
                                inEncrypt,
                                objElement._pointVal,
                                cumPts));

//////////////////////////////////////////////////////

        var arrSchedule = objStorage["_arrSchedule"];
        var len = arrSchedule.length;

        var last3Pos = true;
        var last3Neg = true;
        var countExamined = 0;

        // essentially this is a while loop :-\
        var min = len - 6 < 0 ? 0 : len - 6;
        for (var i = len - 1; i >= min; i--) {
            if(arrSchedule[i]._pointValAdj != 0) { // lists
                if (arrSchedule[i]._pointValAdj > 0)
                    last3Neg = false;
                else if (arrSchedule[i]._pointValAdj < 0)
                    last3Pos = false;

                countExamined++;
            }

        }

        if (last3Pos && countExamined >= 3)
            alert('yow, take it eas bruh');

        if (last3Neg && countExamined >= 3)
            alert('whoa, maybe its time for');

//////////////////////////////////////////////////////

        MyLocal.commitChanges(objStorage);
    }
}