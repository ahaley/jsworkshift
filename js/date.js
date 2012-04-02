Date.prototype.isValidDate = function () {
    if (Object.prototype.toString.call(this) !== '[object Date]') {
        return false;
    }
    return !isNaN(this.getTime());
}

Date.prototype.isSameDay = function (d) {

    if (typeof d === 'string') {
        // assuming mm-dd-YYYY
        var tokens = d.split('-');
        d = new Date(
            parseInt(tokens[2]),
            parseInt(tokens[0]) - 1,
            parseInt(tokens[1])
        );
    }

    if (!(d instanceof Date)) {
        return false;
    }
    return (this.getDate() == d.getDate() &&
        this.getMonth() == d.getMonth() &&
        this.getYear() == d.getYear());
}

Date.prototype.toFormatDate = function () {
    var date = this.getDate();
    var month = this.getMonth() + 1;
    var year = this.getFullYear();
    return month + '-' + date + '-' + year;
}

Date.parseDateTimeText = function (dateText, timeText) {
    var dateTokens = dateText.split("-"),
        year = parseInt(dateTokens[2]),
        month = parseInt(dateTokens[0]),
        day = parseInt(dateTokens[1]),
        timeTokens = timeText.split(":"),
        hour = parseInt(timeTokens[0]),
        minutes = parseInt(timeTokens[1]),
        seconds = parseInt(timeTokens[2]),
        meridiem = timeTokens[3];

    if (meridiem === "PM")
        hour += 12;

    return new Date(year, month - 1, day, hour, minutes, seconds);

}

Date.diff = function (d1, d2) {
    if (!(d1 instanceof Date) || !(d2 instanceof Date))
        return false;

    if (d1 > d2) {
        var s = d1;
        d1 = d2;
        d2 = s;
    }

    var h = d2.getHours() - d1.getHours();
    var m = d2.getMinutes() - d1.getMinutes();
    if (m < 0) {
        h -= 1;
        m += 60;
    }
    return h + 'h ' + m + 'm';
}

Date.toProperFormat = function (s) {
    var pad2 = function (s) {
        if (parseInt(s) < 10) return '0' + s;
        return s;
    }
    var tokens = s.split('-');
    return tokens[2] + '-' + pad2(tokens[0]) + '-' + pad2(tokens[1]);
}

Date.prototype.toFormatTime = function () {
    var pad2 = function (s) {
        if (s < 10) return '0' + s;
        return s;
    }
    var hour = this.getHours();
    var meridiem = hour > 11 ? "PM" : "AM";
    hour = hour % 12;
    if (hour == 0) hour = 12;
    var minute = pad2(this.getMinutes())
    var seconds = pad2(this.getSeconds());
    return hour + ":" + minute + ":" + seconds + ":" + meridiem;
}

Date.prototype.toFormatDateTime = function () {
    return this.toFormatDate() + ' ' + this.toFormatTime();
}

