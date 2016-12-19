//*********************************************************************************
//*********************************************************************************

function unhideButtons(inName, nameStorage) {
    var objMyLocal = new MyLocal(nameStorage);
    var objStorage = objMyLocal.objStorage;

    var objNames = new Names(inName,
        {
            _s: objStorage
        }
        ).objNames;
    var type = objNames._type;

    var objItem = new Item(type, inName,
        {
            _s: objStorage
        }
        ).objItem;

    var arrOrder = objItem._arrOrder;
    for (var i = 0, len = arrOrder.length; i < len; i++)
        objItem[arrOrder[i]]._hideButton = 0;

    objItem._isOpen = 0;
    MyLocal.commitChanges(objStorage);
}

//*********************************************************************************
//*********************************************************************************

function sGenericFeedback() {
    return 'nice';
}

//*********************************************************************************
//*********************************************************************************

function pad2(iDigit) {
    if (iDigit < 10)
        return "0" + iDigit;
    else
        return iDigit;
}

//*****************************************************************
//*****************************************************************

function contentsToStr(num, objStorage) {
    var str = '';

    var arrItems = objStorage['Page' + num + '_0']._arrOrder;

    for (var i = 0, len = arrItems.length; i < len; i++) {
        if (arrItems[i].startsWith('rpt')) {
            var buf = arrItems[i].indexOf('-');
            str += "&nbsp;|&nbsp;" + arrItems[i].substring(3, buf);
        }
        else {
            var arrBuf = arrItems[i].split(':');
            if (arrBuf[1].trim() == "0") {
                arrBuf = arrBuf[0].split('-');
                str += "&nbsp;|&nbsp;" + arrBuf[0].trim();
            }
            else {
                str += "&nbsp;|&nbsp;" + '>' + arrBuf[1].trim();
            }
        }
    }

    // remove first divider
    return str.substring(13);
}

//*****************************************************************
//*****************************************************************


/************************
*************************
    Transform Arrays
*************************
*************************/

function modArray_pull(inMember, nameStorage) {
    var objStorage = new MyLocal(nameStorage).objStorage;

    var arr;

    var sText = '';
    var sMeta = '';

    if (inMember[0] == inMember[0].toUpperCase()) {
        arr = objStorage[inMember]._arrOrder;

        for (var i = 0; i < arr.length; i++)
            sText += '\n' + arr[i];
    }

    else {
        arr = objStorage[inMember]._arrOrder;

        for (var i = 0; i < arr.length; i++) {
            sText += '\n' + arr[i];

            sMeta = objStorage[inMember][arr[i]]._meta;
            if (sMeta.length > 0)
                sText += '; ' + sMeta;
        }
    }

    document.getElementById('modArray').value = sText.substring(1);
}

//*********************************************************************************
//*********************************************************************************

function modArray_push(inMember, nameStorage) {

    var inArray = document.getElementById('modArray').value.split(/\n/);

    var mylocal = new MyLocal(nameStorage);

    if (inMember[0] == inMember[0].toUpperCase())
        mylocal.reoItems(inMember, inArray);
    else
        mylocal.reoElements(inMember, inArray);
}