$(document).ready(function () {
    test("isValidDate is true for valid date", function () {
        var d1 = new Date(Date.parse("2011-10-01")),
            d2 = new Date(2010, 10, 1);

        ok(d1.isValidDate() == true);
        ok(d2.isValidDate() == true);
    });

    test("isValidDate is false for invalid dates", function () {
        var d1 = new Date(""),
            d2 = new Date("MM-dd-yyyy");

        ok(d1.isValidDate() == false);
        ok(d2.isValidDate() == false);
    });

    test("isSameDay will return same date with Date object", function () {
        var d1 = new Date(2010, 1, 1),
            d2 = new Date(2010, 1, 1),
            d3 = new Date(2010, 1, 2);
        ok(d1.isSameDay, "isSameDay method exists");
        ok(d1.isSameDay(d1) == true, "identity");
        ok(d1.isSameDay(d2) == true, "same day");
        ok(d1.isSameDay(d3) == false, "different day");
    });

    test("isSameDay will return same date with date literal", function () {
        var d1 = new Date(2010, 0, 1),
            d2 = new Date("2010-01-01T00:00-05:00"),
            s = "1-1-2010";
        ok(d1.isSameDay(s), 'not matching the same day with init-by date arguments');
        ok(d2.isSameDay(s), 'not matching the same day with init-by ISO 8601 string');
    });

    test("Date can parse", function () {
        var s = "2011-01-09T13:01-02:00";
        var d = new Date(s);
        ok(d instanceof Date);
    });

    test("Date can create Date object from date and time strings", function () {
        var dateText = "3-14-2012",
            timeText = "11:00:00:AM";
        var d1 = Date.parseDateTimeText(dateText, timeText);
        equals('2012-03-14T15:00:00.000Z', d1.toJSON());
    });

    test("Date can calculate differential", function () {
        var d1 = new Date("11/5/1955 8:00 AM");
        var d2 = new Date("11/5/1955 9:46 AM");
        var s = Date.diff(d1, d2);
        equals(s, '1h 46m', 'Date.Diff returns differential');
    });

    test("Date can calculate differential across meridiem", function () {
        var d1 = new Date("11/5/1955 9:00 AM");
        var d2 = new Date("11/5/1955 2:46 PM");
        var s = Date.diff(d1, d2);
        equals(s, '5h 46m', 'Date.Diff returns differential across meridiem');
    });

    test("Date can calculate differential with underflow", function () {
        var d1 = new Date("11/5/1955 9:56 AM");
        var d2 = new Date("11/5/1955 12:04 PM");
        var s = Date.diff(d1, d2);
        equals(s, '2h 8m', 'Date.Diff returns differential with underflow');
    });

    test("Date can calculate differential with first argument being later date", function () {
        var d1 = new Date("11/5/1955 9:46 AM");
        var d2 = new Date("11/5/1955 8:00 AM");
        var s = Date.diff(d1, d2);
        equals(s, '1h 46m', 'Date.Diff returns differential');
    });

});
