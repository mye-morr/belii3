"use strict";

class Element {

    constructor(inType, inName, inEncrypt, objMisc) {
        this._inType = inType;
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

    get _type() {
        return this._inType;
    }

    get _name() {
        return this._inName;
    }

    get _encrypt() {
        return this._inEncrypt;
    }

    get objElement() {
        if (this._inType == '')
            return this._s[this._inName][this._inEncrypt];
        else
            return this._s[this._inType + "_" + this._inName][this._inEncrypt];
    }

    newElement(meta, pointVal, numQuota) {

        if (!meta)
            meta = '';

        if (!pointVal)
            pointVal = 0;

        if (!numQuota)
            numQuota = 0;

        var newElement = {};
        
        newElement._meta = meta;

        // generally only work for buttons
        // but will be used for lists as well
        // when users want to manage buttons
        // by converting to lists and back
        newElement._pointVal = pointVal;
        newElement._numQuota = numQuota;
        newElement._arrCount = {};
        newElement._hideButton = 0;

        return newElement;
    }
}