class ListGroup {
    constructor(inName, objStorage) {
        this._inName = inName;
        this._s = objStorage;

        var objNames = new Names(inName, { _s: this._s }).objNames;
        this._type = objNames._type;
        this._flags = objNames._flags;
        this._objFlags = new Flags (this._flags);
    }

    writeList(nameStorage) {
        var objFlags = this._objFlags;
        var objItem = new Item(this._type, this._inName,
            {
                _s: this._s
            }
            ).objItem;

        var html = '';

        if (objFlags.hasAddGroup == 1) {
            html += '<section class="addElement">'
                + '<div class="addElement">'
                + '<select style="font-size:50px" id="addGroup_' + this._type + "_" + this._inName + '" id="input_' + this._type + '_' + this._inName + '"/>'
                + MyPage.propToComboBox(this._s, this._type, this._inName, undefined, 1) + '</select>'
                + '</div>'
                + '<div class="addElement">'
                + '<button class="addElement" onclick="'
                + 'ListGroup.addElement('
                + '&quot;' + this._type + '&quot;,&quot;' + this._inName + '&quot;,'
                + 'document.getElementById(&quot;addGroup_' + this._type + '_' + this._inName + '&quot;).options[document.getElementById(&quot;addGroup_' + this._type + '_' + this._inName + '&quot;).selectedIndex].value,';

            html += '0,0,&quot;' + nameStorage + '&quot;,&quot;1&quot;);'
                + 'location.reload();">Add</button></div>';

            html += '</section><div class="spacer25"></div>';
        }

        else if (objFlags.hasAdd == 1) {
            html += '<section class="addElement">'
                + '<label for="input_' + this._type + '_' + this._inName + '">' + this._inName + ':</label>'
                + '<div class="addElement">'
                + '<input type="text" class="addElement" name="input_' + this._type + "_" + this._inName + '" id="input_' + this._type + '_' + this._inName + '"/>'
                + ' </div>'
                + '<div class="addElement">'
                + '<button class="addElement" onclick="'
                + 'ListGroup.addElement('
                + '&quot;' + this._type + '&quot;,&quot;' + this._inName + '&quot;,'
                + 'document.getElementById(&quot;input_' + this._type + '_' + this._inName + '&quot;).value,';

            if (objFlags.hasPlusMinus == 1) {
                html += 'document.getElementById(&quot;plus_' + this._type + '_' + this._inName + '&quot;).value,'
                    + 'document.getElementById(&quot;minus_' + this._type + '_' + this._inName + '&quot;).value,'
            }
            else {
                html += '0,0,';
            }

            html += '&quot;' + nameStorage + '&quot;);'
                + 'location.reload();">Add</button></div>';

            if (objFlags.hasPlusMinus == 1) {
                html += '<div class="sePtsContainer">'
                    + '<div class="sePtsRow">'
                    + '<div class="sePts"></div>'
                    + '<div class="sePts"><input disabled type="text" class="sePts" id="plus_' + this._type + '_' + this._inName + '" value="0" /></div>'
                    + '<div class="sePts"><button class="sePts" onclick="document.getElementById(&quot;plus_' + this._type + '_' + this._inName + '&quot;).value=parseInt(document.getElementById(&quot;plus_' + this._type + '_' + this._inName + '&quot;).value) + 10;">+</button></div>'
                    + '<div class="sePts"></div>'
                    + '<div class="sePts"></div>'
                    + '</div>'
                    + '<div class="sePtsRow">'
                    + '<div class="sePts"></div>'
                    + '<div class="sePts"></div>'
                    + '<div class="sePts"></div>'
                    + '<div class="sePts"><input disabled type="text" class="sePts" id="minus_' + this._type + '_' + this._inName + '" value="0"/></div>'
                    + '<div class="sePts"><button class="sePts" style="font:50px;" onclick="document.getElementById(&quot;minus_' + this._type + '_' + this._inName + '&quot;).value=parseInt(document.getElementById(&quot;minus_' + this._type + '_' + this._inName + '&quot;).value) + 10;">-</button></div>'
                    + '<div class="sePts"></div>'
                    + '</div>'
                    + '</div>';
            }

            html += '</section><div class="spacer25"></div>';
        }

        html += '<details';

        if (objFlags.isAlwaysOpen)
            objItem._isOpen = 1;

        if (objItem._isOpen == 1)
            html += ' open';

        html += '><summary>';

        if (!objFlags.hasAdd)
            html += this._inName;

        html += '</summary>';
        var elements;

        var arrOrder = objItem._arrOrder;

        var arrRandom = [];
        if (objFlags.isRandomized
            && !objItem._isOpen) {
            var arrRemaining = [];

            // have to replicate arrays
            // or pass-by reference creates problem w/ later splice :-O
            if (objFlags.hasRandomMemory) {
                for (var i = 0, len = objItem._arrRandomMemory.length; i < len; i++)
                    arrRemaining.push(objItem._arrRandomMemory[i]);
            }
            else {
                for (var i = 0, len = arrOrder.length; i < len; i++)
                    arrRemaining.push(arrOrder[i]);
            }

            var numElements = arrRemaining.length;

            var idx = 0;
            for (var i = 0, len = numElements; i < len; i++) {
                idx = Math.floor(Math.random() * arrRemaining.length);
                arrRandom.push(arrRemaining[idx]);
                arrRemaining.splice(idx, 1);
            }
        }
        else { // not randomized
            arrRandom = arrOrder;
        }

        var objElement;
        var meta;
        for (var i = 0, len = arrRandom.length; i < len; i++) {
            objElement = objItem[arrRandom[i]];

            html += '<div class="spacer25"></div>';

            // lists don't have self-esteem points
            // only events do
            // buttons also have capacity to change
            // self-esteem points if options is set

            html += '<div class="modArray"><table>';
            html += '<tr class="list" id="'
                + this._type + '_' + this._inName
                + '[' + arrRandom[i] + ']">';

            if (objFlags.hasUpDownMove == 1)
                html += '<td class="width60">';
            else 
                html += '<td class="width90">';

            if ("_meta" in objElement)
                meta = objElement._meta;
            else
                meta = '';

            html += '<a ' 
                + 'onclick="ListGroup.editInPlace(&quot;'
                    + this._type + '&quot;,&quot;'
                    + this._inName + '&quot;,&quot;'
                    + arrRandom[i] + '&quot;,&quot;'
                    + meta + '&quot;,&quot;'
                    + nameStorage + '&quot;);">'
                + arrRandom[i] + '</a></td>';

            html += '<td class="listButtons"><button class="modArray" ';

            if (meta.length == 0)
                html += 'style="visibility:hidden"></button></td>';
            else
                html += 'onclick="alert(&quot;' + meta + '&quot;);">n</button></td>'

            //buttons would be distracting for list-talks etc.
            if (objFlags.hasUpDownMove == 1) {
                html += ''
                + '<td class="listButtons"><img src="img/arrow_down.gif" '
                + 'onclick="MyLocal.moveDownInArray(&quot;'
                    + this._type + '&quot;,&quot;'
                    + this._inName + '&quot;,&quot;'
                    + arrRandom[i] + '&quot;,&quot;'
                    + nameStorage + '&quot;);location.reload();"/></td>'
                + '<td class="listButtons"><img src="img/arrow_up.gif" '
                    + 'onclick="MyLocal.moveUpInArray(&quot;'
                    + this._type + '&quot;,&quot;'
                    + this._inName + '&quot;,&quot;'
                    + arrRandom[i] + '&quot;,&quot;'
                    + nameStorage + '&quot;);location.reload();"/></td>'
                + '<td class="listButtons"><img src="img/arrow_right.gif" '
                + 'onclick="ListGroup.modeMove(&quot;'
                    + this._type + '&quot;,&quot;'
                    + this._inName + '&quot;,&quot;'
                    + arrRandom[i] + '&quot;,&quot;'
                    + nameStorage + '&quot;);"></td>';
            }

            html += '</tr>';
        }

        html += '</table></div>';
        html += '</details>';

        if (objFlags.hasTinkBox == 1) {
            html += '<textarea class="modArray" rows="15"></textarea>';
        }

        // for moveArrayUp and moveArrayDown,
        // open once is enough--we don't want
        // it staying open every refresh
        objItem._isOpen = 0;

        MyLocal.commitChanges(this._s);

        return html;

    } // end writeList

