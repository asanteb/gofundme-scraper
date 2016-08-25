$(function() {
    var $mobileSectionToggle = $('.js-more-arrow');
    var $desktopSectionToggle = $('.hometoggle');
    var $desktopSection = $('.togglediv');
    var $desktopCategorySection = $('.n.cat');
    var $desktopHeaderSection = $('.hd_main');
    var $desktopFooterSection = $('.footbase');

    var $mobileSection = $('.pg-home');

    var $popularNowMobileSection = $('#trending-section');
    var $nearMeMobileSection = $('#nearme-section');
    var $almostThereMobileSection = $('#almostthere-section');
    var $facebookFriendsMobileSection = $('#fundedbf-section');

    var $signupFree = $('.btn-signup-free');
    var $search = $('.loc_suggest_drop');
    var $pressLogo = $('.presslogo');
    var footerPress = '.footnews';
    var searchTerm = '.list';
    var footerMenu = '.linkbox';
    var analyticsElement = '[data-gfm-analytics-element]';

    var popularNowDesktopCampaigns = '.tile--trending';
    var nearMeDesktopCampaigns = '.tile--nearme';
    var almostThereDesktopCampaigns = '.tile--almostthere';
    var facebookFriendsDesktopCampaigns = '.search_tile--fundedbf';

    var mpViewIds = {
        main: 'pg_index_index',
        popularNowOL: 'ol_index_trending',
        nearMeOL: 'ol_index_nearme',
        almostThereOL: 'ol_index_almostthere',
        facebookFriendsOL: 'ol_index_fundedbf'
    };

    var redshiftClickTrack = function($element, overlayViewId) {
        var trackOptions = {};

        if (overlayViewId) {
            trackOptions.viewid = overlayViewId;
        }
        if ($element.data('gfmAnalyticsElement')) {
            trackOptions.elementid = $element.data('gfmAnalyticsElement');
        }
        if ($element.data('gfmAnalyticsMeta')) {
            trackOptions.elementmeta = $element.data('gfmAnalyticsMeta');
        }

        GFM.analytics.track_event('mp_page_click', trackOptions);
    };

    var redshiftViewTrack = function(viewId) {
        var trackOptions = {
            viewid: viewId
        };

        GFM.analytics.track_event('mp_page_view', trackOptions);
    };

    /**
     * ALL TOGGLES ON HOMEPAGE
     */

    function trackSection(section) {
        if (section === 'trending') {
            redshiftViewTrack(mpViewIds.popularNowOL);
        } else if (section === 'nearme') {
            redshiftViewTrack(mpViewIds.nearMeOL);
        } else if (section === 'almostthere') {
            redshiftViewTrack(mpViewIds.almostThereOL);
        } else if (section === 'fundedbf') {
            redshiftViewTrack(mpViewIds.facebookFriendsOL);
        }
    }

    function gfmAnalyticsElementNameForTarget(target) {
        return '_' + target.innerHTML.toLowerCase().split(' ').join('_');
    }

    $mobileSectionToggle.on('click', function() {
        var section = $(this).closest('.section');
        if (section.hasClass('is-closed')) {
            var toggle = section.data('toggle');
            trackSection(toggle);
        }
    });

    $desktopSectionToggle.on('click', function() {
        var toggle = $(this).attr('toggle');
        trackSection(toggle);
    });

    if ($(popularNowDesktopCampaigns).length > 0 || $popularNowMobileSection.length > 0) {
        redshiftViewTrack(mpViewIds.popularNowOL);
    }

    /**
     * Desktop Categories
     */
    $desktopCategorySection.on('click', function(e) {
        var gfmAnalyticsElement = $(this).data('gfmAnalyticsElement');
        var categoryName = gfmAnalyticsElementNameForTarget(e.target);
        gfmAnalyticsElement += categoryName;

        GFM.analytics.track_event('mp_page_click', {
            elementid: gfmAnalyticsElement
        });
    });

    /**
     * Signup button
     */
    $signupFree.on('click', function() {
        redshiftClickTrack($(this));
    });

    /**
     * Press logo
     */
    $pressLogo.on('click', function() {
        redshiftClickTrack($(this));
    });

    /**
     * Search Term Hit
     */
    $search.on('click', searchTerm, function() {
        redshiftClickTrack($(this));
    });

    /**
     * Desktop Header Section
     */
    $desktopHeaderSection.on('click', function(e) {
        redshiftClickTrack($(e.target));
    });

    /**
     * Desktop Footer Section
     */
    $desktopFooterSection.on('click', footerPress, function(e) {
        redshiftClickTrack($(e.target));
    });

    /**
     * Desktop Footer Menu Section
     */
    $desktopFooterSection.on('click', footerMenu, function(e) {
        var gfmAnalyticsElement = $(this).data('gfmAnalyticsElement');
        var categoryName = gfmAnalyticsElementNameForTarget(e.target);
        gfmAnalyticsElement += categoryName;

        GFM.analytics.track_event('mp_page_click', {
            elementid: gfmAnalyticsElement
        });
    });

    /**
     * Mobile Header Section
     */
    $mobileSection.on('click', analyticsElement, function(e) {
        var gfmAnalyticsElement = $(this).data('gfmAnalyticsElement');
        var categoryName = '';

        // Capture categories individually
        if (gfmAnalyticsElement === 'btn_mobileheader_search_category' ||
            gfmAnalyticsElement === 'btn_mobileheader_menu_link' ||
            gfmAnalyticsElement === 'btn_mobilefooter_menu') {
            categoryName = gfmAnalyticsElementNameForTarget(e.target);
            gfmAnalyticsElement += categoryName;
        }

        GFM.analytics.track_event('mp_page_click', {
            elementid: gfmAnalyticsElement
        });
    });

    /**
     * POPULAR NOW CAMPAIGNS
     */

    // Popular Now Campaigns on Desktop
    $desktopSection.on('click', popularNowDesktopCampaigns, function() {
        redshiftClickTrack($(this), mpViewIds.popularNowOL);
    });

    // Popular Now Campaigns on Mobile
    // We need to filter by the class js-swipe-tile on mobile as it is asynchronously loaded from ES.
    $popularNowMobileSection.on('click', '.js-swipe-tile', function() {
        redshiftClickTrack($(this), mpViewIds.popularNowOL);
    });

    /**
     * NEAR ME CAMPAIGNS
     */

    // Near Me Campaigns on Desktop
    $desktopSection.on('click', nearMeDesktopCampaigns, function() {
        redshiftClickTrack($(this), mpViewIds.nearMeOL);
    });

    // Near Me Campaigns on Mobile
    // We need to filter by the class js-swipe-tile on mobile as it is asynchronously loaded from ES.
    $nearMeMobileSection.on('click', '.js-swipe-tile', function() {
        redshiftClickTrack($(this), mpViewIds.nearMeOL);
    });

    /**
     * ALMOST THERE CAMPAIGNS
     */

    // Almost There Campaigns on Desktop
    $desktopSection.on('click', almostThereDesktopCampaigns, function() {
        redshiftClickTrack($(this), mpViewIds.almostThereOL);
    });

    // Almost There Campaigns on Mobile
    // We need to filter by the class js-swipe-tile on mobile as it is asynchronously loaded from ES.
    $almostThereMobileSection.on('click', '.js-swipe-tile', function() {
        redshiftClickTrack($(this), mpViewIds.almostThereOL);
    });

    /**
     * FACEBOOK FRIENDS CAMPAIGNS
     */

    // Facebook Friends Campaigns on Desktop
    $desktopSection.on('click', facebookFriendsDesktopCampaigns, function() {
        redshiftClickTrack($(this), mpViewIds.facebookFriendsOL);
    });

    // Facebook Friends Campaigns on Mobile
    // We need to filter by the class js-swipe-tile on mobile as it is asynchronously loaded from ES.
    $facebookFriendsMobileSection.on('click', '.js-swipe-tile', function() {
        redshiftClickTrack($(this), mpViewIds.facebookFriendsOL);
    });
});
