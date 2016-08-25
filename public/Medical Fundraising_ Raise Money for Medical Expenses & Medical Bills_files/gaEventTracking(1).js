var GFM = GFM || {};

GFM.gaEventTracking = (function() {

    var trackDesktopCheckoutEvent = function(eventAction, eventLabel) {
        return trackEvent("desktop-checkout", eventAction, eventLabel);
    };

    var trackMobileCheckoutEvent = function(eventAction, eventLabel) {
        return trackEvent("mobile-checkout", eventAction, eventLabel);
    };

    var trackResponsiveCampaignEvent = function(eventAction, eventLabel) {
        return trackEvent("responsive-campaign", eventAction, eventLabel);
    };

    var trackSearch = function(eventAction, eventLabel) {
        return trackEvent("search", eventAction, eventLabel);
    };

    var trackThankATeacher = function(eventAction, eventLabel) {
        return trackEvent("thankateacher", eventAction, eventLabel);
    };

    var trackLIFG = function(eventAction, eventLabel) {
        return trackEvent("linkedinforgood", eventAction, eventLabel);
    };

    var trackMobilePostDonate = function(eventAction, eventLabel, screenOrder) {

        if (eventAction === 'comment-fb' && eventLabel === GFM.postdonateCommon.actions.accept) {
            var $privateDonation = $('#private-donation-checked-before');
            var screenNumber = $privateDonation.closest('.success-steps').prevAll('.js-postdonate-screen-number').first().attr('name');

            if ($privateDonation.val() === '1') {
                trackMobilePostDonate('comment-fb-made-private', GFM.postdonateCommon.actions.accept, screenNumber);
            } else {
                trackMobilePostDonate('comment-fb-made-private', GFM.postdonateCommon.actions.skip, screenNumber);
            }
        }

        if (eventAction === 'more-share' && eventLabel === GFM.postdonateCommon.actions.show) {
            var screenNumber = $('.success-step-3').prevAll('.js-postdonate-screen-number').first().attr('name');
            if (GFM.utils.userAgentUtils.isIOS()) {
                trackMobilePostDonate("more-share-sms", eventLabel, screenNumber);
            }
            trackMobilePostDonate("more-share-email", eventLabel, screenNumber);
            trackMobilePostDonate("more-share-tweet", eventLabel, screenNumber);
            trackMobilePostDonate("more-share-back-to-campaign", eventLabel, screenNumber);
            trackMobilePostDonate("more-share-another-campaign", eventLabel, screenNumber);
        }

        if (screenOrder) {
            eventAction = eventAction + ' (' + String(screenOrder) + ')';
        }

        return trackEvent("mobile-postdonate", eventAction, eventLabel);
    };

    var track3dsRedirection = function(eventAction, eventLabel, eventValue, eventCallback) {
        return trackEvent("3ds", eventAction, eventLabel, eventValue, eventCallback);
    };

    var trackPostShareUpsell = function(eventAction, eventLabel, eventValue, eventCallback) {
        return trackEvent("post-share-upsell", eventAction, eventLabel, eventValue, eventCallback);
    };

    var trackEvent = function(eventCategory, eventAction, eventLabel, eventValue, eventCallback) {
        if (!window.dataLayer || !(window.dataLayer instanceof Array)) {
            console.log("dataLayer is not initialized");
            console.log("GA tracking: " + eventCategory + " / " + eventAction + " / " + eventLabel + " / " + eventValue);
            if (eventCallback != null) {
                eventCallback();
            }
        } else {
            // this trigger-ga-event as well as the key names all need to be named exactly so that the configured
            // Google Tag Manager hook fires appropriately.
            // if eventValue is supplied it must be an Int
            window.dataLayer.push({
                "event" : "trigger-ga-event",
                "eventCategory" : eventCategory,
                "eventAction" : eventAction,
                "eventLabel" : eventLabel,
                "eventValue" : eventValue,
                "nonInteraction" : true,
                "eventCallback" : eventCallback
            });
        }
    };

    return {
        trackDesktopCheckoutEvent: trackDesktopCheckoutEvent,
        trackMobileCheckoutEvent: trackMobileCheckoutEvent,
        trackResponsiveCampaignEvent: trackResponsiveCampaignEvent,
        trackEvent: trackEvent,
        trackSearch: trackSearch,
        trackThankATeacher: trackThankATeacher,
        trackLIFG: trackLIFG,
        trackMobilePostDonate: trackMobilePostDonate,
        track3dsRedirection: track3dsRedirection,
        trackPostShareUpsell: trackPostShareUpsell
    };
})();
