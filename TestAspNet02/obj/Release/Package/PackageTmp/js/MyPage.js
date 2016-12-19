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

        var arrItems = this._s["A_Page" + num]._arrOrder;
        for (var i = 0, len = arrItems.length; i < len; i++) {

            // Items: type-flags:name
            var regex = /^(\w*)(-*)(\w*)(:)(.*)$/;
            var arrTokens = regex.exec(arrItems[i]);
            var type = arrTokens[1].trim();
            var flags = arrTokens[3].trim();
            var name = arrTokens[5].trim();

            html += this.writeItem(type, name, flags, nameStorage);

                /*
                    // either a ButtonGroup or a ListGroup
                    if (inType == 'ah') { // annoy-habit
                    else if (inType == 'bd') { // brain-dump
                    else if (inType == 'cj') { // contact-jogger
                    else if (inType == 'fc') { // flash-cards
                    else if (inType == 'hc') { // habit-counter
                    else if (inType == 'lt') { // list-talk
                    else if (inType == 'rt') { // resolv-talk
                    else if (inType == 'ta') { // talk-away
                    else if (inType == 'wl') { // walk-list
                    else if (inType == 'sched') { // sched-log
                    else if (inType == 'rpt') { // metrics report
                    */
            }
        
        return html;
    }

    writePageArray(num, nameStorage) {
        var html = '';
        html += this.writeItem('A', 'Page' + num, 'w', nameStorage);
        html += '<div class="spacer200"></div>';
        return html;
    }

    writeItem(type, name, flags, nameStorage) {
        var objFlags = new Flags(flags);

        var html = '';

        if (type=="A" && objFlags.writeGroup==0) {
            if ("A_" + name in this._s) {
                var arrItems2 = this._s["A_" + name]._arrOrder;

                var regex2 = /^(\w*)(-*)(\w*)(:)(.*)$/;

                for (var j = 0, men = arrItems2.length; j < men; j++) {
                    if (arrItems2[j].trim().length > 0) {
                        var arrTokens2 = regex2.exec(arrItems2[j]);
                        var type2 = arrTokens2[1].trim();
                        var flags2 = arrTokens2[3].trim();
                        var name2 = arrTokens2[5].trim();

                        html += this.writeItem(type2, name2, flags2, nameStorage);
                    }
                }                
            }
        }

        else if (objFlags.writeGroup == 1) {
            html += new ListGroup(name, this._s).writeList(nameStorage);
            html += '<div class="spacer200"></div>';
        }

        else if (type.startsWith('rpt')) {
            var arrNames = name.split(',');
            for (var k = 0, nen = arrNames.length; k < nen; k++)
                arrNames[k] = arrNames[k].trim();

            html += new Report(this._s).writeRpt(type.substring(3), parseInt(flags), arrNames);
        }

        else if (type == "pts") {
            html += new Report(this._s).writePts();
        }

        else if (type == "sched") {
            html += new Schedule(this._s).writeSched(objFlags.hasDetails, objFlags.hasNoTime);
        }

        else if (type == "gent") {
            html += '<textarea class="modArray" rows="15"></textarea><div class="spacer200"></div>';
        }

        else {
            if (name in this._s["_arrNames"]) {
                if(objFlags.isList==1)
                    html += new ListGroup(name, this._s).writeList(nameStorage);
                else
                    html += new ButtonGroup(name, this._s).writeButtons(nameStorage);

                html += '<div class="spacer200"></div>';
            }
        }

        return html;
    }

    static propToComboBox(objStorage, srcType, srcName, srcEncrypt, bAddGroup) {
        if (!objStorage)
            throw new Error("propToComboBox: must have parameter objStorage")

        var html = '';
        var arrBuf = [];

        // alphabetize first
        var prop; // strict
        for (prop in objStorage)
            if(objStorage.hasOwnProperty(prop))
                arrBuf.push(prop);

        arrBuf = arrBuf.sort();

        var flags = '';

        var sName, objNames;

        if (bAddGroup) {
            for (var i = 0; i < arrBuf.length; i++) {
                sName = arrBuf[i].substring(arrBuf[i].indexOf("_") + 1);
                objNames = new Names(sName, { _s: objStorage }).objNames;
                flags = '';
                if (objNames != undefined)
                    if ("_flags" in objNames)
                        flags = objNames._flags;

                if (!arrBuf[i].startsWith("A_Page")
                    && !arrBuf[i].startsWith("_")) {
                    if (flags.length > 0)
                        html += '<option value="' + arrBuf[i] + '-' + flags + '">' + arrBuf[i] + '-' + flags + '</option>';
                    else
                        html += '<option value="' + arrBuf[i] + '">' + arrBuf[i] + '</option>';
                }
            }
        }

        else if (srcType) { // to display all lists item can be moved to

            if (srcType == 'A') { // group-level only
                // loop structures dangerous for JSON
                var buf = srcEncrypt.indexOf(':');
                var name = srcEncrypt.substring(buf+1).trim();

                for (var i = 0; i < arrBuf.length; i++) {
                    if (!arrBuf[i].startsWith("A_Page")
                        && arrBuf[i].startsWith("A_")
                        && arrBuf[i] != srcType + "_" + srcName
                        && arrBuf[i].indexOf('_' + name) < 0) {
                        html += '<option value="' + arrBuf[i] + '">' + arrBuf[i] + '</option>';
                    }
                }
            }

            else { // item-level only
                for (var i = 0; i < arrBuf.length; i++) {
                    if (!arrBuf[i].startsWith("_arr")
                        && !arrBuf[i].startsWith("A_")
                        && arrBuf[i] != srcType + "_" + srcName) { // reserved
                        html += '<option value="' + arrBuf[i] + '">' + arrBuf[i] + '</option>';
                    }
                }
            }
        }

        else { // to display possible contents for modArray

            for (var i = 0; i < arrBuf.length; i++) {
                flags = '';

                if (arrBuf[i].startsWith('_arr')) { // reserved
                    ;
                }
                else {
                    sName = arrBuf[i].substring(arrBuf[i].indexOf("_") + 1);
                    objNames = new Names(sName, { _s: objStorage }).objNames;

                    flags = '';
                    if (objNames != undefined)
                        if ("_flags" in objNames)
                            flags = objNames._flags;

                    if (flags.length > 0 && !arrBuf[i].startsWith('A_'))
                        html += '<option value="' + arrBuf[i] + '">'
                            + arrBuf[i] + '-' + flags + '</option>';
                    else
                        html += '<option value="' + arrBuf[i] + '">'
                            + arrBuf[i] + '</option>';
                }
            }
        }

        return html;
    }
}