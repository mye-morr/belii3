"use strict";

class ButtonGroup {
    constructor(inCat, inName, objStorage) {

        if (!objStorage)
            throw new Error("ButtonGroup: constructor: must call with parameter objStorage")

        this._s = objStorage;

        this._inCat = inCat;
        this._inName = inName;
    }

    writeButtons(flags, nameStorage) {
        var objItem = new Item(this._inCat, this._inName, { _s: this._s }).objItem;
        var objFlags = new Flags(flags);
        var html = '';

        if (objFlags.isCollapsible) {
            html += '<details';

            if (objItem._isOpen)
                html += ' open';

            html += '><summary>' + objItem._label + '</summary><div class="spacer25"></div>';
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
        var element;
        for (var i = 0, len = arrRandom.length; i < len; i++) {
            element = objItem[arrRandom[i]];

            if (!element._hideButton) {
                html +=
                    '<button class="st" '
                    + 'onclick="ButtonGroup.pushButton('
                        + "'" + this._inCat + "',"
                        + "'" + this._inName + "',"
                        + "'" + arrRandom[i] + "',"
                        + "'" + element._meta + "',"
                        + "'" + flags + "',"
                        + "'" + nameStorage + "');location.reload();\">"
                        + arrRandom[i] + "</button>";

                bAtLeastOne = 1;
            }

            // will stop processing loop
            if (objFlags.isShowJustOne
                && bAtLeastOne==1)
                i = len;
        }

        if (objFlags.isSequential)
            if(!objFlags.hasRandomMemory) // will reset itself
                html += '<button class="st" onclick="unhideButtons('
                    + "'" + this._inCat + "',"
                    + "'" + this._inName + "',"
                    + "'" + nameStorage + "'"
                    + ");location.reload();\">reset</button>"

        if (objFlags.isCollapsible)
            html += '</details>';

        return html;
    }

    static pushButton(inCat, inName, inEncrypt, inMeta, inFlags, nameStorage) {
        var objMyLocal = new MyLocal(nameStorage);
        var objStorage = objMyLocal.objStorage;
        var objFlags = new Flags(inFlags);

        var objItem = new Item(inCat, inName, {_s: objStorage}).objItem;
        var objElement = new Element(inCat, inName, inEncrypt,{_s: objStorage}).objElement;

        if (!objFlags.isSilent)
            if (objFlags.hasGenericFeedback)
                alert(sGenericFeedback());
            else
                if (inMeta.length > 0)
                    alert(inMeta);

        var objSched = new Schedule(objStorage);
        var sDate = objSched.sDate;

        if (!(sDate in objElement._arrCount))
            objElement._arrCount[sDate] = { count: 1 };
        else
            objElement._arrCount[sDate].count++;

        if (!(sDate in objStorage["_arrSePoints"])) {
            objStorage["_arrSePoints"][sDate] = { cumPts:0, cumTime: 0};
        }

        if ("_pointVal" in objElement) {
            objStorage["_arrSePoints"][sDate].cumPts += objElement._pointVal;
        }

        if ("_timeSaved" in objElement) {
            objStorage["_arrSePoints"][sDate].cumTime += objElement._timeSaved;
        }

        if (objFlags.isAlwaysOpen)
            objItem._isOpen = 1;
        else
            objItem._isOpen = 0;

        if (objFlags.isSequential) {
            objElement._hideButton = 1;
            objItem._isOpen = 1;

            if (objFlags.hasRandomMemory) {
                // take it out of arrRandomMemory
                var idx = objItem._arrRandomMemory.indexOf(inEncrypt);
                objItem._arrRandomMemory.splice(idx, 1);

                // if we're removing last element
                // restore arrRandomMemory array
                if (objItem._arrRandomMemory.length == 0)
                    objItem._arrRandomMemory = objItem._arrOrder;
            }
        }

        objItem[inEncrypt] = objElement;
        objStorage[inCat + "_" + inName] = objItem;
        objStorage["_arrSchedule"].push(
            objSched.newSchedItem(
                                inName,
                                inEncrypt,
                                objElement._pointVal,
                                objStorage["_arrSePoints"][sDate].cumPts,
                                objStorage["_arrSePoints"][sDate].cumTime)
                                );

//////////////////////////////////////////////////////

        var arrSchedule = objStorage["_arrSchedule"];
        var len = arrSchedule.length;

        var last3Pos = true;
        var last3Neg = true;
        var countExamined = 0;

        // essentially this is a while loop :-\
        for (var i = len - 1; ((i >= 0) && (countExamined < 3)) ; i--) {
            if(arrSchedule[i]._pointValAdj != 0) { // lists
                if (arrSchedule[i]._pointValAdj > 0)
                    last3Neg = false;
                else if (arrSchedule[i]._pointValAdj < 0)
                    last3Pos = false;

                countExamined++;
            }
        }

        //!!! needs to be rewritten
        // so that only once every 5x max etc.
        //if (last3Pos && countExamined == 3)
        //    alert('yow, take it eas bruh');

        //if (last3Neg && countExamined == 3)
        //    alert('whoa, maybe its time for');

//////////////////////////////////////////////////////

        MyLocal.commitChanges(objStorage);
    }
}