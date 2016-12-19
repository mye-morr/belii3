"use strict";

class Item {
    constructor(inCat, inName, objMisc) {

        // either no flags, same flags, or different flags
        // ideally when different

        this._inCat = inCat;
        this._inName = inName;

        if (objMisc)
            this._s = objMisc._s;
        else
            this._s = new MyLocal(_nameLocal).objStorage;
    }
    
    get objItem() {
        return this._s[this._inCat + "_" + this._inName];
    }

    get objNewItem() {

        var newItem = {};

        newItem._label = this._inName;
        newItem._archived = 0;
        newItem._arrOrder = [];

        //////////////////////////
        var objFlags = newItem._objFlags;

        //if (objFlags.hasRandomMemory)
            newItem._arrRandomMemory = [];

        //if (objFlags.isCollapsible || objFlags.isAlwaysOpen)
            newItem._isOpen = 0;

        //if (objFlags.isSequential)
        //    if (objFlags.isRandomized)
        //        throw new Error("Item: constructor: can't be both sequential and randomized.");

        //if (objFlags.isShowJustOne)
            newItem._isShowJustOne = 1;

        return newItem;
    }
}