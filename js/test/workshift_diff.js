$(function () {
    test("existence", function () {
        ok(WorkshiftDiff, "WorkshiftDiff exists");
    });

    test("WorkshiftDiff can calculate total hours", function () {
        var diffs = ['4h 27m', '3h 54m', '4h 54m', '3h 58m'];
        var result = WorkshiftDiff.sum(diffs);
        equals(result, '17h 13m');
    });

    test("WorkshiftDiff can calculate total hours from wrapped set", function () {
        var diffs = $('.ws_diff');
        var result = WorkshiftDiff.sumWrappedSet(diffs);
        equals(result, '17h 13m');
    });

    test("WorkshiftDiff can calculate total hours from selctor", function() {
        var result = WorkshiftDiff.sumSelector('.ws_diff');
        equals(result, '17h 13m');
    });
});
