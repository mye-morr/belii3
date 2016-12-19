function mylocal() { }

/***************
    Contents
****************/

function setLocalStorage() {
    var mystorage = new mylocal();
    mystorage.arrElements1 = [];
    mystorage.arrElements2 = [];
    mystorage.arrElements3 = [];
    mystorage.arrElements4 = [];
    mystorage.arrElements5 = [];
    mystorage.arrElements6 = [];
    mystorage.arrElements7 = [];
    mystorage.arrElements8 = [];
    mystorage.arrSchedule = [];
    localStorage.setObject('mystorage', mystorage);
}

function checkList(inType, isTalk) {
    if (typeof (isTalk) === 'undefined') isTalk = 0;

    var mystorage = localStorage.getObject('mystorage');

    if (isTalk) {
        if (!(("lt_" + inType) in mystorage)) {
            eval("mystorage.lt_" + inType + "=[];");
            mystorage.arrElements5.push('lt:' + inType);
            localStorage.setObject('mystorage', mystorage);
        }
    }
    else {
        if (!(("list_" + inType) in mystorage)) {
            eval("mystorage.list_" + inType + "=[];");
            mystorage.arrElements5.push('l:' + inType);
            localStorage.setObject('mystorage', mystorage);
        }
    }
}

function checkButtonGroup(inType) {
    var mystorage = localStorage.getObject('mystorage');

    if (!(("bg_" + inType) in mystorage)) {
        eval("mystorage.bg_" + inType + "={ arrOrder:[] };");
        mystorage.arrElements5.push('bg:' + inType);
        localStorage.setObject('mystorage', mystorage);
    }
}

function reOrderButtons(inType, inArray) {
    var mystorage = localStorage.getObject('mystorage');
    var buttons = inArray;

    if (("bg_" + inType) in mystorage) {
        for (var i = 0; i < buttons.length; i++) {

            // make sure the button exists
            if (!(buttons[i] in eval("mystorage.bg_" + inType))) {
                eval("mystorage.bg_" + inType + "['" + buttons[i] + "']={count:0};");
            }
        }

        eval("mystorage.bg_" + inType + ".arrOrder=buttons;");
        localStorage.setObject('mystorage', mystorage);
    }
}

/***************
    Schedule
****************/

function mysched() { };

function objSched(inType, inEvent, inDesc, inNotes) {

    var sched = new mysched();

    var d = new Date();
    var sTime = pad2(d.getMonth()+1) + '/' + pad2(d.getDate())
        + ', ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes());

    sched.type = inType;
    sched.time = sTime;
    sched.event = inEvent;
    sched.desc = inDesc;
    sched.notes = inNotes;

    return sched;
}

function pad2(iDigit) {
    if (iDigit < 10)
        return "0" + iDigit;
    else
        return iDigit;
}

/***************
    Interact
****************/

function pushButton(inType, inContent) {
    var mystorage = localStorage.getObject('mystorage');

    eval("mystorage.bg_" + inType + "['" + inContent + "'].count++;");
    eval("mystorage.arrSchedule.push(objSched('button',inType,inContent,''));")

    localStorage.setObject('mystorage', mystorage);
}

function addToList(inType, inContent) {
    var mystorage = localStorage.getObject('mystorage');

    eval("mystorage.list_" + inType + ".push('" + inContent + "');");
    eval("mystorage.arrSchedule.push(objSched('list',inType,inContent,''));")

    localStorage.setObject('mystorage', mystorage);
}

function addToSched(inEvent, inDesc, inNotes) {
    var mystorage = localStorage.getObject('mystorage');
    eval("mystorage.arrSchedule.push(objSched('sched',inEvent,inDesc,inNotes));")

    localStorage.setObject('mystorage', mystorage);
}

function setArray(inMember, inArray) {
    var mystorage = localStorage.getObject('mystorage');
    eval("mystorage." + inMember + "=inArray;");
    localStorage.setObject('mystorage', mystorage);
}

function wipeSched() {
    var mystorage = localStorage.getObject('mystorage');
    mystorage.arrSchedule = [];
    localStorage.setObject('mystorage', mystorage);
}

function delProperty(inProp) {
    var mystorage = localStorage.getObject('mystorage');

    // even though deleted from variable
    // it stays in the arrElementsN inactively
    // a bug would happen if we reuse the same name
    // as a previously deleted list or button-group
    // so manual deletes would be good
    eval("delete mystorage." + inProp + ";");

    localStorage.setObject('mystorage', mystorage);
}

/*****************
    writePage
******************/

