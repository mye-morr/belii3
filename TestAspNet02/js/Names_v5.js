class Names {
    constructor(inCat, inName, objMisc) {
        this._inName = inName;
        this._inCat = inCat;

        if (objMisc)
            this._s = objMisc._s;
        else
            this._s = new MyLocal(_nameLocal).objStorage;
    }

    get _flags() {
        return this._s["arrNames"][this._inCat + "_" + this._inName]._flags;
    }

    get objFlags() {
        return this._s["arrNames"][this._inCat + "_" + this._inName][this._inName]._objFlags;
    }

    get objNames() {
        return this._s["arrNames"][this._inCat + "_" + this._inName];
    }

    newNames(inFlags) {
        var newName = {};

        newName._flags = inFlags;
        newName._objFlags = new Flags(inFlags);

        return newName;
    }

}