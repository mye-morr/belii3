class Report {

    constructor(objStorage) {
        if (!objStorage)
        throw new Error("Report: constructor: must call with parameter objStorage")

        this._s = objStorage;
    }    

    writePts() {
        var html = '';

        var d = new Date();
        var sDate = pad2(d.getMonth() + 1) + '/' + pad2(d.getDate());

        if (sDate in this._s["_arrSePoints"]) {
            html += '<div style="text-align:center">';
            html += this._s["_arrSePoints"][sDate].cumPts;
            html += '</div>';
            html += '<div class="spacer25"></div>';
        }

        return html;

    }

    writeRpt(label, numPeriods, arrNames) {
        var arrDates = [];
        // dates arranged reverse chronologically
        // in mm/dd format, but will display in -n format
        var d;
        for (var i = 0; i < numPeriods; i++) {
            d = new Date();
            d.setDate(d.getDate() - (numPeriods - 1 - i));
            arrDates.push(
                pad2(d.getMonth() + 1)
                + '/' + pad2(d.getDate())
                );
        }

        var html = '<details><summary>' + label + '</summary><br/>';

        html += '<table class="lines"><tr class="lines"><td></td>';
        for (var i = 0, len = arrDates.length; i < len; i++) {
            html += '<td class="lines">' + (i - (len - 1)) + '</td>';
        }
        html += '</tr>';

        for (var i = 0, len = arrNames.length; i < len; i++) {
            if (arrNames[i] == "se") {
                html += '<tr><td><br/></td></tr>' // spacing
                        + '<tr class="lines"><th class="lines">'
                        + 'se' + '</td></tr><td class="lines"></td>';

                for (var k = 0, nen = arrDates.length; k < nen; k++) {
                    if (arrDates[k] in this._s["_arrSePoints"])
                        html += '<td class="lines">'
                                + this._s["_arrSePoints"][arrDates[k]].cumPts
                                + '</td>';
                    else
                        html += '<td class="lines">0</td>';
                }
            }

            else {
                var objNames = new Names(arrNames[i], {_s: this._s}).objNames;

                var name = arrNames[i];
                var type = objNames._type;
                var flags = objNames._flags;
                var objFlags = new Flags(flags);

                var objItem = new Item(type, name,
                    {
                        _s: this._s
                    }
                    ).objItem;
                var arrOrder = objItem._arrOrder;

                html += '<tr><td><br/></td></tr>' // spacing
                        + '<tr class="lines"><th class="lines">'
                        + arrNames[i] + '</td></tr>';

                for (var j = 0, men = arrOrder.length; j < men; j++) {

                    html += '<tr class="lines"><td class="lines">' + arrOrder[j] + '</td>';

                    for (var k = 0, nen = arrDates.length; k < nen; k++) {
                        if (arrDates[k] in objItem[arrOrder[j]]._arrCount)
                            html += '<td class="lines">'
                                    + objItem[arrOrder[j]]._arrCount[arrDates[k]].count
                                    + '</td>';
                        else
                            html += '<td class="lines">0</td>';
                    }

                    html += '</tr>';
                }
            }
        }

        html += '</table></details>';
        html += '<div class="spacer200"></div>';

        return html;

    }
}