function writeList(inList, isTalk) {

    var prefix = '';

    if (typeof (isTalk) === 'undefined') {
        isTalk = 0;
        prefix = 'list_';
    }
    else {
        isTalk = 1;
        prefix = 'lt_';
    }

    var html = '';

    var mystorage = localStorage.getObject('mystorage');
    var list;

    // may have been deleted!
    if ((prefix + inList) in mystorage) {

        html += '<div class="buttonspacer"></div>';

        if (isTalk==0) {
            html += '<label for=' + prefix + inList + '">' + inList + ': </label>';
            html += '<input type="text" style="font-size: 50px" name=' + prefix + inList + '" id="in_' + inList + '"/>';
            html += '<button style="font-size:50px" onclick="addToList(&quot;'
                    + inList + '&quot;,document.getElementById(&quot;in_'
                    + inList + '&quot;).value);location.reload();">Add</button>';
        }

        html += '<div style="height:25px"></div>';
        html += '<details><summary>' + inList + '</summary>';

        eval("list=mystorage." + prefix + inList + ";");

        html += '<div style="height:25px"></div>';
        html += '<div style="padding-left:25px;font-size:40px;">';
        for (var i = 0; i < list.length; i++) {
            html += list[i] + '<br/>';
        }

        html += '</div></details>';
    }

    return html;
}

function writeButtons(inButtonGroup) {

    var html = '';

    var mystorage = localStorage.getObject('mystorage');
    var buttons;

    // may have been deleted!
    if (("bg_" + inButtonGroup) in mystorage) {

        html += '<div class="buttonspacer"></div>';

        eval("buttons=mystorage.bg_" + inButtonGroup + ".arrOrder;");
        for (var i = 0; i < buttons.length; i++) {
            html +=
                '<button class="st" '
                + 'onclick="pushButton('
                    + "'" + inButtonGroup + "',"
                    + "'" + buttons[i] + "'" + ");\">"
                + buttons[i] + "</button>";
        }

    }
    return html;
}

function writeButtonCounts() {
    var html = '<div class="buttonspacer"></div>';


}

function writeSchedule(option) {
    var html = '<div class="buttonspacer"></div>';

    var mystorage = localStorage.getObject('mystorage');
    var schedule = mystorage.arrSchedule;

    html += '<details><summary>schedule</summary><table class="schedule">'

    for (var i = 0; i < schedule.length; i++) {
        if (!((schedule[i].type == 'list') && (option < 2))) {
            html += '<tr class="schedule">';

            if (option > 0) {
                html += '<td class="schedule">'
                        + schedule[i].type + '</td>'
            }

            html += '<td class="schedule">'
                    + schedule[i].time + '</td>'
                    + '<td class="schedule">'
                    + schedule[i].event + '</td>'
                    + '<td class="schedule">'
                    + schedule[i].desc + '</td>'
                    + '<td class="schedule">'
                    + schedule[i].notes + '</td></tr>';
        }
    }

    html += '</table></details>'

    return html;
}

function propToComboBox() {
    var html = '';

    var mystorage = localStorage.getObject('mystorage');

    for (prop in mystorage)
        html += '<option value="' + prop + '">' + prop + '</option>';

    return html;
}

function writePage(num) {
    var html = '';

    var mystorage = localStorage.getObject('mystorage');
    var elements;

    // may have been deleted!
    if (("arrElements" + num) in mystorage) {

        eval("elements=mystorage.arrElements" + num + ";");

        var buf = [];

        // ideally we would like to use error-handling
        // to flag null-pointers here, to prevent bug (see above)
        // but manual tweaking is good for now
        for (var i = 0; i < elements.length; i++) {

            buf = elements[i].split(':');

            if (buf[0] == 'l') {
                html += writeList(buf[1]);
            }
            else if (buf[0] == 'lt') {
                html += writeList(buf[1],1);
            }
            else if (buf[0] == 'bg') {
                html += writeButtons(buf[1]);
            }
            else if (buf[0] == 'sched') {
                html += writeSchedule(buf[1]);
            }
        }
    }

    return html;
}

/***************
    ModArray
****************/

function modArray_pull(inMember) {

    // convenience
    if (inMember.startsWith('bg_'))
        inMember += '.arrOrder';

    var foo = '';

    var mystorage = localStorage.getObject('mystorage');
    var list;
    eval("list=mystorage." + inMember + ";");
    for (var i = 0; i < list.length; i++) {
        foo += '\n' + list[i];
    }

    document.getElementById('modArray').value = foo.substring(1);
}

function modArray_push(inMember) {

    var inArray = document.getElementById('modArray').value.split(/\n/);

    // arrElements1 is a critical array
    // that structures the whole webpage
    // therefore, make sure elements exist
    var buf;
    if (inMember.startsWith('arrElements')) {
        for (var i = 0; i < inArray.length; i++) {
            buf = inArray[i].split(':');

            if (buf[0] == 'l')
                checkList(buf[1]);
            if (buf[0] == 'lt')
                checkList(buf[1],1);
            else if (buf[0] == 'bg')
                checkButtonGroup(buf[1]);
        }
    }

    // populate buttons if necessary
    if (inMember.startsWith('bg_'))
        reOrderButtons(inMember.substring(3), inArray);

    // convenience
    if (inMember.startsWith('bg_'))
        inMember += '.arrOrder';

    var mystorage = localStorage.getObject('mystorage');
    eval("mystorage." + inMember + "=inArray;");
    localStorage.setObject('mystorage', mystorage);
}

/**************
    Library
***************/

Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function (key) {
    return this.getItem(key) && JSON.parse(this.getItem(key));
}

/***************
    Testing
****************/
