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

        var objNewItem = new Item(inNewType, inName, { _s: this._s }).newItem();
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
        var objFlags = new Flags(inNewFlags);

        // reset random memory, not for lists!! (save space)
        if (objFlags.isList)
            objNewItem._arrRandomMemory = [];
        else
            objNewItem._arrRandomMemory = objNewItem._arrOrder;

        // instead of copying element objects,
        // create new elements and copy their properties
        var arrOrder = objNewItem._arrOrder;
        var prop; // strict

        // ideally want to prevent extra properties for lists
        // but there's the chance users will want to convert
        // buttons to lists and back, in which case, all must stay
        for (var i = 0, len = arrOrder.length; i < len; i++) {
            objNewItem[arrOrder[i]] =
                new Element(inNewType, inName, arrOrder[i],
                    { _s: this._s }).newElement();

            for (prop in objNewItem[arrOrder[i]]) {
                if (prop in objOldItem[arrOrder[i]]) {
                    objNewItem[arrOrder[i]][prop]
                        = objOldItem[arrOrder[i]][prop];
                }
            }
        }

        delete this._s[inOldType + "_" + inName];
        this._s[inNewType + "_" + inName] = objNewItem;

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
        if (!inProp.startsWith('A_Page')) {
            var buf = inProp.indexOf('_');
            var type, name, item;

            if (buf >= 0) {
                type = inProp.substring(0, buf);
                name = inProp.substring(buf + 1).split('-')[0];
                item = type + "_" + name;
            }
            else {
                name = inProp.substring(buf + 1).split('-')[0];
                item = name; // eg. arrItems (legacy)
            }

            var objStorage = new MyLocal(nameStorage).objStorage;
            delete objStorage[item];
            delete objStorage["_arrNames"][name];
            MyLocal.commitChanges(objStorage);
        }
    }

    portLegacy3() {
        var buf, sName, arrOrder, objNames;

        var item, prop, element;
        for (item in this._s) {

            if (item.startsWith('_')) { // reserved
                ;
            }

            else { // these are the items                
                for (prop in this._s[item]) {
                    if (this._s[item].hasOwnProperty(prop)
                        && !prop.startsWith("_")) {

                        buf = item.indexOf("_");
                        sName = item.substring(buf + 1);

                        var objNames = new Names(sName).objNames;

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

        delete mystorage["_arrSchedule"];

        mystorage["_arrSchedule"] = [];

        localStorage.setObject(nameStorage, mystorage);
    }
}