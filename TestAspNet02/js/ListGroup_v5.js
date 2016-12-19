class ListGroup {
    constructor(inCat, inName, objStorage) {
        this._inCat = inCat;
        this._inName = inName;
        this._s = objStorage;
    }

    writeList(flags, nameStorage) {
        var objItem = new Item(this._inCat, this._inName, {_s: this._s}).objItem;
        var objFlags = new Flags(flags);

        var html = '';

        // future upgrade
        //if (objFlags.isInline) {
        //    ;
        //}

        if (objFlags.hasAdd == 1) {
            html += '<section class="addElement">';

            if(this._inName == "0")
                html +='<label for="input_' + this._inCat + '_' + this._inName + '">' + this._inCat + ':</label>'
            else
                html += '<label for="input_' + this._inCat + '_' + this._inName + '">' + '>' + this._inName + ':</label>'

            html += '<div class="addElement">'
                + '<input type="text" class="addElement" name="input_' + this._inCat + "_" + this._inName + '" id="input_' + this._inCat + '_' + this._inName + '"/>'
                + ' </div>'
                + '<div class="addElement">'
                + '<button class="addElement" onclick="'
                + 'ListGroup.addElement('
                + '&quot;' + this._inCat + '&quot;,&quot;' + this._inName + '&quot;,'
                + 'document.getElementById(&quot;input_' + this._inCat + '_' + this._inName + '&quot;).value,';

            if (objFlags.hasPlusMinus == 1) {
                html += 'document.getElementById(&quot;plus_' + this._inCat + '_' + this._inName + '&quot;).value,'
                    + 'document.getElementById(&quot;minus_' + this._inCat + '_' + this._inName + '&quot;).value,'
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
                    + '<div class="sePts"><input disabled type="text" class="sePts" id="plus_' + this._inCat + '_' + this._inName + '" value="0" /></div>'
                    + '<div class="sePts"><button class="sePts" onclick="document.getElementById(&quot;plus_' + this._inCat + '_' + this._inName + '&quot;).value=parseInt(document.getElementById(&quot;plus_' + this._type + '_' + this._inName + '&quot;).value) + 1;">+</button></div>'
                    + '<div class="sePts"></div>'
                    + '<div class="sePts"></div>'
                    + '</div>'
                    + '<div class="sePtsRow">'
                    + '<div class="sePts"></div>'
                    + '<div class="sePts"></div>'
                    + '<div class="sePts"></div>'
                    + '<div class="sePts"><input disabled type="text" class="sePts" id="minus_' + this._inCat + '_' + this._inName + '" value="0"/></div>'
                    + '<div class="sePts"><button class="sePts" style="font:50px;" onclick="document.getElementById(&quot;minus_' + this._inCat + '_' + this._inName + '&quot;).value=parseInt(document.getElementById(&quot;minus_' + this._type + '_' + this._inName + '&quot;).value) + 1;">-</button></div>'
                    + '<div class="sePts"></div>'
                    + '</div>'
                    + '</div>';
            }

            html += '</section><div class="spacer25"></div>';
        }

        html += '<details';

        if (objFlags.isAlwaysOpen)
            objItem._isOpen = 1;

        if (objItem._isOpen)
            html += ' open';

        html += '><summary>';

        if (!objFlags.hasAdd)
            html += objItem._label;

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
                + this._inCat + '_' + this._inName
                + '[' + objElement._label + ']">';

            if (objFlags.hasUpDownMove == 1)
                html += '<td class="width60">' + objElement._label + '</td>';
            else
                html += '<td class="width90">' + objElement._label + '</td>';

            meta = objElement._meta;

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
                    + this._inCat + '&quot;,&quot;'
                    + this._inName + '&quot;,&quot;'
                    + objElement._label + '&quot;,&quot;'
                    + nameStorage + '&quot;);location.reload();"/></td>'
                + '<td class="listButtons"><img src="img/arrow_up.gif" '
                    + 'onclick="MyLocal.moveUpInArray(&quot;'
                    + this._inCat + '&quot;,&quot;'
                    + this._inName + '&quot;,&quot;'
                    + objElement._label + '&quot;,&quot;'
                    + nameStorage + '&quot;);location.reload();"/></td>'
                + '<td class="listButtons"><img src="img/arrow_right.gif" '
                + 'onclick="ListGroup.modeMove(&quot;'
                    + this._inCat + '&quot;,&quot;'
                    + this._inName + '&quot;,&quot;'
                    + objElement._label + '&quot;,&quot;'
                    + nameStorage + '&quot;);"></td>';

                objElement._modeMove = 0;
            }

            html += '</tr>';
        }

        html += '</table></div>';
        if (objFlags.hasTinkBox == 1) {
            html += '<textarea class="modArray" rows="15"></textarea>';
        }
        html += '</details>';

        // for moveArrayUp and moveArrayDown,
        // open once is enough--we don't want
        // it staying open every refresh
        objItem._isOpen = 0;

        MyLocal.commitChanges(this._s);

        return html;

    } // end writeList

    static addElement(inCat, inName, inEncrypt,
                        inPlus, inMinus, nameStorage) {

        var encrypt = MyLocal.removeBadChar(inEncrypt);

        var regex = /([^;]*)(?:;?)(.*)/;
        var arrTokens = regex.exec(encrypt);

        encrypt = arrTokens[1].trim();
        var meta = arrTokens[2].trim();

        var objMyLocal = new MyLocal(nameStorage);
        var objStorage = objMyLocal.objStorage;

        var objItem = new Item(inCat, inName,
                            { _s: objStorage }).objItem;

        var arrOrder = objItem._arrOrder;

        if (!(encrypt in objItem)) {
            objItem[encrypt]
                = new Element(inCat, inName, encrypt, { _s: this._s }).newElement(meta);

            objItem._arrOrder.push(encrypt);
            objItem._arrRandomMemory.push(encrypt);
        }

        objItem._isOpen = 0;
        objStorage[inCat + "_" + inName] = objItem;

////////////////////////////////////////////////////////

        var objSched = new Schedule(objStorage);
        var sDate = objSched.sDate;

        if (!(sDate in objStorage["_arrSePoints"]))
            objStorage["_arrSePoints"][sDate] = { cumPts: 0, cumTime: 0 };

        objStorage["_arrSePoints"][sDate].cumPts += inPlus - inMinus;

        var objSched = new Schedule(objStorage);
        objStorage["_arrSchedule"].push(
            objSched.newSchedItem(
                                inName,
                                inEncrypt,
                                0,
                                objStorage["_arrSePoints"][sDate].cumPts,
                                '-')
            );

////////////////////////////////////////////////////////

        MyLocal.commitChanges(objStorage);

    }

    static modeMove(inCat, inName, inEncrypt, nameStorage, inConfirm) {
        var objMyLocal = new MyLocal(nameStorage);
        var objStorage = objMyLocal.objStorage;

        var objElement = new Element(inCat, inName, inEncrypt, { _s: objStorage }).objElement;

        var html = '';
        var domRow = document.getElementById(inCat + "_" + inName
                                            + "[" + inEncrypt + "]");

        if (objElement._modeMove == 1) {

            if (inConfirm == 1) {

                var destinList;
                if (document.getElementById(inCat + "_" + inName + "[" + inEncrypt + "]_move_list").selectedIndex == undefined)
                    destinList = document.getElementById(inCat + "_" + inName + "[" + inEncrypt + "]_move_list").value;
                else
                    destinList = document.getElementById(inCat + "_" + inName + "[" + inEncrypt + "]_move_list").options[document.getElementById(inCat + "_" + inName + "[" + inEncrypt + "]_move_list").selectedIndex].text;
            
                if (destinList == "recycl") {
                    var idxFind = objStorage[inCat + "_" + inName]._arrOrder.indexOf(inEncrypt);
                    objStorage[inCat + "_" + inName]._arrOrder.splice(idxFind, 1);

                    delete objStorage[inCat + "_" + inName][inEncrypt];
                }
                else {
                    var buf, catDestin, nameDestin;

                    if(destinList.startsWith("^")) {
                        destinList = destinList.substring(1);
                        if (!((inCat + "_" + destinList) in objStorage))
                            objStorage[inCat + "_" + destinList] = new Item(inCat, destinList, { _s: objStorage }).newItem;
                        
                        catDestin = inCat;
                        nameDestin = destinList;
                    }
                    else {
                        if (destinList.indexOf("_") < 0) {
                            if (!((destinList + "_0") in objStorage))
                                objStorage[destinList + "_0"] = new Item(destinList, "0", { _s: objStorage }).newItem;                        

                            catDestin = destinList;
                            nameDestin = "0";
                        }
                        else {
                            if (!(destinList in objStorage))
                                objStorage[destinCat + "_" + destinName] = new Item(destinCat, destinName, { _s: objStorage }).newItem;

                            buf = destinList.indexOf("_");
                            catDestin = destinList.substring(0, buf);
                            nameDestin = destinList.substring(buf + 1);
                        }
                    }

                    objStorage = ListGroup.moveListItem(inCat, inName, inEncrypt,
                                                    catDestin, nameDestin, objStorage);
                }

                objStorage[inCat + "_" + inName]._isOpen = 1;
            }

            objElement._modeMove = 0;
        }

        else { // _modeMove = 0

            var domRow = document.getElementById(inCat + "_" + inName
                                                + "[" + inEncrypt + "]");

            domRow.removeChild(domRow.childNodes[1]); // remove notes
            domRow.removeChild(domRow.childNodes[1]); // remove down
            domRow.removeChild(domRow.childNodes[1]); // remove up
            domRow.removeChild(domRow.childNodes[1]); // remove right

            var domTdCreateNew = document.createElement("TD");
            domTdCreateNew.setAttribute("id", inCat + "_" + inName + "[" + inEncrypt + "]_plus_area");
            var domTdCombo = document.createElement("TD");
            domTdCombo.setAttribute("id", inCat + "_" + inName + "[" + inEncrypt + "]_move_area");
            var domTdRight = document.createElement("TD");

            domTdCreateNew.setAttribute("class", "listButtons");
            domTdRight.setAttribute("class", "listButtons");

            var domSelectProp = document.createElement("SELECT");
            domSelectProp.setAttribute("id", inCat + "_" + inName + "[" + inEncrypt + "]_move_list");
            domSelectProp.setAttribute("style", "font-size:50px");
            domSelectProp.innerHTML =
                '<option value="recycl">recycl</option>'
                + MyPage.propToComboBox(objStorage, inCat + "_" + inName);
            domTdCombo.appendChild(domSelectProp);

            var domImgRight = document.createElement("IMG");
            domImgRight.setAttribute("src", "img/arrow_right_red.gif");
            domImgRight.setAttribute("onclick",
                "ListGroup.modeMove('" + inCat + "','" + inName
                + "','" + objElement._label
                + "','" + nameStorage + "',1);location.reload();");
            domTdRight.appendChild(domImgRight);

            var domBtnCreateNew = document.createElement("BUTTON");
            domBtnCreateNew.setAttribute("class", "modArray");
            domBtnCreateNew.setAttribute("onclick",
                "document.getElementById('" + inCat + '_' + inName + "[" + inEncrypt + "]_move_list').remove();"
                + "document.getElementById('" + inCat + '_' + inName + "[" + inEncrypt + "]_move_area').innerHTML="
                + "'<input class=\"addElement\" id=\"" + inCat + "_" + inName + "[" + inEncrypt + "]_move_list\"></input>';"
                + "document.getElementById('" + inCat + '_' + inName + "[" + inEncrypt + "]_plus_area').remove();");
            domBtnCreateNew.innerHTML = '*';
            domTdCreateNew.appendChild(domBtnCreateNew);

            domRow.insertBefore(domTdCreateNew, domRow.childNodes[1]);
            domRow.insertBefore(domTdCombo, domRow.childNodes[1]);
            domRow.insertBefore(domTdRight, domRow.childNodes[1]);

            objElement._modeMove = 1;
        }

        MyLocal.commitChanges(objStorage);
    }

    static moveListItem(inCat, inName, inEncrypt, inCatDestin, inNameDestin, objStorage) {

        var objOldItem = new Item(inCat, inName,{ _s: objStorage }).objItem;

        // for the simple case of staying in same category
        var objNewItem = new Item(inCatDestin, inNameDestin,
            { _s: objStorage }).objNewItem;

        var objNewElement = new Element(inCatDestin, inNameDestin,
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

        delete objStorage[inCat + "_" + inName][inEncrypt];
        objStorage[inCatDestin + "_" + inNameDestin] = objNewItem;

        return objStorage;
    }
}