    static addElement(inType, inName, inEncrypt,
                        inPlus, inMinus, nameStorage,
                        bReformatItem) {
        var encrypt = MyLocal.removeBadChar(inEncrypt);
        var objMyLocal = new MyLocal(nameStorage);
        var objStorage = objMyLocal.objStorage;

        if (bReformatItem) {
            var regex2 = /([A-Za-z0-9]*)(?:_)([A-Za-z0-9]*)(?:-*)(\w*)/;
            var arrTokens2 = regex2.exec(inEncrypt);
            var type2 = arrTokens2[1].trim();
            var name2 = arrTokens2[2].trim();
            var flags2 = arrTokens2[3].trim();

            encrypt = type2 + '-' + flags2 + ': ' + name2;
        }
            
        var regex = /([^;]*)(?:;?)(.*)/;
        var arrTokens = regex.exec(encrypt);

        encrypt = arrTokens[1].trim();
        var meta = arrTokens[2].trim();

        var objItem = new Item(inType, inName,
                            { _s: objStorage }).objItem;
        var objNames = new Names(inName, { _s: objStorage }).objNames;

        var arrOrder = objItem._arrOrder;

        if (!(encrypt in objItem)) {
            objItem[encrypt]
                = new Element(inType, inName, encrypt,
                { _s: this._s }
                ).newElement(meta);

            objItem._arrOrder.push(encrypt);
            objItem._arrRandomMemory.push(encrypt);
        }

        objItem._isOpen = 0;
        objStorage[inType + "_" + inName] = objItem;

////////////////////////////////////////////////////////

        var objSched = new Schedule(objStorage);
        var sDate = objSched.sDate;

        if (!(sDate in objStorage["_arrSePoints"]))
            objStorage["_arrSePoints"][sDate] = { cumPts: 0 };

        objStorage["_arrSePoints"][sDate].cumPts += inPlus - inMinus;

        var cumPts;
        if (inPlus - inMinus == 0)
            cumPts = '-';
        else
            cumPts = objStorage["_arrSePoints"][sDate].cumPts;

        var objSched = new Schedule(objStorage);
        objStorage["_arrSchedule"].push(
            objSched.newSchedItem(
                                inName,
                                inEncrypt,
                                0,
                                cumPts)
            );

////////////////////////////////////////////////////////

        MyLocal.commitChanges(objStorage);

    }

