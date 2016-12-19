class Cleanup {
    constructor(objStorage) {
        if (!objStorage)
            throw new Error("Cleanup: constructor: must call with parameter objStorage")

        this._s = objStorage;
    }

    // get data from all elements
    // with corresponding properties
    // for new style of object

    //!!! should really be returning just the item
    //!!! to minimize memory access :-\
    copyItem(inName, inOldType, inNewType,
            inOldFlags, inNewFlags) {

        var objNewItem = new Item(inNewType, inName, { _s: this._s }).newItem(inNewFlags);
        var objOldItem = this._s[inOldType + "_" + inName];

        var propsOldItem = this.arrNonFlagProperties(objOldItem);
        // excluding flag items and element objects
        for (var i = 0, len = propsOldItem.length; i < len; i++)
            if (propsOldItem[i] in objNewItem)
                objNewItem[propsOldItem[i]] =
                    objOldItem[propsOldItem[i]];

        // both flag items inFlags and objFlags
        // are already in objNewItem thanks to
        // the above constructor: this.newItem
        var objFlags = objNewItem._objFlags;

        // instead of copying element objects,
        // create new elements and copy their properties
        var arrOrder = objNewItem._arrOrder;
        var prop; // strict
        for (var i = 0, len = arrOrder.length; i < len; i++) {
            objNewItem[arrOrder[i]] =
                new Element(inNewType, inName, arrOrder[i],
                    { _s: this._s }).newElement(objFlags);

            for (prop in objNewItem[arrOrder[i]])
                if (prop in objOldItem[arrOrder[i]])
                    objNewItem[arrOrder[i]][prop]
                        = objOldItem[arrOrder[i]][prop];
        }

        delete this._s[inOldType + "_" + inName];
        this._s[inNewType + "_" + inName] = objNewItem;

        this._s["arrNames"][inName]._type = inNewType;
        this._s["arrNames"][inName]._item = inNewType + "_" + inName;
        this._s["arrNames"][inName]._flags = inNewFlags;
        this._s["arrNames"][inName]._objFlags = new Flags(inNewFlags);

        return this._s;
    }

    arrNonFlagProperties(objItem) {
        var arrReturn = [];
        var prop;

        for (prop in objItem)
            if (objItem.hasOwnProperty(prop)
                && prop.indexOf('Flags') < 0 // flags have changed
                && prop.indexOf('flags') < 0
                && prop.startsWith("_")) // elements copied later
                arrReturn.push(prop);

        return arrReturn;
    }

    static delProperty(nameStorage, inProp) {
        if (!inProp.startsWith('arr')) {
            var regex = /^([A-Za-z0-9]*)(?:_)([A-Za-z0-9]*)(?:-*)(\w*)$/;
            var arrTokens = regex.exec(inProp);

            var objStorage = new MyLocal(nameStorage).objStorage;
            delete objStorage[arrTokens[1] + "_" + arrTokens[2]];
            MyLocal.commitChanges(objStorage);
        }
    }

    portLegacy3() {
        var buf, sName, arrOrder, objNames;

        var item, prop, element;
        for (item in this._s) {

            if (item.startsWith('arr')) { // reserved
                ;
            }

            else if (item.startsWith('z')) { // legacy
                ;
            }

            else { // these are the items                
                for (prop in this._s[item]) {
                    if (this._s[item].hasOwnProperty(prop)
                        && !prop.startsWith("_")) {

                        buf = item.indexOf("_");
                        sName = item.substring(buf + 1);

                        objNames = this._s["arrNames"][sName];

                        this._s = this.copyItem(sName, objNames._type, objNames._type,
                                        objNames._flags, objNames._flags);                        
                    }
                }
            }
        }

        return this._s;
    }

    static wipeSched(nameStorage) {
        var mystorage = localStorage.getObject(nameStorage);

        delete mystorage["arrSchedule"];
        mystorage.arrSchedule = [];

        localStorage.setObject(nameStorage, mystorage);
    }
}


//static copyOverLegacy(oldNameStorage, newNameStorage) {
//    var objOldStorage = new MyLocal(oldNameStorage).objStorage;
//    var objNewStorage = new MyLocal(newNameStorage).objStorage;

//    var prop;
//    for (prop in objOldStorage) {
//        if (objOldStorage.hasOwnProperty(prop)
//            && !prop.startsWith("arr")
//            && prop != "_isOpen") {

//            var arrOrder = objOldStorage[prop].arrElements;
//            objNewStorage['z' + prop] = {};
//            objNewStorage['z' + prop]._arrOrder = arrOrder;
//            objNewStorage['z' + prop]._flags = '';

//            for (var i = 0, len = arrOrder.length; i < len; i++) {
//                objNewStorage['z' + prop][arrOrder[i]] = {};
//                objNewStorage['z' + prop][arrOrder[i]]._meta = '';

//                if (objOldStorage[prop][arrOrder[i]].notes.length > 0)
//                    objNewStorage['z' + prop][arrOrder[i]]._meta =
//                        objOldStorage[prop][arrOrder[i]].notes;

//                if (objOldStorage[prop][arrOrder[i]].warning.length > 0)
//                    objNewStorage['z' + prop][arrOrder[i]]._meta =
//                        objOldStorage[prop][arrOrder[i]].warning;

//            }
//        }
//    }
//    localStorage.setObject('mystorage3', objNewStorage);
//}

//static purgeLegacy(nameStorage) {
//    var objNewStorage = new MyLocal(nameStorage).objStorage;

//    var prop;
//    for (prop in objNewStorage) {
//        if (objNewStorage.hasOwnProperty(prop)
//            && !prop.startsWith("arr")
//            && prop != "_isOpen") {

//            if (prop.startsWith("z"))
//                delete objNewStorage[prop];
//        }
//    }

//    localStorage.setObject(nameStorage, objNewStorage);
//}