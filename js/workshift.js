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
                if (options.totalHours) {
                    this.totalHours = options.totalHours;
                }
                if (options.additionalDateRenderer) {
                	this.additionalDateRenderer = options.additionalDateRenderer;
                }
            }
        }

        var renderWorkshift = function (workshifts, options) {

            var currentDate = null,
                wsDay = null,
                that = this;
                
            $.each(workshifts, function(index, workshift) {
                var startDate = new Date(workshift.start);
                var stopDate = new Date(workshift.stop);

                workshift.diff = Date.diff(startDate, stopDate);

                if (!startDate.isSameDay(currentDate)) {
                    currentDate = startDate;
                    that.target.append(wsDay);
                    wsDay = createWsDay(currentDate, workshift);
                }

                var createdRow = options.rowRenderer
                    && $.isFunction(options.rowRenderer) ?
                    options.rowRenderer(workshift) :
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

            if (that.totalHours) {
                var sum = WorkshiftDiff.sumSelector('.ws_diff');
                that.totalHours.html(sum);
            }
        }

        var _setButtonText = function (text) {
            if (that.buttonText) {
                that.buttonText.text(text);
            }
            else if (that.toggle) {
                that.toggle.val(text);
            }
        }

        var startTimer = function () {
            _setButtonText('Stop');

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
            var createdRow = insertWsRow(startTime, startTime);
            that.wsStop = $('.ws_stop', createdRow);
            that.wsDiff = $('.ws_diff', createdRow);
            _startTimerCounter(startTime);
        }

        var _startTimerCounter = function (counterStartTime) {
            var msStartServer = counterStartTime.getTime();
            var msStartLocal = (new Date()).getTime();

            var updateClock = function () {
                var msStopLocal = (new Date()).getTime();
                var stopServerPrime = new Date(msStopLocal - msStartLocal + msStartServer);
                that.wsStop.html(stopServerPrime.toFormatTime());

                var diff = Date.diff(that.startTime, stopServerPrime);

                if (that.wsDiff.html() !== diff) {
                    that.wsDiff.html(diff);

                    if (that.totalHours) {
                        that.totalHours.html("");
                        that.totalHours.html(WorkshiftDiff.sumSelector('.ws_diff'));
                    }
                }

                that.timerID = setTimeout(updateClock, 1000);
            }
            that.timerID = setTimeout(updateClock, 1000);
        }

        var resumeTimer = function (resumeTime) {
            if (that.toggle) {
                _setButtonText('Stop');
                that.toggle.unbind('click');
                that.toggle.click(function () { stopTimer() });
            }
            that.wsStop = $('.ws_stop:first', that.target);
            that.wsDiff = $('.ws_diff:first', that.target);
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
            _setButtonText('Start');
            that.toggle.unbind('click');
            that.toggle.click(function () { startTimer() });
        }

        var createWsRow = function (startDate, stopDate) {
            if (that.rowTemplate) {
                return that.rowTemplate.tmpl({
                    'Start': startDate.toFormatTime(),
                    'Stop': stopDate.toFormatTime(),
                    'Diff': '0h 0m'
                });
            }

            return $('<div class="ws_row"></div>')
                .append($('<div class="ws_start"></div>').append(startDate.toFormatTime()))
                .append($('<div class="ws_stop"></div>').append(stopDate.toFormatTime()));
        }

        var createWsDay = function (currentDate, workshift) {
        	var ws_day = $('<div class="ws_day"></div>')
        		.append($('<div class="ws_date"></div>')
                    .append(currentDate.toFormatDate()));

            if (that.additionalDateRenderer
                && $.isFunction(that.additionalDateRenderer)) {
                ws_day.append(that.additionalDateRenderer(workshift));
            }
	            
            return ws_day;
        }
    
        var insertWsRow = function (startDate, stopDate) {
            var wsRow = createWsRow(startDate, stopDate);
            var currentDateContainer = $('.ws_date:first', that.target);

            if (startDate.isSameDay(currentDateContainer.html())) {
                var insertion = $('.ws_day > .ws_row:first', that.target);

                if (insertion.length > 0) {
                    insertion.before(wsRow);
                }
                else {
                    currentDateContainer.parent().children().append(wsRow);
                }
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

