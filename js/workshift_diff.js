WorkshiftDiff = {};

WorkshiftDiff.sum = function (diffs) {
    var sum_hour = 0;
    var sum_minute = 0;
    var regex = /(\d+)h (\d+)m/

    for (var i = 0; i < diffs.length; i++) {
        var diff = diffs[i];
        var matches = regex.exec(diff);
        if (matches != null && matches.length && matches.length == 3) {
            sum_hour += parseInt(matches[1]) || 0;
            sum_minute += parseInt(matches[2]) || 0;
        }
    }

    var hour = sum_hour + Math.floor(sum_minute / 60);
    var minute = sum_minute % 60;

    return hour + 'h ' + minute + 'm';
}

WorkshiftDiff.sumWrappedSet = function (diffs) {
    var value_array = [];
    $.each(diffs, function (index, value) {
        value_array.push($(value).html());
    });
    return WorkshiftDiff.sum(value_array);
}

WorkshiftDiff.sumSelector = function (selector) {
    return WorkshiftDiff.sumWrappedSet($(selector));
}