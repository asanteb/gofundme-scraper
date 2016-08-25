var GFM = GFM || {};

GFM.analyticsEventTracking = (function() {

    var steelSwanTrack = function(event, paymentProcessor, params) {
        var url = '/mvc.php?route=track/donation';

        params = (params === undefined || params === null) ? {} : params;
        params.e = event;
        params.p_proc = paymentProcessor;

        return $.ajax({
            method: 'GET',
            url: url,
            data: params
        });
    };

    /* For tracking multiple Steel Swan events at a time, use this method to bundle them together to prevent a race condition on Elastic Search.
       Events should look like:
     {
        event1: {
            name: enter_complete,
            params: {
                p_proc: 20,
                amount: 5
            }
        },
        event2: {
            name: widget_form,
            params: {
                p_proc: 20,
                amount: 5
            }
        },
     }
     */

    var steelSwanTrackBundle = function(events) {
        var url = '/mvc.php?route=track/donationbundle';

        return $.post({
            method: 'POST',
            url: url,
            data: events
        });

    };

    return {
        steelSwanTrack: steelSwanTrack,
        steelSwanTrackBundle: steelSwanTrackBundle
    };
})();
