class Names {
    constructor(inName, objMisc) {
        this._inName = inName;

        if (objMisc)
            this._s = objMisc._s;
        else
            this._s = new MyLocal(_nameLocal).objStorage;
    }

    get _type() {
        return this._s["_arrNames"][this._inName]._type;
    }

    get _item() {
        return this._s["_arrNames"][this._inName]._item;
    }

    get _flags() {
        return this._s["_arrNames"][this._inName]._flags;
    }

    get objNames() {
        return this._s["_arrNames"][this._inName];
    }

    newNames(inType, inFlags) {
        var newName = {};

        newName._type = inType;
        newName._item = inType + "_" + this._inName;
        newName._flags = inFlags;

        return newName;
    }
}