class Schedule {
    constructor(objStorage) {
        if (!objStorage)
            throw new Error("Schedule: constructor: must call with parameter objStorage")

        this._s = objStorage;

        var d = new Date();
        this._sDate = pad2(d.getMonth() + 1) + '/' + pad2(d.getDate());

        this._d = d;
    }

    get sDate() {
        return this._sDate;
    }

    newSchedItem(inItem, inEncrypt, pointValAdj, cumPts, cumTime) {

        var sTime = pad2(this._d.getHours()) + ':' + pad2(this._d.getMinutes());

        var arrTimeEncrypt = [];
        var arrTimeEncryptKey = [];

        var arrRemaining = [0, 1, 2, 3, 4];
        var idx;
        for (var i = 0; i < 5; i++) {
            idx = Math.floor(Math.random() * arrRemaining.length);
            arrTimeEncryptKey.push(arrRemaining[idx]);
            arrTimeEncrypt.push(sTime.charAt(arrRemaining[idx]));
            arrRemaining.splice(idx, 1);
        }

        var newSchedItem = {};

        newSchedItem._src = inItem;
        newSchedItem._label = inEncrypt;
        newSchedItem._sDate = this._sDate;
        newSchedItem._arrTimeEncrypt = arrTimeEncrypt;
        newSchedItem._arrReverseTimeEncryptKey = arrTimeEncryptKey.reverse();
        newSchedItem._pointValAdj = pointValAdj;
        newSchedItem._cumPts = cumPts;
        newSchedItem._cumTime = cumTime;

        return newSchedItem;
    }

    writeSched(hasDetails, hasNoTime) {
        var arrSchedule = this._s["_arrSchedule"];

        var html = '<details><summary>schedule</summary><br/><table class="schedule">'

        var time = '';
        for (var i = 0; i < arrSchedule.length; i++) {
            if (arrSchedule[i]._cumTime != '-' // came from a list
                || hasDetails == 1) {

                if (hasNoTime == 1)
                    time = 'time';
                else {
                    var arrBuf = [0, 0, 0, 0, 0];
                    var arrTimeEncryptKey = arrSchedule[i]._arrReverseTimeEncryptKey.reverse();
                    for (var j = 0; j < arrTimeEncryptKey.length; j++)
                        arrBuf[arrTimeEncryptKey[j]] = arrSchedule[i]._arrTimeEncrypt[j];
                    time = arrBuf.join('');
                }

                html += '<tr class="schedule">'
                        + '<td class="schedule">'
                        + arrSchedule[i]._sDate + '</td>'
                        + '<td class="schedule">'
                        + time + '</td>'
                        + '<td class="schedule">'
                        + arrSchedule[i]._src + '</td>'
                        + '<td class="schedule">'
                        + arrSchedule[i]._label + '</td>'
                        + '<td class="schedule">'
                        + arrSchedule[i]._cumPts + '</td>'
                        + '<td class="schedule">'
                        + arrSchedule[i]._cumTime + '</td></tr>';
            }
        }

        html += '</table></details>';
        html += '<div class="spacer200"></div>';

        return html;
    }
}