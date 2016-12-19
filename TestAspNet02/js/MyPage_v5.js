"use strict";

class MyPage {
    constructor(objStorage) {
        if (!objStorage)
            throw new Error("MyPage: constructor: must call with parameter objStorage")

        this._s = objStorage;
    }

    writePage(num, nameStorage) {
        var buf = [];
        var html = '';

        var hasNoTime = 0;
        var hasDetails = 0;

        var arrItems = this._s["Page" + num + "_0"]._arrOrder;
        for (var i = 0, len = arrItems.length; i < len; i++) {

            // Items: type-flags:name
            var regex = /^(\w*)(-*)(\w*)(:)(.*)$/;
            var arrTokens = regex.exec(arrItems[i]);
            var cat = arrTokens[1].trim();
            var flags = arrTokens[3].trim();
            var name = arrTokens[5].trim();
            var objFlags = new Flags(flags);

            if (cat.startsWith('rpt')) {
                var arrItems = name.split(',');
                for (var j = 0, men = arrItems.length; j < men; j++)
                    arrItems[j] = arrItems[j].trim();

                html += new Report(this._s).writeRpt(cat.substring(3), parseInt(flags), arrItems);
            }

            else if (cat == "sched") {
                html += new Schedule(this._s).writeSched(objFlags.hasDetails, objFlags.hasNoTime);
            }
            
            else {
                html += this.writeItem(cat, name, flags, nameStorage);
                }
            }
        
        return html;
    }

    writeItem(cat, name, flags, nameStorage) {

        var html = '';

        if ((cat + "_" + name) in this._s) {
            if (cat[0] == cat[0].toUpperCase()) { // group-level
                var arrItems = this._s[cat + "_" + name]._arrOrder;
                var regex = /^(\w*)(-*)(\w*)(:)(.*)$/;

                for (var j = 0, men = arrItems.length; j < men; j++) {

                    if (arrItems[j].trim().length > 0) {
                        var arrTokens = regex.exec(arrItems[j]);
                        var cat = arrTokens[1].trim();
                        var flags = arrTokens[3].trim();
                        var name = arrTokens[5].trim();

                        html += this.writeItem(cat, name, flags, nameStorage);
                    }
                }
            }
            else {
                var objFlags = new Flags(flags);

                if (objFlags.isList == 1) {
                    html += new ListGroup(cat, name, this._s).writeList(flags, nameStorage);
                }
                else {
                    html += new ButtonGroup(cat, name, this._s).writeButtons(flags, nameStorage);
                }
            }
            html += '<div class="spacer200"></div>';
        }

        return html;
    }

    static propToComboBox(objStorage, srcList) {
        if (!objStorage)
            throw new Error("propToComboBox: must have parameter objStorage")

        var html = '';
        var arrBuf = [];

        // alphabetize first
        var prop; // strict
        for (prop in objStorage)
            if (objStorage.hasOwnProperty(prop))
                arrBuf.push(prop);
        
        arrBuf = arrBuf.sort();

        if (!srcList) { // to display all contained lists
            
            for (var i = 0; i < arrBuf.length; i++)
                if (!arrBuf[i].startsWith('_')) { // reserved
                    var last2Char = arrBuf[i].substring([arrBuf[i].length - 2]);
                    if (last2Char == '_0') {
                        html += '<option value="' + arrBuf[i] + '">' + arrBuf[i].substring(0,[arrBuf[i].length - 2])  + '</option>';
                    }
                    else {
                        var idxPrefix = arrBuf[i].indexOf('_');
                        html += '<option value="' + arrBuf[i] + '">' + '&nbsp;&nbsp;-' + arrBuf[i].substring(idxPrefix+1) + '</option>';
                    }
                }
        }

        else { // to display all lists item can be moved to
            var bGroupLevel = (srcList[0] == srcList[0].toUpperCase());

            // only allow moving group level items to group-level items
            for (var i = 0; i < arrBuf.length; i++) {
                if (!arrBuf[i].startsWith("_") && arrBuf[i] != srcList) {
                    if (bGroupLevel) {
                        if (arrBuf[i][0] == arrBuf[i][0].toUpperCase())
                            html += '<option value="' + arrBuf[i] + '">' + arrBuf[i] + '</option>';
                    }
                    else {
                        if (arrBuf[i][0] == arrBuf[i][0].toLowerCase())
                            html += '<option value="' + arrBuf[i] + '">' + arrBuf[i] + '</option>';
                    }
                }
            }
        }

        return html;
    }
}