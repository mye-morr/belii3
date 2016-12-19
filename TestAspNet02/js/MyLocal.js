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

    checkItems(inMember, arrItems) {

        var objCleanup = new Cleanup(this._s);
        for (var i = 0, len = arrItems.length; i < len; i++) {
            if (arrItems[i].startsWith('rpt')
                || arrItems[i].startsWith('pts')
                || arrItems[i].startsWith('sched')
                || arrItems[i].startsWith('gent')) {
                ; // these items are not stored, but generated
            }

            else {
                if (arrItems[i].trim().length == 0)
                    continue;

                // Items: inType-inFlags:inName
                var regex = /([^-]*)(?:-?)([^\:]*)(?:\:)([^>]*)(?:>?)(.*)/;
                var arrTokens = regex.exec(arrItems[i]);
                var type, flags, name, target, buf, expr, startFlags;
                type = arrTokens[1].trim();
                flags = arrTokens[2].trim();
                name = arrTokens[3].trim();
                target = arrTokens[4].trim();

                if (target.length > 0) {
                    startFlags = 'lugo';
                    var preItem = new Item('0', target, { _s: this._s });

                    if (!(target in this._s["_arrNames"])) {
                        this._s["_arrNames"][target] = new Names(target, { _s: this._s }
                                                    ).newNames('A', startFlags);
                        this._s['A' + "_" + target] = preItem.newItem();
                    }
                }

                else {
                    var objItem = new Item(type, name, { _s: this._s });

                    if (!(name in this._s["_arrNames"])) {
                        this._s["_arrNames"][name] = new Names(name, { _s: this._s }
                                                    ).newNames(type, flags);
                        this._s[type + "_" + name] = objItem.newItem();
                    }

                    var objNames = new Names(name, { _s: this._s }).objNames;

                    if (type != objNames._type) {
                        this._s = objCleanup.copyItem(name,
                                    objNames._type, type,
                                    objNames._flags, flags,
                                    this._s);
                        this._s["_arrNames"][name]._type = type;
                        this._s["_arrNames"][name]._item = type + "_" + name;
                    }

                    this._s["_arrNames"][name]._flags = flags;

                } // end no-target
            } // end no-reserved
        } // end for
    }

    reoElements(inItem, arrElements) {
        // Items: inType_inName - inFlags
        var regex = /^([A-Za-z0-9]*)(?:_)([A-Za-z0-9_]*)(?:-*)(\w*)$/;
        var arrTokens = regex.exec(inItem);
        var type, name, flags;
        type = arrTokens[1].trim();
        name = arrTokens[2].trim();
        flags = arrTokens[3].trim();

        if (type == "A") {
            this.checkItems(inItem, arrElements);
        }

        var objItem = new Item(type, name, { _s: this._s }).objItem;

        var element = '';
        var objFlags;
        var arrStripped = [];

        objFlags = new Flags(this._s["_arrNames"][name]._flags);

        var regex, arrTokens, arrBuf;
        var encrypt, pointVal, numQuota, meta, target;
        for (var i = 0, len = arrElements.length; i < len; i++) {
            element = MyLocal.removeBadChar(arrElements[i]);

            // Elements: encrypt; meta-information > targetList
            regex = /([^;>]*)(?:;?)([^>]*)(?:>?)(.*)/;
            arrTokens = regex.exec(element);

            encrypt = arrTokens[1].trim();
            meta = arrTokens[2].trim();
            target = arrTokens[3].trim();

            regex = /(?:\()(\+|-?)(\d+)(?:\|?)(\+|-?)(\d*)(?:\))/;
            arrBuf = encrypt.match(regex);
            if (arrBuf) {
                pointVal = parseInt(arrBuf[1] + arrBuf[2]);

                if (arrBuf[4].length > 0)
                    numQuota = parseInt(arrBuf[4]);
                else
                    numQuota = 0;
            }
            else {
                pointVal = 0;
                numQuota = 0;
            }

            if (target.length > 0) {
                ListGroup.moveListItem(type, name, encrypt,
                                        target, this._s);
            }
            else {
                arrStripped.push(encrypt);

                if (!(encrypt in objItem)) {
                    objItem[encrypt] = new Element(type, name, encrypt,
                                        {
                                            _s: this._s
                                        }
                                        ).newElement(meta, pointVal, numQuota);

                    if (objFlags.hasRandomMemory) // randomized
                        objItem._arrRandomMemory.push(encrypt);
                }

                else {
                    var objElement = new Element(type, name, encrypt, { _s: this._s }).objElement;
                    objElement._meta = meta;
                    objElement._pointVal = pointVal;
                    objElement._numQuota = numQuota;

                    objItem[encrypt] = objElement;
                }

            }
        }
        objItem._arrOrder = arrStripped;
        this._s[type + "_" + name] = objItem;
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
        var s = localStorage.getObject(nameLocal);
        //var s = {};

        s._arrNames = {};

        s._arrSchedule = [];
        s._arrSePoints = {};

        s.A_Page1 = new Item('', '', { _s: s }).newItem();
        s._arrNames["Page1"] = new Names('Page1', { _s: s }).newNames('A', 'lugo');

        s.A_Page2 = new Item('', '', { _s: s }).newItem();
        s._arrNames["Page2"] = new Names('Page2', { _s: s }).newNames('A', 'lugo');

        s.A_Page3 = new Item('', '', { _s: s }).newItem();
        s._arrNames["Page3"] = new Names('Page3', { _s: s }).newNames('A', 'lugo');

        s.A_Page4 = new Item('', '', { _s: s }).newItem();
        s._arrNames["Page4"] = new Names('Page4', { _s: s }).newNames('A', 'lugo');

        s.A_Page5 = new Item('', '', { _s: s }).newItem();
        s._arrNames["Page5"] = new Names('Page5', { _s: s }).newNames('A', 'lugo');

        s.A_Page6 = new Item('', '', { _s: s }).newItem();
        s._arrNames["Page6"] = new Names('Page6', { _s: s }).newNames('A', 'lugo');

        s.A_Page7 = new Item('', '', { _s: s }).newItem();
        s._arrNames["Page7"] = new Names('Page7', { _s: s }).newNames('A', 'lugo');

        s.A_Page8 = new Item('', '', { _s: s }).newItem();
        s._arrNames["Page8"] = new Names('Page8', { _s: s }).newNames('A', 'lugo');

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


    static flipFlag(inTopItem, inItem, inFlag, nameStorage) {

        var objMyLocal = new MyLocal(nameStorage);
        var objStorage = objMyLocal.objStorage;
        var objCleanup = new Cleanup(objStorage);

        var idxFind = objStorage[inTopItem]._arrOrder.indexOf(inItem);

        var regex = /([^-]*)(?:-?)([^\:]*)(?:\:)([^>]*)(?:>?)(.*)/;
        var arrTokens = regex.exec(inItem);
        var type, flags, name, target, buf, expr, startFlags;
        type = arrTokens[1].trim();
        flags = arrTokens[2].trim();
        name = arrTokens[3].trim();
        target = arrTokens[4].trim();

        if (inFlag != "w"
            || (type == "A" && inFlag == "w")) {

            if (flags.indexOf(inFlag) > -1)
                flags = flags.replace(inFlag, "");
            else
                flags += inFlag;

            var sNewEncrypt = type + "-" + flags + ":" + name;
            objStorage[inTopItem]._arrOrder[idxFind] = sNewEncrypt;

            objStorage[inTopItem][sNewEncrypt] = new Element(type, name, sNewEncrypt,
                                {
                                    _s: objStorage
                                }
                                ).newElement();
            delete objStorage[inTopItem][inItem];

            var objMyLocal2 = new MyLocal(nameStorage, objStorage);
            objMyLocal2.checkItems(inTopItem, objStorage[inTopItem]._arrOrder);
            objStorage = objMyLocal2.objStorage;

            MyLocal.commitChanges(objStorage);
        }
    }

    //*********************************************************************************
    //*********************************************************************************

}