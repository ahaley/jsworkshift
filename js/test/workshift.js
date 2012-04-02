$(document).ready(function () {
    test("existence of Workshift test", function () {
        ok(Workshift, "Workshift exists");
    });

    test("instantiation of Workshift", function () {
        var myWorkshift = new Workshift();
        ok(myWorkshift instanceof Workshift, "instance check");
    });

    test("isSameDay test", function () {
        var d1 = new Date(2010, 1, 1),
            d2 = new Date(2010, 1, 1),
            d3 = new Date(2010, 1, 2);
        ok(d1.isSameDay, "isSameDay method exists");
        ok(d1.isSameDay(d1) == true, "identity");
        ok(d1.isSameDay(d2) == true, "same day");
        ok(d1.isSameDay(d3) == false, "different day");
    });

    test("Date can parse", function () {
        var s = "2011-01-09T13:01-02:00";
        var d = new Date(s);
        ok(d instanceof Date);
    });

    test("createWsRow", function () {
        var myWs = new Workshift();
        var d1 = new Date("2010-01-01T01:30:00-05:00");
        var d2 = new Date("2010-01-01T02:30:00-05:00");

        var wsRow = myWs.createWsRow(d1, d2);

        var children = wsRow.children();
        equals(children.length, 2, "created two rows");
        equals($(children[0]).html(), '1:30:00:AM', 'start date for created ws_row');
        equals($(children[1]).html(), '2:30:00:AM', 'stop date for created ws_row');
    });

    test("createWsDay", function () {
        var myWs = new Workshift();
        var d = new Date("2010-01-15T00:00-05:00");

        var createdWsDay = myWs.createWsDay(d);

        ok(createdWsDay.hasClass('ws_day'), 'does createdWsDay have class ws_day');
        var createdWsDate = createdWsDay.children();
        equals(createdWsDate.length, 1, 'created ws_day should only have 1 child');
        ok(createdWsDate.hasClass('ws_date'));
        equals(createdWsDate.html(), '1-15-2010', 'ws_date value');
    });

    test("createWsDay with additional date element", function () {
        var element = '<select><option value="one">One</option><option value="two">Two</option></select>';

        var myWs = new Workshift({
            additionalDateRenderer: function (workshift) {
                return $(element);
            }
        });

        var d = new Date("2010-1-15");
        var createdWsDay = myWs.createWsDay(d);

        var children = createdWsDay.children();
        equals(children.length, 2, 'should return two children with additional options defined');

        var selectObj = children[1];

        var expectedSelect = $(element).get(0);

        equal(typeof selectObj, typeof expectedSelect, 'types do not match');
        equal(selectObj.innerHTML, expectedSelect.innerHTML, 'innerHTML does not match');
    });

    test("insertWsRow with existing date", function () {
        var target = $('<div id="test"><div class="ws_day"><div class="ws_date">1-15-2010</div></div></div>');
        var myWs = new Workshift({ 'target': target });
        var d1 = new Date("2010-01-15T01:30-05:00");
        var d2 = new Date("2010-01-15T02:30-05:00");

        myWs.insertWsRow(d1, d2);

        var wsDay = target.children();
        ok(wsDay.hasClass('ws_day'), 'ws_day has class');
        equal(wsDay.length, 1, 'no new ws_day was created');

        var wsRow = $('.ws_row', wsDay);

        equal(wsRow.length, 1, 'only one row inserted');
        equal(wsRow.children().length, 2, 'start and stop children in row');
    });

    test("insertWsRow grows up with later date", function () {
        var target = $('<div id="test"><div class="ws_day"><div class="ws_date">1-15-2010</div><div class="ws_row"><div class="ws_start">1:30:00AM</div><div class="ws_stop">2:30:00AM</div></div></div>');
        var myWs = new Workshift({ 'target': target });
        var d1 = new Date("2010-06-10T01:30-04:00");
        var d2 = new Date("2010-06-10T02:30-04:00");

        myWs.insertWsRow(d1, d2);

        var days = $('.ws_day', target);
        equal(days.length, 2, 'created a second day');
        equal($('.ws_date:first', days).html(), '6-10-2010', 'later date should be first');
    });

    test("insertWsRow with new date", function () {
        var target = $('<div id="test"></div>');
        var myWs = new Workshift({ 'target': target });
        var d1 = new Date("2010-06-10T01:30-04:00");
        var d2 = new Date("2010-06-10T02:30-04:00");

        myWs.insertWsRow(d1, d2);

        var wsDay = target.children();
        equal(wsDay.length, 1, 'one ws_day created');
        ok(wsDay.hasClass('ws_day'), 'target has ws_day class after insertWsRow');

        var wsDate = $('.ws_date', wsDay);
        equal(wsDate.length, 1, 'one ws_date created');
        equal(wsDate.html(), '6-10-2010', 'ws_date contains date');

        var wsRows = $('.ws_row', wsDay);
        equal(wsRows.length, 1, 'one ws_row was created');
        equal(wsRows.children().length, 2, 'two divs under ws_row(ws_start, ws_stop) were created');
        equal($('.ws_start', wsRows).html(), '1:30:00:AM', 'ws_start time correct');
        equal($('.ws_stop', wsRows).html(), '2:30:00:AM', 'ws_stop time correct');
    });
});
