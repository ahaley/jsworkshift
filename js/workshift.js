Date.prototype.isSameDay = function (d) {
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
    
var Workshift = (function () {

    var Workshift = function (options) {
        this.init(options);
    };

    Workshift.prototype = function () {
        var that = null;

        var init = function (options) {
            that = this;
            if (options) {
                if (options.target)
                    this.target = options.target;
                if (options.timeScaffold) {
                    this.timeScaffold = options.timeScaffold;
                }
                if (options.toggle) {
                    this.toggle = options.toggle;
                    this.toggle.click(function () { startTimer() });
                }
            }
        }

        var createWsRow = function (startDate, stopDate) {
            return $('<div class="ws_row"></div>')
                .append($('<div class="ws_start"></div>').append(startDate.toFormatTime()))
                .append($('<div class="ws_stop"></div>').append(stopDate.toFormatTime()));
        }

        var createWsDay = function (currentDate) {
            return $('<div class="ws_day"></div>')
                .append($('<div class="ws_date"></div>')
                    .append(currentDate.toFormatDate()));
        }

        var insertWsRow = function (startDate, stopDate) {
            var wsRow = createWsRow(startDate, stopDate);
            var wsDate = $('.ws_date:first', that.target);
            var currentDate = new Date(wsDate.html());
            if (currentDate.isSameDay(startDate)) {
                wsDate.after(wsRow);
            }
            else {
                var wsDay = createWsDay(startDate);
                wsDay.append(wsRow);
                that.target.prepend(wsDay);
            }
            return wsRow;
        }

        var startTimer = function () {
            var now = that.timeScaffold ? that.timeScaffold() : new Date();
            that.toggle.val('Stop');
            that.toggle.unbind('click');
            that.toggle.click(function () { stopTimer() });
            
            // TODO: AJAX call to create server-side Workshift, ie. retrieve Start Date. s/now/startServer

            var createdRow = createWsRow(now, now);
            var msStartServer = now.getTime();
            var msStartLocal = (new Date()).getTime();

            var createdRow = insertWsRow(now, now);

            that.wsStop = $('.ws_stop', createdRow);
            
            var updateClock = function () {
                var msStopLocal = (new Date()).getTime();
                var stopServerPrime = new Date(msStopLocal - msStartLocal + msStartServer);
                that.wsStop.html(stopServerPrime.toFormatTime());
                that.timerID = setTimeout(updateClock, 1000);
            }
            that.timerID = setTimeout(updateClock, 1000);

        }

        var stopTimer = function () {
            var now = that.timeScaffold ? that.timeScaffold() : new Date();
            clearTimeout(that.timerID);
            that.wsStop.html(now.toFormatTime());
            that.toggle.val('Start');
            that.toggle.unbind('click');
            that.toggle.click(function () { startTimer() });
        }

        var renderWorkshift = function (workshifts) {

            var currentDate = null,
                wsDay = null,
                that = this;
                
            $.each(workshifts, function(index, workshift) {
                
                var startDate = new Date(workshift.start);
                var stopDate = new Date(workshift.stop);

                if (!startDate.isSameDay(currentDate)) {
                    currentDate = startDate;
                    that.target.append(wsDay);
                    wsDay = createWsDay(currentDate);
                }
                wsDay.append(createWsRow(startDate, stopDate));
            
            });

            this.target.append(wsDay);

        }

        return {
            init: init,
            createWsRow: createWsRow,
            createWsDay: createWsDay,
            insertWsRow: insertWsRow,
            startTimer: startTimer,
            renderWorkshift: renderWorkshift
        };
    } ();

    return Workshift;
})();

