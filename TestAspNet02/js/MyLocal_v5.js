"use strict";

/*********************
**********************
    Data Structure
**********************
**********************/

Storage.prototype.getObject = function (key) {
    return this.getItem(key) && JSON.parse(this.getItem(key));
}

Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
}

class MyLocal {

    constructor(nameLocal, objStorage) {
        if (!nameLocal)
            throw new Error("MyLocal: constructor: can't call w/o parameter");

        this._nameLocal = nameLocal;

        if (objStorage)
            this._s = objStorage;
        else
            this._s = localStorage.getObject(nameLocal);
    }

    get objStorage() {
        return this._s;
    }

    reoItems(inMember, arrItems) {
        this.refresh();

        var arrNewItems = [];

        var objCleanup = new Cleanup(this._s);
        for (var i = 0, len = arrItems.length; i < len; i++) {
            // directives for writePage
            if (arrItems[i].startsWith('rpt')
                || arrItems[i].startsWith('sched') // reports not stored--only written
                || arrItems[i].startsWith('grp')) {

                arrNewItems.push(arrItems[i]);
            }

            else {
                if (arrItems[i].trim().length == 0)
                    continue;

                // Items: inType-inFlags:inName
                var regex = /([^-]*)(?:-?)([^\:]*)(?:\:?)([^>]*)(?:>?)(.*)/;
                var arrTokens = regex.exec(arrItems[i]);

                var cat = arrTokens[1].trim();
                var flags = arrTokens[2].trim();
                var name = arrTokens[3].trim();
                var target = arrTokens[4].trim();

                if (target.length > 0) {

                    if (target in this._s) { // move to existing item
                        var objItem = this._s[target];

                        var buf = arrItems[i].indexOf('>');
                        var expr = arrItems[i].substring(0, buf).trim();

                        if (!(expr in objItem)) {
                            objItem[expr] = new Element('', '', expr, {_s: {} }).newElement('', 0, 0);
                            objItem._arrOrder.push(expr);
                        }
                    }

                    else { // brand new item
                        if (!((target + "_" + name) in this._s)) {
                            this._s[target + "_" + name] = new Item(target, name, { _s: this._s }).objNewItem;
                        }

                        delete this._s[cat + "_" + name];
                        arrNewItems.push(target + "-" + flags + ": " + name);
                    }
                }

                else {
                    if (cat[0] == cat[0].toUpperCase() && name == "")
                        name = "0";

                    if (!((cat + "_" + name) in this._s)) {
                        this._s[cat + "_" + name] = new Item(cat, name, { _s: this._s }).objNewItem;
                    }

                    arrNewItems.push(cat + '-' + flags + ': ' + name);

                } // end no-target
            } // end no-reserved
        } // end for
        
        this._s[inMember]._arrOrder = arrNewItems;

        // cleanup orphaned properties
        // can't be done at this point
        // because we're still at the item level
        // and items can easily be re-used

        // !!! this will apply to Elements
        //var prop;
        //for (prop in this._s) {
        //    if (this._s.hasOwnProperty(prop)
        //        && !prop.startsWith('Page')
        //        && !prop.startsWith('arr')) {

        //        if (this._s[inMember]._arrOrder.indexOf(prop) < 0)
        //            delete this._s[inMember][prop];
        //    }
        //}
            
        MyLocal.commitChanges(this._s);
    }

    reoElements(inItem, arrElements) {

        // parsing based on
        // just the first underscore
        // so that item name could have
        // more underscore characters
        var buf = inItem.indexOf('_');
        var cat = inItem.substring(0, buf);
        var name = inItem.substring(buf + 1);

        var objItem = new Item(cat, name, { _s: this._s }).objItem;

        var element = '';
        var arrStripped = [];

        for (var i = 0, len = arrElements.length; i < len; i++) {
            element = MyLocal.removeBadChar(arrElements[i]);

            // Elements: encrypt | decryptHint; meta-information > targetList
            var regex = /([^;>]*)(?:;?)([^>]*)(?:>?)(.*)/;
            var arrTokens = regex.exec(element);

            var encrypt = arrTokens[1].trim();
            var meta = arrTokens[2].trim();
            var target = arrTokens[3].trim();

            // encrypt is further broken down
            // abc (+/- pointVal | +/- timeSaved)
            regex = /(?:\()(\+|-?)(\d+)(?:\|?)(\+|-?)(\d*)(?:\))/;
            var arrBuf = encrypt.match(regex);

            var pointVal, timeSaved;
            if (arrBuf) {
                pointVal = parseInt(arrBuf[1] + arrBuf[2]);

                if (arrBuf[4].length > 0)
                    timeSaved = parseInt(arrBuf[3] + arrBuf[4]);
                else
                    timeSaved = 0;
            }
            else {
                pointVal = 0;
                timeSaved = 0;
            }

            if (target.length > 0) {
                ListGroup.moveListItem(type, name, encrypt,
                                        target, this._s);
            }
            else {
                arrStripped.push(encrypt);

                if (!(encrypt in objItem)) {
                    objItem[encrypt] = new Element('', '', encrypt, {_s: {}}).newElement(meta, pointVal, timeSaved);
                    objItem._arrRandomMemory.push(encrypt);
                }

                else {
                    var objElement = new Element(cat, name, encrypt, { _s: this._s }).objElement;
                    objElement._meta = meta;
                    objElement._pointVal = pointVal;
                    objElement._timeSaved = timeSaved;

                    objItem[encrypt] = objElement;
                }

            }
        }

        objItem._arrOrder = arrStripped;
        this._s[cat + "_" + name] = objItem;
        MyLocal.commitChanges(this._s);
    }

