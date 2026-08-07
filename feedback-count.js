(function () {
    var SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRbICSQQTSFcBBcRvXzU_LD1JA10lriFVzhzpmYwiegPyfhqSjnhwdmYtPfR5i8DB4VQJAJlu_ta2HJ/pub?gid=789666271&single=true&output=csv";

    window.fetchFeedbackCount = function (callback) {
        fetch(SHEET_CSV_URL)
            .then(function (r) { return r.text(); })
            .then(function (t) { callback(parseInt(t.trim().split(",")[1], 10)); })
            .catch(function () { callback(null); });
    };

    window.feedbackCountText = function (count) {
        return count + (count === 1 ? " feedback" : " feedbacks");
    };
})();