    static editInPlace(inType, inName, inEncrypt, inMeta, nameStorage, inConfirm) {

        if (inConfirm == 1) {
            // the altered contents will be passed through inMeta (see below)
            // includes both the encrypt and meta, which must now be reparsed
            var objMyLocal = new MyLocal(nameStorage);
            var objStorage = objMyLocal.objStorage;

            var objItem = new Item(inType, inName,
                                    { _s: objStorage }).objItem;

            var objElement = new Element(inType, inName, inEncrypt,
                                    { _s: objStorage }).objElement;

            var idxFind = inMeta.indexOf(";");
            var encrypt, meta;

            inMeta = MyLocal.removeBadChar(inMeta);

            if (idxFind >= 0) {
                encrypt = inMeta.substring(0, idxFind).trim();
                meta = inMeta.substring(idxFind + 1).trim();
            }
            else {
                encrypt = inMeta;
                meta = '';
            }

            var objNewElement = new Element(inType, inName,
                                        encrypt, { _s: objStorage }
                                        ).newElement(meta);

            // delete comes first
            // in case only the meta changed!!
            delete objItem[inEncrypt];
            objItem[encrypt] = objNewElement;

            // don't splice from arrOrder
            // because order is important
            idxFind = objItem._arrOrder.indexOf(inEncrypt);
            objItem._arrOrder[idxFind] = encrypt;
            objStorage[inType + "_" + inName] = objItem;

            // update memory if we changed an group-level (A_) item
            // which was probably done at the bottom of the page
            if (inType == "A") {
                // best thing would be MyLocal.checkItems,
                // but that would limit scope of changes to objMyLocal class
                // so we instantiate a new instance using updated objStorage
                var objMyLocal2 = new MyLocal(nameStorage, objStorage);

                // surprisingly, first arg doesn't matter here :-O
                objMyLocal2.checkItems(inType + "_" + inName, objItem._arrOrder);

                objStorage = objMyLocal2.objStorage;
            }

            // we generally want to see
            // the changes we just made
            objItem._isOpen = 1;

            MyLocal.commitChanges(objStorage);
        }

        else {
            var domRow = document.getElementById(inType + "_" + inName
                                                + "[" + inEncrypt + "]");

            domRow.removeChild(domRow.childNodes[1]); // remove notes
            domRow.removeChild(domRow.childNodes[1]); // remove down
            domRow.removeChild(domRow.childNodes[1]); // remove up
            domRow.removeChild(domRow.childNodes[1]); // remove right

            domRow.removeChild(domRow.childNodes[0]); // remove encrypt text

            var domTdInput = document.createElement("TD");
            var domTdRight = document.createElement("TD");
            domTdRight.setAttribute("class", "listButtons");

            var domInputNew = document.createElement("TEXTAREA");
            domInputNew.setAttribute("class", "editInPlace");
            domInputNew.setAttribute("id", "inputNew_" + inType + "_" + inName + "[" + inEncrypt + "]");
            domInputNew.setAttribute("rows", Math.round((inEncrypt.length + inMeta.length) / 22));

            if(inMeta.length > 0)
                domInputNew.innerHTML = inEncrypt + '; ' + inMeta;
            else
                domInputNew.innerHTML = inEncrypt;

            domTdInput.appendChild(domInputNew);

            var domImgRight = document.createElement("IMG");
            domImgRight.setAttribute("src", "img/arrow_right_red.gif");
            domImgRight.setAttribute("onclick",
                "ListGroup.editInPlace('" + inType + "','" + inName
                + "','"+ inEncrypt +"', document.getElementById('inputNew_" + inType + "_" + inName + "[" + inEncrypt + "]').value"
                + ",'" + nameStorage + "',1);location.reload();");
            domTdRight.appendChild(domImgRight);

            domRow.insertBefore(domTdInput, domRow.childNodes[1]);
            domRow.insertBefore(domTdRight, domRow.childNodes[1]);
        }
    }

