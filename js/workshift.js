var Workshift = (function () {

    var Workshift = function (options) {
        this.init(options);
    };

    Workshift.prototype = function () {
        var that = null;
        var init = function (options) {
            that = this;
            if (options) {
                if (options.target) {
                    this.target = options.target;
                }
                if (options.timeScaffold) {
                    this.timeScaffold = options.timeScaffold;
                }
                if (options.toggle) {
                    this.toggle = options.toggle;
                    this.toggle.click(function () { startTimer() });
                }
                if (options.startURI) {
                    this.startURI = options.startURI;
                }
                if (options.stopURI) {
                    this.stopURI = options.stopURI;
                }
                if (options.rowTemplate) {
                    this.rowTemplate = options.rowTemplate;
                }
                if (options.additionalDateElement) {
                	this.additionalDateElement = options.additionalDateElement;
                }
            }
        }

        var renderWorkshift = function (workshifts, rowRenderer) {

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

                var createdRow = $.isFunction(rowRenderer) ?
                    rowRenderer(workshift) :
                    createWsRow(startDate, stopDate);

                wsDay.append(createdRow);
            });
            
            this.target.append(wsDay);

            if (workshifts.length > 0) {
                var lastWorkshift = workshifts[0];
                if (!lastWorkshift.is_completed) {
                    that.startTime = new Date(lastWorkshift.start);
                    resumeTimer(new Date(lastWorkshift.stop));
                }
            }
        }

        var startTimer = function () {
            that.toggle.val('Stop');
            that.toggle.unbind('click');
            that.toggle.click(function () { stopTimer() });

            var scaffoldDate = _getScaffoldDate();

            if (that.startURI) {
                var data = { };

                if (scaffoldDate)
                    data.start = scaffoldDate.toISOString();

                $.post(that.startURI, data,
                    function (data) {
                        _startTimer(new Date(data.start), new Date(data.stop));
                    }
                );
            }
            else {
                _startTimer(scaffoldDate || new Date());
            }
        }

        var _startTimer = function(startTime, stopTime) {
            stopTime = stopTime || startTime;
            that.startTime = startTime;
            that.wsStop = $('.ws_stop', insertWsRow(startTime, startTime));
            _startTimerCounter(startTime);
        }

        var _startTimerCounter = function (counterStartTime) {
            var msStartServer = counterStartTime.getTime();
            var msStartLocal = (new Date()).getTime();

            var updateClock = function () {
                var msStopLocal = (new Date()).getTime();
                var stopServerPrime = new Date(msStopLocal - msStartLocal + msStartServer);
                that.wsStop.html(stopServerPrime.toFormatTime());
                that.timerID = setTimeout(updateClock, 1000);
            }
            that.timerID = setTimeout(updateClock, 1000);
        }

        var resumeTimer = function (resumeTime) {
            that.toggle.val('Stop');
            that.toggle.unbind('click');
            that.toggle.click(function () { stopTimer() });
            that.wsStop = $('.ws_stop:first', that.target);
            _startTimerCounter(resumeTime);
        }

        var stopTimer = function () {
            var scaffoldDate = _getScaffoldDate();

            if (that.stopURI) {
                
                var data = {
                    start: that.startTime.toISOString()
                }

                if (scaffoldDate)
                    data.stop = scaffoldDate.toISOString();

                $.post(that.stopURI, data, function (result) {
                    _stopTimer(new Date(result.stop));
                });

            } else {
                _stopTimer(scaffoldDate || new Date());
            }
        }

        var _stopTimer = function(stoptime) {
            clearTimeout(that.timerID);
            that.wsStop.html(stoptime.toFormatTime());
            that.toggle.val('Start');
            that.toggle.unbind('click');
            that.toggle.click(function () { startTimer() });
        }

        var createWsRow = function (startDate, stopDate) {
            
            if (that.rowTemplate) {
                return that.rowTemplate.tmpl({
                    'Start': startDate.toFormatTime(),
                    'Stop': stopDate.toFormatTime()
                });
            }

            return $('<div class="ws_row"></div>')
                .append($('<div class="ws_start"></div>').append(startDate.toFormatTime()))
                .append($('<div class="ws_stop"></div>').append(stopDate.toFormatTime()));
        }

        var createWsDay = function (currentDate) {
        	var ws_day = $('<div class="ws_day"></div>')
        		.append($('<div class="ws_date"></div>')
                    .append(currentDate.toFormatDate()));
                    
            if (that.additionalDateElement) {
            	ws_day.append(that.additionalDateElement.clone());
            }
	            
            return ws_day;
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

        var _getScaffoldDate = function () {
            var scaffoldDate = that.timeScaffold ? that.timeScaffold() : null;

            if (!(scaffoldDate instanceof Date) || !scaffoldDate.isValidDate()) {
                scaffoldDate = null;
            }

            return scaffoldDate;
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