    refresh() {
        this._s = localStorage.getObject(this._nameLocal);
    }

    static commitChanges(objStorage) {
        localStorage.setObject(_nameLocal, objStorage);
}

    static arrElements(obj) {
        var arrReturn = [];
        var prop;

        for (prop in obj)
            if (obj.hasOwnProperty(prop) && !prop.startsWith("_"))
                arrReturn.push(prop);

        return arrReturn;
    }

    cleanupOrphans() {
        var arrElements = this.arrElements();
        for (var i = 0; i < arrElements.length; i++)
            if (this._arrOrder.indexOf(arrElements[i]) < 0)
                delete this[arrElements[i]];
    }

    ////////////////////////////////////////////////////////////////

    static removeBadChar(str) {
        // get rid of single quotes
        str = str.replace(/'/g, '');
        // and backslashes
        str = str.replace(/\\/g, '');

        return str;
    }

    ////////////////////////////////////////////////////////////////

    static storageAsJson(nameStorage) {
        var objStorage = new MyLocal(nameStorage).objStorage;
        return JSON.stringify(objStorage);
    }

    static storageFromJson(input) {
        this._s = JSON.parse(input);
        localStorage.setObject('mystorage3', this._s);

    }

    ////////////////////////////////////////////////////////////////

    static init(nameLocal) {
        var s = {};

        s.Page1_0 = new Item('', '', { _s: s }).objNewItem;
        s.Page2_0 = new Item('', '', { _s: s }).objNewItem;
        s.Page3_0 = new Item('', '', { _s: s }).objNewItem;
        s.Page4_0 = new Item('', '', { _s: s }).objNewItem;
        s.Page5_0 = new Item('', '', { _s: s }).objNewItem;
        s.Page6_0 = new Item('', '', { _s: s }).objNewItem;
        s.Page7_0 = new Item('', '', { _s: s }).objNewItem;
        s.Page8_0 = new Item('', '', { _s: s }).objNewItem;

        s._arrSchedule = [];
        s._arrSePoints = {};
        localStorage.setObject(nameLocal, s);
    }

    ////////////////////////////////////////////////////////////////

    static moveUpInArray(inType, inName, inEncrypt, nameStorage) {

        var objMyLocal = new MyLocal(nameStorage);
        var objStorage = objMyLocal.objStorage;

        var objItem = new Item(inType, inName,
            {_s:objStorage}).objItem;

        var arrOrder = objItem._arrOrder;
        var idxItem = arrOrder.indexOf(inEncrypt);

        if (idxItem > 0) 
            objItem._arrOrder.splice(idxItem - 1, 0,
                objItem._arrOrder.splice(idxItem, 1)[0]);
        
        objItem._isOpen = 1;

        objStorage[inType + "_" + inName] = objItem;
        MyLocal.commitChanges(objStorage);
    }

    //*********************************************************************************
    //*********************************************************************************

    static moveDownInArray(inType, inName, inEncrypt, nameStorage) {

        var objMyLocal = new MyLocal(nameStorage);
        var objStorage = objMyLocal.objStorage;

        var objItem = new Item(inType, inName,
            { _s: objStorage }).objItem;

        var arrOrder = objItem._arrOrder;
        var idxItem = arrOrder.indexOf(inEncrypt);

        objItem._arrOrder.splice(idxItem + 1, 0,
            objItem._arrOrder.splice(idxItem, 1)[0]);

        objItem._isOpen = 1;

        objStorage[inType + "_" + inName] = objItem;
        MyLocal.commitChanges(objStorage);
    }

    //*********************************************************************************
    //*********************************************************************************

}