    static modeMove(inType, inName, inEncrypt, nameStorage, inConfirm) {
        var objMyLocal = new MyLocal(nameStorage);
        var objStorage = objMyLocal.objStorage;

        var objElement = new Element(inType, inName, inEncrypt,
                                { _s: objStorage }).objElement;

        var html = '';
        var domRow = document.getElementById(inType + "_" + inName
                                            + "[" + inEncrypt + "]");
        var idxFind, nameDestin;

        if (inConfirm == 1) {
            var destinList = document.getElementById('moveList_' + inType + '_' + inName + '[' + inEncrypt + ']').options[document.getElementById('moveList_' + inType + '_' + inName + '[' + inEncrypt + ']').selectedIndex].text;

            if (destinList == "recycl") {
                idxFind = objStorage[inType + "_" + inName]._arrOrder.indexOf(inEncrypt);
                objStorage[inType + "_" + inName]._arrOrder.splice(idxFind, 1);

                idxFind = objStorage[inType + "_" + inName]._arrRandomMemory.indexOf(inEncrypt);
                objStorage[inType + "_" + inName]._arrRandomMemory.splice(idxFind, 1);

                delete objStorage[inType + "_" + inName][inEncrypt];
            }

            else if (destinList == "top") {
                idxFind = objStorage[inType + "_" + inName]._arrOrder.indexOf(inEncrypt);
                objStorage[inType + "_" + inName]._arrOrder.splice(0, 0,
                    objStorage[inType + "_" + inName]._arrOrder.splice(idxFind, 1)[0]);

            }

            else {
                idxFind = destinList.indexOf('_');
                nameDestin = destinList.substring(idxFind + 1);

                objStorage = ListGroup.moveListItem(inType, inName, inEncrypt,
                    nameDestin, objStorage);
            }

            objStorage[inType + "_" + inName]._isOpen = 1;

        }

        else {

            var domRow = document.getElementById(inType + "_" + inName
                                                + "[" + inEncrypt + "]");

            domRow.removeChild(domRow.childNodes[1]); // remove notes
            domRow.removeChild(domRow.childNodes[1]); // remove down
            domRow.removeChild(domRow.childNodes[1]); // remove up
            domRow.removeChild(domRow.childNodes[1]); // remove right

            // remove and rewrite link as a non-link
            // this is because its easy to accidentally click
            // the side of the text when trying to push the red arrow
            // which would result in a failed state (no buttons at all)

            domRow.removeChild(domRow.childNodes[0]); // remove encrypt text

            var domTdCombo = document.createElement("TD");
            var domTdRight = document.createElement("TD");
            domTdRight.setAttribute("class", "listButtons");

            var domTdEncrypt = document.createElement("TD");
            domTdEncrypt.setAttribute("class", "width60")

            var domTextEncrypt = document.createTextNode(inEncrypt);
            domTdEncrypt.appendChild(domTextEncrypt);

            var domSelectProp = document.createElement("SELECT");
            domSelectProp.setAttribute("id", "moveList_" + inType + "_" + inName + "[" + inEncrypt + "]");
            domSelectProp.setAttribute("style", "font-size:50px");
            domSelectProp.innerHTML =
                '<option value="recycl">recycl</option>'
                + '<option value="top">top</option>'
                + MyPage.propToComboBox(objStorage, inType, inName, inEncrypt);
            domTdCombo.appendChild(domSelectProp);

            var domImgRight = document.createElement("IMG");
            domImgRight.setAttribute("src", "img/arrow_right_red.gif");
            domImgRight.setAttribute("onclick",
                "ListGroup.modeMove('" + inType + "','" + inName
                + "','" + inEncrypt
                + "','" + nameStorage + "',1);location.reload();");
            domTdRight.appendChild(domImgRight);

            domRow.insertBefore(domTdEncrypt, domRow.childNodes[1]);
            domRow.insertBefore(domTdCombo, domRow.childNodes[1]);
            domRow.insertBefore(domTdRight, domRow.childNodes[1]);
        }

        MyLocal.commitChanges(objStorage);
    }

    static moveListItem(inType, inName, inEncrypt, inNameDestin, objStorage) {

        var objOldItem = new Item(inType, inName,
            { _s: objStorage }).objItem;

        var objNames = new Names(inNameDestin, { _s: objStorage }).objNames;

        var objNewItem = new Item(objNames._type, inNameDestin,
            { _s: objStorage }).objItem;

        var objNewElement = new Element(objNames._type, inNameDestin,
                                    inEncrypt, {_s: objStorage }
                                    ).newElement();

        var prop; // strict
        for (prop in objNewElement)
            if (prop in objOldItem[inEncrypt])
                objNewElement[prop] = objOldItem[inEncrypt][prop];

        objNewItem[inEncrypt] = objNewElement;
        objNewItem._arrOrder.push(inEncrypt);

        var idxFind = objOldItem._arrOrder.indexOf(inEncrypt);
        objOldItem._arrOrder.splice(idxFind, 1);

        delete objStorage[inType+"_"+inName][inEncrypt];
        objStorage[objNames._type + "_" + inNameDestin] = objNewItem;

        return objStorage;
    }
}