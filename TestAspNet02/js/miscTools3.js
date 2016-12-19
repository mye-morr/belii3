//*********************************************************************************
//*********************************************************************************

function unhideButtons(inName, nameStorage) {
    var objMyLocal = new MyLocal(nameStorage);
    var objStorage = objMyLocal.objStorage;

    var objSched = new Schedule(objStorage);
    var sDate = objSched.sDate;

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
    for (var i = 0, len = arrOrder.length; i < len; i++) {
        objItem[arrOrder[i]]._hideButton = 0;

        if (sDate in objItem[arrOrder[i]]._arrCount)
            objItem[arrOrder[i]]._arrCount[sDate].remaining = objItem[arrOrder[i]]._numQuota;
    }

    objItem._isOpen = 0;
    MyLocal.commitChanges(objStorage);
}

//*********************************************************************************
//*********************************************************************************

function sGenericFeedback() {
    var sCompliments =
        ['nice',
            'good work',
            'cool',
            'nice job',
            'fantastic',
            'great work',
            'super',
            'good job',
            'well done',
            'great',
            'sweet',
            'very good',
            'good',
            'awesome',
            'terrific'
        ];

    var idx = Math.floor(Math.random() * sCompliments.length);
    return sCompliments[idx];
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

function contentsToStr(num, nameStorage, objStorage) {
    var buf = 0;
    var str = '';
    var elements;
    var arrItems = objStorage['A_Page' + num]._arrOrder;

    var member, arrTokens, type, flags, name, target;

    for (var i = 0, len = arrItems.length; i < len; i++) {
        if (arrItems[i].startsWith('rpt')) {
            buf = arrItems[i].indexOf('-');
            str += "&nbsp;|&nbsp;" + arrItems[i].substring(3,buf);
        }

        else if (arrItems[i].startsWith('pts')) {
            ;
        }

        else if (arrItems[i].startsWith('A-')) {

            str += "&nbsp;|&nbsp;"
                + '<a href="" style="text-decoration:underline;" '
                + 'onclick="MyLocal.flipFlag(&quot;'
                + 'A_Page' + num + '&quot;,&quot;'
                + arrItems[i] + '&quot;,&quot;'
                + 'w' + '&quot;,&quot;'
                + nameStorage + '&quot;);location.reload();">'
                + arrItems[i].split(':')[1] + '</a></td>';
        }

        else {
            str += "&nbsp;|&nbsp;"
                + arrItems[i].split(':')[1];
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

    if (inMember.startsWith('arrItems'))
        arr = objStorage[inMember];
    else
        arr = objStorage[inMember]._arrOrder;

    for (var i = 0; i < arr.length; i++) {
        sText += '\n' + arr[i];

        if (!(inMember.startsWith('arrItems')
            || inMember.startsWith('A_'))) {
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

    mylocal.reoElements(inMember, inArray);
}