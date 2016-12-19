"use strict";

class Element {

    constructor(inCat, inName, inEncrypt, objMisc) {
        this._inCat = inCat;
        this._inName = inName;
        this._inEncrypt = inEncrypt;

        if (objMisc) {
            if ("_s" in objMisc)
                this._s = objMisc._s;
            else
                this._s = new MyLocal(_nameLocal).objStorage;
        }
        else {
            this._s = new MyLocal(_nameLocal).objStorage;
        }
    }

    get _cat() {
        return this._inCat;
    }

    get _name() {
        return this._inName;
    }

    get _encrypt() {
        return this._inEncrypt;
    }

    get objElement() {
        return this._s[this._inCat + "_" + this._inName][this._inEncrypt];
    }

    newElement(meta, pointVal, timeSaved) {

        if (!meta)
            meta = '';

        if (!pointVal)
            pointVal = 0;

        if (!timeSaved)
            timeSaved = 0;

        var newElement = {};

        newElement._label = this._inEncrypt;
        
        newElement._meta = meta;
        newElement._modeMove = 0;
        newElement._pointVal = pointVal;
        newElement._timeSaved = timeSaved;

        newElement._arrCount = {};

        newElement._hideButton = 0;

        return newElement;
    }
}