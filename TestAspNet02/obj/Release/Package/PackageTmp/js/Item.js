"use strict";

class Item {
    constructor(inType, inName, objMisc) {

        // either no flags, same flags, or different flags
        // ideally when different
        this._inType = inType;
        this._inName = inName;

        if (objMisc)
            this._s = objMisc._s;
        else
            this._s = new MyLocal(_nameLocal).objStorage;
    }

    get objItem() {
        if (this._inType == '')
            return this._s[this._inName];
        else
            return this._s[this._inType + "_" + this._inName];
    }

    newItem() {

        var newItem = {};

        newItem._archived = 0;
        newItem._arrOrder = [];
        newItem._arrRandomMemory = [];
        newItem._isOpen = 0;

        return newItem;
    }
}