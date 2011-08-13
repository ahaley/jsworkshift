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
		var d1 = new Date(2010, 1, 1, 1, 30);
		var d2 = new Date(2010, 1, 1, 2, 30);
		var wsRow = myWs.createWsRow(d1, d2);
		var children = wsRow.children();
		equals(children.length, 2, "created two rows");
		equals($(children[0]).html(), '1:30:00:AM', 'start date for created ws_row');
		equals($(children[1]).html(), '2:30:00:AM', 'stop date for created ws_row');
	});

	test("createWsDay", function () {
		var myWs = new Workshift();
		var d = new Date(2010, 0, 15);
		var createdWsDay = myWs.createWsDay(d);
		ok(createdWsDay.hasClass('ws_day'), 'does createdWsDay have class ws_day');

		var createdWsDate = createdWsDay.children();

		equals(createdWsDate.length, 1 , 'created ws_day should only have 1 child');
		ok(createdWsDate.hasClass('ws_date'));
		equals(createdWsDate.html(), '1-15-2010', 'ws_date value');
	});

	test("insertWsRow with existing date", function () {
		var target = $('<div id="test"><div class="ws_day"><div class="ws_date">1-15-2010</div></div></div>');
		var myWs = new Workshift({'target': target});
		var d1 = new Date(2010, 0, 15, 1, 30);
		var d2 = new Date(2010, 0, 15, 2, 30);
		
		myWs.insertWsRow(d1, d2);

		var wsDay = target.children();
		ok(wsDay.hasClass('ws_day'), 'ws_day has class');
		equals(wsDay.length, 1, 'no new ws_day was created');

		var wsRow = $('.ws_row', wsDay);
		equals(wsRow.length, 1, 'only one row inserted');
		equals(wsRow.children().length, 2, 'start and stop children in row');
	});

	test("insertWsRow grows up with later date", function () {
		var target = $('<div id="test"><div class="ws_day"><div class="ws_date">1-15-2010</div><div class="ws_row"><div class="ws_start">1:30:00AM</div><div class="ws_stop">2:30:00AM</div></div></div>');
		var myWs = new Workshift({'target': target});
		var d1 = new Date(2010, 5, 10, 1, 30);
		var d2 = new Date(2010, 5, 10, 2, 30);
		
		myWs.insertWsRow(d1, d2);

		var days = $('.ws_day', target);
		equals(days.length, 2, 'created a second day');
		equals($('.ws_date:first', days).html(), '6-10-2010', 'later date should be first');
	});

	test("insertWsRow with new date", function () {
		var target = $('<div id="test"></div>');
		var myWs = new Workshift({'target': target});
		var d1 = new Date(2010, 5, 10, 1, 30);
		var d2 = new Date(2010, 5, 10, 2, 30);
		 
		myWs.insertWsRow(d1, d2);

		var wsDay = target.children();
		equals(wsDay.length, 1, 'one ws_day created');
		ok(wsDay.hasClass('ws_day'), 'target has ws_day class after insertWsRow');
		
		var wsDate = $('.ws_date', wsDay);
		equals(wsDate.length, 1, 'one ws_date created');
		equals(wsDate.html(), '6-10-2010', 'ws_date contains date');

		var wsRows = $('.ws_row', wsDay);
		equals(wsRows.length, 1, 'one ws_row was created');
		equals(wsRows.children().length, 2, 'two divs under ws_row(ws_start, ws_stop) were created');
		equals($('.ws_start', wsRows).html(), '1:30:00:AM', 'ws_start time correct');
		equals($('.ws_stop', wsRows).html(), '2:30:00:AM', 'ws_stop time correct');
	});

});
