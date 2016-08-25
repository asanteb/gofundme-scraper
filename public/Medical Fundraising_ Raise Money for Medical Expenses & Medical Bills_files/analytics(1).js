/**
 * Created by jaime on 10/13/15.
 */
var GFM = GFM || {};

// this code assumes jquery is loaded, and has been included in a few pages where
// jquery is not being used. surrounding with a try catch to avoid causing errors on these pages.
// the code also assumes that the jquery cookie plugin is installed ($.cookie is not standard) - Andrew D
try {
    GFM.analytics = (function (GFM, $) {
        var data = {
            anonid: '',
            view_count: 0,
            user_id: '',
            person_id: '',
            fuid: '',
            fund_balance: 0,
            fund_id: '',
            fund_name: '',
            fund_url: '',
            facebook_id: '',
            viewid: '',
            donation_count: 0,
            donation_id: '',
            donation_amount: '',
            donation_name: '',
            donation_email: '',
            donation_city: '',
            donation_zip: '',
            donation_country: '',
            donation_currencycode: '',
            experimentvariant_ids: '',
            flow: "",
            gfm: { },
            out_rcid_candidates: '',
            pc_code: '',
            viewrid: '',
            rcid: '',
            rendered_at: 0,
            last_event_at: 0,
            event_at: 0,
            events: { },
            match_rules: [ { view: 'all', tags: { 'a': 1, 'img': 1 }, events: { 'click': 1 } } ],

            userExists: false,
            personExists: false,
            fundExists: false,
            donationExists: false,
            outRcExists: false,
            inRcExists: false,

            log_level: 'warn',
            log_debug: false,

            /* Parameters describing event store */
            event_store: false,
            event_store_prefix: 'trk-',
            event_max_attempts: 2,
            event_max_store_len: 3
        };

        //var to_track = [ 'a', 'input', 'div', 'textarea' ];
        //var event_view_filter = {
        //    pg_test_event_capture: { 
        //};

        // Package properties are "super properties" in mixpanel - persisted in cookies
        var package_properties = {};
        // Event properties will be cleared with each new page load
        var event_properties = {};

        var log_levels = {
            verbose: 1,
            debug:   2,
            info:    3,
            note:    4,
            warn:    5,
            error:   6
        };

        var dataMap = {
            a:   'anonid',
            u:   'user_id',
            p:   'person_id',
            fi:  'fund_id',
            fn:  'fund_name',
            fu:  'fund_url',
            fud: 'fuid',
            fbi: 'facebook_id',
            flw: 'flow',
            fpb: 'fund_balance',
            fpc: 'donation_count',
            gfm: 'gfm',
            vi:  'viewid',
            di:  'donation_id',
            da:  'donation_amount',
            dn:  'donation_name',
            de:  'donation_email',
            dc:  'donation_city',
            dz:  'donation_zip',
            dtid: 'distinct_id',  // Set by mixpanel
            dcc: 'donation_currencycode',
            dct: 'donation_country',
            evi: 'experimentvariant_ids',
            orc: 'out_rcid_candidates',
            pcd: 'pc_code',
            ra:  'rendered_at',
            vri: 'viewrid',
            ir:  'rcid'
        };

        var replayMap = {
            donation_id: true,
            facebook_id: true,
            fund_id: true,
            person_id: true,
            user_id: true,

            //anonid: true,
            //distinct_id: true,
            //fuid: true,
            flow: true,
            gfm: true,

            experimentvariant_ids: true,
            pc_code: true,
            rendered_at: true,
            out_referer_code: true,
            rcid: true,

            elementid: true,
            viewid: true,
            viewrid: true
        };

        /* TODO: This function is a place holder - may be useful to do work prior to unloading page */
        window.onbeforeunload = function() {
            return;
        };

        var isPostDonate = function() {
            if (typeof data['viewid'] != 'undefined' && data['viewid'] == 'pg_postdonate_thankyou') {
                return true;
            }
            return false;
        };

        var isFund = function () {
            return data.fund_id ? true : false;
        };

        var gaDataLayerDef = {
            userDetails: {userId: 'person_id'},
            fundDetails: {
                _include: isFund,
                fundId: 'fund_id',
                fundName: 'fund_name',
                fundUrl: 'fund_url',
                fundAmountRaised: 'fund_balance',
                fundDonationCount: 'donation_count'
            },
            sessionDetails: {refId: 'rcid', sessionId: 'fuid'},
            pageDetails: {},
            ecommerce: {
                checkout: {
                    _include: isFund,
                    products: [
                        {id: 'fund_id', price: 'donation_amount', brand: 'donation_currencycode', currency: 'donation_currencycode'}
                    ]
                },
                purchase: {
                    _include: isPostDonate,
                    actionField: {id: 'donation_id', revenue: 'donation_amount', currency: 'donation_currencycode'},
                    products: [{name: 'fund_name', id: 'fund_id', quantity: 1}]
                }
            }
        };

        var consoleLog = function(msg) {
            if (window.console) {
                window.console.log(msg);
            }
        }

        var dLog = function(msg) {
            if (window.console) {
                data.log_debug && window.console.log(msg);
            }
        }

        var dEvtLog = function(level, msg) {
            if (log_levels[level] < log_levels[data.log_level]) { return; }
            if (window.console) {
                window.console.log(msg);
            }
        }

        // Recursively walk gaDataLayerDef, picking up the corresponding
        // GFM.analytics.data items and inserting then into a tree structure
        // shaped exactly the same as gaDataLayerDef

        var _getGaDataLayer = function (data_layer_def) {
            if (data_layer_def['_include'] != null && !data_layer_def['_include']()) {
                return null;
            }
            var dst_hash = {};
            for (var key in data_layer_def) {
                if (key == '_include') {
                    continue;
                }
                var val_def = data_layer_def[key];
                if (val_def.constructor == Object) {
                    //alert("got object");
                    if ((dl = _getGaDataLayer(val_def)) != null) {  // should only be null when _include() returns true
                        dst_hash[key] = dl;
                    }
                }
                else if (val_def.constructor == Array) {
                    dst_hash[key] = [_getGaDataLayer(val_def[0])];
                }
                else {
                    //alert("got string");
                    // Leaf node of the tree ==> key name to fish out from data
                    data_val = GFM.analytics.data[val_def];
                    if (typeof data_val == 'undefined' || data_val == '') {
                        continue;
                    }
                    dst_hash[key] = data_val;
                }
            }
            return dst_hash;
        };

        var getGaDataLayer = function() {
            return _getGaDataLayer(gaDataLayerDef);
        };

        var getAnonId = function() {
            return data.anonid;
        };

        var getUser = function() {
            return data.user_id || '';
        };

        var getPerson = function() {
            return data.person_id || '';
        };

        var getFund = function() {
            fund = {
                fund_id: data.fund_id,
                fund_name: data.fund_name,
                fund_url: data.fund_url
            };
            return fund;
        };

        var getDonation = function() {
            donation = {
                donation_id: data.donation_id,
                donation_name: data.donation_name,
                donation_email: data.donation_email,
                donation_city: data.donation_city,
                donation_zip: data.donation_zip,
                donation_amount: data.donation_amount,
                donation_country: data.donation_country,
                donation_currencycode: data.donation_currencycode
            };
            return donation;
        };

        var getInRc = function() {
            return data.rcid || '';
        };

        var userExists = function() {
            return data.userExists;
        };

        var setUserExists = function(bool) {
            data.userExists = bool;
            if(bool && data.user_id) {
                package_properties['user_id'] = data.user_id;
            }
        };

        var personExists = function() {
            return data.personExists;
        };

        var setPersonExists = function(bool) {
            data.personExists = bool;
            if(bool && data.person_id) {
                package_properties['person_id'] = data.person_id;
            }
        };

        var fundExists = function() {
            return data.fundExists;
        };

        var setFundExists = function(bool) {
            data.fundExists = bool;
            if(bool) {
                package_properties['fund_id'] = data.fund_id;
                package_properties['fund_name'] = data.fund_name;
                package_properties['fund_url'] = data.fund_url;
            }
        };

        var donationExists = function() {
            return data.donationExists;
        };

        var setDonationExists = function(bool) {
            data.donationExists = bool;
            if(bool) {
                donation = {};
                donation['donation_id'] = data.donation_id;
                donation['donation_name'] = data.donation_name;
                donation['donation_email'] = data.donation_email;
                donation['donation_city'] = data.donation_city;
                donation['donation_zip'] = data.donation_zip;
                donation['donation_amount'] = data.donation_amount;
                donation['donation_country'] = data.donation_country;
                donation['donation_currencycode'] = data.donation_currencycode;
                package_properties['donation'] = donation;
            }
        };

        var inRcExists = function() {
            return data.inRcExists;
        };

        var setInRcExists = function(bool) {
            data.inRcExists = bool;
            if(bool) {
                package_properties['rcid'] = data.rcid;
            }
        };

        var outRcExists = function() {
            return data.outRcExists;
        };

        var findRefCode = function(rcid_key) {
            if(data.out_rcid_candidates.hasOwnProperty(rcid_key)) {
                return data.out_rcid_candidates[rcid_key];
            }
        };

        var updateRefererCode = function(rcid_key, properties) {
            var rc = findRefCode(rcid_key);
            if (typeof($rc) == "undefined") {
                consoleLog("Unknown rcid: " + rcid_key);
                return;
            }
            merge(rc, properties);
        }

        var cookiesMatching = function(prefix) {
            var matching = [ ];
            var cookies = document.cookie.split(/; */);
            for(var i=0;i<cookies.length;i++) {
                if(cookies[i].indexOf(prefix)==0) {
                    var parts = cookies[i].split(/=/);
                    var decoded = typeof decodeURIComponent != "undefined" ? decodeURIComponent(parts[1]) : decodeURIL(parts[1]);
                    matching.push([ parts[0], decoded ]);
                }
            }
            matching.sort(function(a,b) { /* most attempts to least attempts */
                return b['trknum'] - a['trknum'];
            });
            return matching;
        }

        /******************************************************************
         * The following 'Event Store' functions, are designed as a temporary
         * fix for page click * events that are lost because the page navigates
         * away prior to completion.
         *
         * The design is straightforward:
         *  - Record the event type and properties of dispatched event in cookies
         *  - Register a callback with mixpanel.track that:
         *    - wipes the cookie away on successful transmission
         *    - does nothing on failure
         *  - On subsequent page load:
         *    - Scan through all the 'trk-N' cookies:
         *      - if max_attempts have been reached, immediately remove the cookie
         *      - otherwise, dispatch the event again, incrementing trknum by 1
         ******************************************************************/

        /* scanEventStore() will return the events from the Store that should be attempted again.
         * It will automatically:
         *   - clean out events that have already reach max retries
         *   - blow away any JSON payloads that are corrupted and don't parse
         *     - this includes the absence of the 'trknum' entry
         *   - if make_room == true, will ensure that there is at least one space available in the store
         * RETURNS two element array:
         *       [ (An array of actionable events. Each event is itself an array:
         *                [0] cookie name
         *                [1] JSON string payload
         *                [2] JSON parsed into properties hash),
         *         (first available cookie naming slot on the range [0, data.event_max_store_len])
         *       ]
         */
        var scanEventStore = function(clean_store, make_room) {
            var matching = cookiesMatching(data.event_store_prefix);

            dLog("scanEventStore");

            // Iterate over all headers named, 'trk-<N>'
            for (var i=0; i<matching.length; ) {
                dLog("  ..examining " + matching[i][0]);
                var msg = null;
                var parts = matching[i][0].split(/-/);  // Pull out numeric portion of 'trk-N' cookie name
                var slot  = parseInt(parts[1]);

                // Payload of each header should be a valid JSON properties payload
                try {
                    var props = JSON.parse(matching[i][1]);
                    matching[i][2] = props;
                }
                catch (err) {  /* busted json */
                    msg = "bad JSON: " + String(err);
                }
                // We'll remove each tracking cookie if any of the following are true:
                //  - JSON is corrupt, including if any trk* entries are missing
                //  - We've already attempted to send the payload data.event_max_attempts times
                if (msg) { /* do nothing */ }
                else if (!props['trknum']) { msg = "missing trknum"; }
                else if (isNaN(slot) || slot >= data.event_max_store_len) { msg = "slot out of range"; }
                else if (clean_store && props['trknum'] >= data.event_max_attempts) { msg = "aged out"; }
                if (msg) {
                    dLog("  ..drop event cookie (" + msg + "): " + matching[i][0] + "=" + String(matching[i][1]));
                    $.removeCookie(matching[i][0], { path: '/' } );
                    matching.splice(i, 1);
                    continue;
                }
                i += 1;
            }

            // If this flag is set, we need to ensure that there's at least one available space in the Store.
            // This will be needed by the function that sets a property payload into the store.
            if (make_room) {
                while (matching.length >= data.event_max_store_len) {
                    dLog("  ..drop event cookie (make room): " + matching[0][0] + "=" + String(matching[0][1]));
                    $.removeCookie(matching[0][0], { path: '/' } );
                    matching.splice(0,1);
                }
            }

            var slots = [ ];
            for (var i=0; i<matching.length; i++) {
                var parts = matching[i][0].split(/-/); // Again, pull out the numeric portion of 'trk-<N>'
                slots.push(parts[1]);
            }
            slots.sort();

            // Find the first slot availble on the integer range [0, data.event_max_store_len]
            var first_avail_slot = NaN;
            for (var i=0; i<data.event_max_store_len; i++) {
                if (i >= slots.length || i != slots[i]) {
                    first_avail_slot = i;
                    break;
                }
            }

            return [ matching, first_avail_slot ];
        }

        function timeFromNow(num_seconds) {
            var date = new Date();
            date.setTime(date.getTime() + (num_seconds * 1000));
            return date;
        }

        /* Record the event_type and properties in the cookie jar for potential re-transmission */
        var storeEvent = function(event_type, properties) {
            dLog("storeEvent " + event_type);

            var store_info = scanEventStore(true, true);
            var matching = store_info[0];
            var first_avail_slot = store_info[1];
            var props = gen_properties_to_store(replayMap, properties, package_properties);
            var cookie = data.event_store_prefix + first_avail_slot;

            props['trkevt'] = event_type;
            props['trknum'] = 1;
            props['trkid']  = Math.round(Math.random() * 2000000000);
            props['distinct_id'] = window.mixpanel.get_distinct_id();
            $.cookie(cookie, JSON.stringify(props), { path: '/', expires: timeFromNow(60) });
            return [ props , cookie];
        };

        /* If event_max_attempts == 0, blow away the record immediately
         *                        > 0, consult max attempts prior to removing
         */
        var dropStoredEvent = function(cookie, props, event_max_attempts) {
            dLog("dropStoredEvent: event_max_attempts=" + event_max_attempts + " trknum=" + props['trknum']);
            if (props['trknum'] >= event_max_attempts) {
                dLog("  ..dropping track event: " + cookie);
                $.removeCookie(cookie, { path: '/' } );
            }
        };

        var new_cleanup_cb  = function(event_type, props, cookie) {
            return function(success) {
                dLog("Got " + event_type + " callback: cookie=" + cookie + " success=" + success + " trkid=" + props['trkid']);
                dropStoredEvent(cookie, props, success ? 0 : data.event_max_attempts);
            };
        };

        var storeAndForwardEvent = function(event_type, properties, cookie) {
            try {
                if (cookie != null) {  // When the cookie is specified, we operate on the named slot
                    dLog("  ..examining event: cookie=" + cookie);
                    dLog(properties);
                    properties['trknum'] += 1;
                    $.removeCookie(cookie, { path: '/' } );
                    $.cookie(cookie, JSON.stringify(properties), { path: '/', expires: timeFromNow(60) });

                    dLog("  ..dispatching event: cookie=" + cookie + " trknum=" + properties['trknum']);
                    properties['tracked_at'] = $.now();
                    window.mixpanel.track(event_type, properties, new_cleanup_cb(event_type, properties, cookie));
                }
                else {  // Otherwise, we first need to store and obtain a named slot
                    var results = storeEvent(event_type, properties);
                    var props = results[0];
                    var cookie = results[1];
                    dLog("  ..tracking " + event_type + " cookie=" + cookie);
                    properties['tracked_at'] = $.now();
                    window.mixpanel.track(event_type, properties, new_cleanup_cb(event_type, props, cookie));
                }
            } catch (err) {
                consoleLog(err);
            }
        };

        /* Re-transmit all previous unsuccessfully dispatched events that
         * are still resident within the cookie-bound Event Store 
         * unsuccessful events.
         */
        var dispatchStoredEvents = function() {
            try {
                dLog("dispatchStoredEvents");
                var store_info = scanEventStore(true, true);
                var matching = store_info[0];

                for (var i=0; i<matching.length; i++) {
                    storeAndForwardEvent(matching[i][2]['trkevt'], matching[i][2], matching[i][0]);
                }
            } catch (err) {
                consoleLog(err);
            }
        };

        /* Helper function that combines user- and package-suppiled properties into
         * a single payload that will be placed into the Event Store
         * Args:
         *   to_include     - hash with the keys that we want to pull out from props_superior and props_inferior
         *   props_superior - preferentially take key/value pairs from this hash
         *   props_inferior - if particular key/value pair not in props_superior, pull from here
         * Returns: result hash
         */
        var gen_properties_to_store  = function(to_include, props_superior, props_inferior) {
            var props = { };
            for (var key in props_inferior) {
                if (to_include.hasOwnProperty(key) && props_inferior[key] != null && props_inferior[key] != "") {
                    props[key] = props_inferior[key];
                }
            }
            for (var key in props_superior) {
                if (to_include.hasOwnProperty(key) && props_superior[key] != null && props_superior[key] != "") {
                    props[key] = props_superior[key];
                }
            }
            return props;
        }    

        function merge(dst, src, preserve) {
            if (typeof dst == "undefined" || dst == null) {
                dst = { };
            }
            for (var key in src) {
                if (src.hasOwnProperty(key)) {
                    if (preserve && dst.hasOwnProperty(key)) {
                        continue;
                    }
                    dst[key] = src[key];
                }
            }
            return dst;
        }

        var track_client_event = function(event_category, event, status, meta) {
            var gfmData = {
                'event_category': event_category,
                'event': event
            };
            if (status !== null && status !== undefined) {
                if (status === 'success' || status === 'fail') {
                    gfmData.status = status;
                } else {
                    consoleLog('Error: "status" passed into track_client_event must be either success|fail');
                }
            }
            if (meta !== null && meta !== undefined) {
                gfmData.meta = meta;
            }
            // Track with GFM analytics and GA
            track_event('web_client_event',
                {
                    'gfm': gfmData
                });
        };

        /* store_event controls event pushing of event object into retry store; optional; default=true */
        var track_event = function(event_type, properties, store_event) {

            store_event = typeof store_event !== 'undefined' ?  store_event : true;

            try {
                dLog('track_event ' + event_type);

                var data_props = { }
                for (var mapkey in dataMap) {
                    if (data[dataMap[mapkey]] != '') {
                        data_props[dataMap[mapkey]] = data[dataMap[mapkey]];
                    }
                }

                var gfm_attrs     = merge(merge(data['gfm'], event_properties['gfm']), properties['gfm']);
                var send_props    = merge(merge(data_props, event_properties), properties);
                send_props['gfm'] = gfm_attrs;

                delete send_props['out_rcid_candidates'];

                if (properties.hasOwnProperty('out_rcid')) {
                    var rc = findRefCode(properties['out_rcid']);
                    if (rc) {
                        send_props['out_referer_code'] = findRefCode(properties['out_rcid']);
                    }
                }

                if (!send_props.hasOwnProperty('viewid') && data.viewid != '') {
                    send_props['viewid'] = data.viewid;
                }

                send_props['viewrid'] = data.viewrid + '-' + data.view_count;
                if (event_type == 'mp_page_view') {
                    data.view_count += 1;
                    data.rendered_at = $.now();
                    data.last_event_at = data.rendered_at;
                    data.event_at = data.rendered_at;
                    send_props['rendered_at'] = data.rendered_at;
                }
                else if (event_type == 'mp_page_click') {
                    data.last_event_at = data.event_at == 0 ? data.rendered_at : data.event_at;
                    data.event_at = $.now();
                    send_props['rendered_at'] = data.rendered_at;
                    send_props['last_event_at'] = data.last_event_at;
                    send_props['event_at'] = data.event_at;
                }

                if (data.event_store && store_event) {
                    dLog("storeAndForward");
                    storeAndForwardEvent(event_type, send_props, null);
                }
                else {
                    dLog("sendStraightThrough");
                    mixpanel.track(event_type, send_props);
                }
            } catch (err) {
                consoleLog(err);
            }

        };

        function copy_hash(hash) {
            var res = { };
            for (var key in hash) {
                if (hash.hasOwnProperty(key)) { res[key] = hash[key]; }
            }
            return res;
        }

        function merge_hash(dst, src, preserve) {
            for (var key in src) {
                if (src.hasOwnProperty(key)) {
                    if (preserve && dst.hasOwnProperty(key)) {
                        continue;
                    }
                    dst[key] = src[key];
                }
            }
        }

        var track_share = function(rcid_key, properties) {
            var props = copy_hash(properties);
            var cached_ref_code = findRefCode(rcid_key);

            if (properties['referer_code']) {
                props['out_rcid'] = rcid_key;
                props['out_referer_code'] = properties['referer_code'];
                props['out_referer_code']['rcid'] = rcid_key;
            }
            else if (cached_ref_code) {
                props['out_rcid'] = rcid_key;
                props['out_referer_code'] = cached_ref_code;
            }

            if (data.event_store) {
                storeAndForwardEvent('mp_referer_code', props, null);
            }
            else {
                mixpanel.track('mp_referer_code', props);
            }
        };

        var track_referer_code = function(rcid_key) {
            if (data.event_store) {
                storeAndForwardEvent('mp_referer_code', { 'out_referer_code' : findRefCode(rcid_key) }, null);
            }
            else {
                mixpanel.track('mp_referer_code', { 'out_referer_code' : findRefCode(rcid_key) });
            }
        };

        var addPackageProperty = function(key, value) {
            package_properties[key] = value;
        };

        var addEventProperty = function(key, value) {
            event_properties[key] = value;
        };

        var getPackage = function() {
            try {
                package_properties['user_agent'] = navigator.userAgent;
            } catch (err) {
                consoleLog(err);
            }

            return package_properties;
        };

        var getEventProperties = function() {
            return event_properties;
        };

        var setData = function(key, value) {
            try {
                if(dataMap.hasOwnProperty(key)) {
                    if (key == 'fud') { value = value || $.cookie('fuid');; }
                    if (key == 'flw') { value = value || JSON.parse($.cookie('flow')); }
                    if (key == 'gfm') {
                        merge(data.gfm, value); // value is a hash
                    }
                    else {
                        data[dataMap[key]] = value;
                    }
                }
                if (key === 'u') { setUserExists(true); }
                if (key === 'p') { setPersonExists(true); }
                //if (key === 'fi' || key === 'fn' || key === 'fu') { setFundExists(true); }
                //if (key === 'di' || key === 'da' || key === 'dz' || key === 'dcc' || key === 'dct' || key === 'de') { setDonationExists(true); }
                if (key === 'ir') { setInRcExists(true); }

                //if (key === 'a') { package_properties['anonid'] = data.anonid; }

                //if (key === 'di')  { package_properties['donation_id'] = data.donation_id; }
                //if (key === 'fud') { package_properties['fuid'] = data.fuid; }
                //if (key === 'evi') { package_properties['experimentvariant_ids'] = data.experimentvariant_ids; }
                //if (key === 'pcd') { package_properties['pc_code'] = data.pc_code; }
                //if (key === 'ra')  { package_properties['rendered_at'] = data.rendered_at; }
                //if (key === 'vi')  { package_properties['viewid'] = data.viewid; }
                //if (key === 'vri') { package_properties['viewrid'] = data.viewrid + '-' + data.view_count; }
                //if (key === 'flw') { package_properties['flow'] = data.flow; }
                //if (key === 'gfm') { package_properties['gfm'] = data.gfm; }
            } catch(err) {
                consoleLog(err);
            }
        };


        function getXPathLike(element, with_id, with_class)
        {
            var xpath = '';
            for ( ; element && element.nodeType == 1; element = element.parentNode )
            {
                id = element.getAttribute('id');
                cl = element.getAttribute('class');
                if (cl) {
                    cl = cl.replace(/^\s*/, '.').replace(/\s+/g, '.')
                }
                var pos = $(element.parentNode).children(element.tagName).index(element) + 1;
                pos > 1 ? (pos = '[' + pos + ']') : (pos = '');
                xpath = '/' + element.tagName.toLowerCase() + pos + (with_id && id ? '#' + id : '') + (with_class && cl ? cl : '') + xpath;
            }
            return xpath;
        };


        function getParentPanels(element) {
            var panels = [ ];
            for ( ; element && element.nodeType == 1; element = element.parentNode )
            {
                var panel = element.getAttribute('data-tk-panel');
                if (panel) {
                    panels.push({panel: panel});
                }
            }
            //panels.push({panel: data.viewid});
            return panels;
        };

        // Returns the attribute
        function closestAttributeValue(element, attribute) {
            for ( ; element && element.nodeType == 1; element = element.parentNode )
            {
                value = element.getAttribute(attribute);
                if (value) {
                    return value;
                }
            }
            return null;
        };

        var setMatchRule = function(view, tags, events) {
            if ((view != 'all' && view.length < 5) || tags.length < 1 || events.length < 1) { return; }
            var t = { },
                e = { };

            for (var i=0; i<tags.length; i++) { t[tags[i].toLowerCase()] = 1; }
            for (var i=0; i<events.length; i++) { e[events[i].toLowerCase()] = 1; }

            dEvtLog('verbose', 'data.match_rule (1) = ' + JSON.stringify(data.match_rules));
            data.match_rules.push({ view: view, tags: t, events: e });
            dEvtLog('verbose', 'data.match_rule (2) = ' + JSON.stringify(data.match_rules));
        }

        function matchesRule(event, view_stack) {
            var target = event.target || event.srcElement;
            var rules = data.match_rules;
            var tag = (target.tagName || "").toLowerCase();
            var event_type = (event.type || "").toLowerCase();

            if (!tag || !event_type) { return; }

            dEvtLog('verbose', "Rules:    " + JSON.stringify(rules));
            dEvtLog('verbose', "   View Stack: " + JSON.stringify(view_stack));
            for (var r=0; r<rules.length; r++) {
                var view_match = false;
                if (rules[r]['view'] == 'all') { view_match = true; dEvtLog('verbose', "   ALL!"); }
                else {
                    for (var v=0; v<view_stack.length; v++) {
                        if (view_stack[v].indexOf(rules[r]['view']) >= 0) {
                            view_match = true;
                            break;
                        }
                    }
                }
                if (view_match) {
                    dEvtLog('verbose', "   Looking for: " + tag);
                    if (rules[r]['tags'].hasOwnProperty(tag)) {
                        if (rules[r]['events'].hasOwnProperty(event_type)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        var matching_events = { 'focus': 'focus', 'click': 'click' };

        var eventHandlerJS = function(ev_name, _ev) {

            dEvtLog('verbose', "EV TYPE: " + _ev.type);
            if (!matchesRule(_ev)) {
                return;
            }

            var ev = _ev || window.event;

            var id;
            var target = ev && (ev.target || ev.srcElement);
            var context = target._gfm_analytics_event_context = 
                target._gfm_analytics_event_context || { props: { }, events: [ ], handled: false };

            context['events'].push(ev_name);

            if (context['handled']) { return; };
            context['handled'] = true;

            // We're only interested in mouse click events and keyboard focus events
            if ( ! matching_events.hasOwnProperty(ev_name)) { return; }

            var props = context['props'] = {
                event: matching_events[ev_name],
                elid_type: undefined,
                elid: undefined,
                elpath: getXPathLike(target, false, false)
            };

            // Why in the world does this return undefined??
            data.xx_tag = target.tagName;
            // Whereas going to the JS debug console and accessing xx_ev.tagName yields the proper value??
            data.xx_ev = target;

            props.viewid = data.viewid;

            props.panels = function(panels) {
                var res = "";
                for (var i=0; i<panels.length; i++) {
                    if (res.length!=0) { res += ","; }
                    res += panels[i]['panel'];
                }
                return res;
            } (getParentPanels(target));

            if (target.getAttribute != undefined) {
                if ((id = target.getAttribute('data-tk-elid')) != undefined) {
                    props['elid_type'] = 'elid';
                    props['elid']    = id;
                }
                else if ((id = target.getAttribute('data-gfm-analytics-element')) != undefined) {
                    props['elid_type'] = 'elem';
                    props['elid']    = id;
                }
                else if ((id = target.getAttribute('id')) != undefined) {
                    props['elid_type'] = 'id';
                    props['elid']    = id;
                }
            }

            setTimeout(function() {
                var events = context['events'];
                var nb_click = 0;
                var nb_focus = 0;
                for (i=0; i<events.length; i++) {
                    if (events[i] == 'mousedown' || events[i] == 'click') {
                        nb_click += 1;
                    } else if (events[i] == 'focus') {
                        nb_focus += 1;
                    }
                }

                context['props']['event'] = (nb_click && 'click') || (nb_focus && 'tab_focus') || 'unknown';

                dEvtLog('debug', context['props']);

                track_event('clickstream', { gfm: context['props'] } );

                setTimeout(function(){
                    delete target._gfm_analytics_event_context;
                }, 250);  // debounce

            }, 50);  // Wait for all related events to finish up (e.g.: focus precedes click)

        };

        var pokeListener = function(event) {
            dEvtLog('verbose', "POKE: " + event.type);
        };

        var trackView = function(elements) {

            dEvtLog('verbose', "TRACK VIEW");

            if (!elements) {
                dEvtLog('verbose', "Unsufficient data - skipping");
                return;
            }

            var tags = [ 'input', 'a', 'textarea', 'div', 'span', 'img' ];

            for (var e=0; e<elements.length; e++) {
                for (var t=0; t<tags.length; t++) {
                    var targets = elements[e].getElementsByTagName(tags[t]);
                    for (var i=0; i<targets.length; i++) {
                        //$(targets[i]).on('mousedown', pokeListener).on('click', pokeListener).on('focus', pokeListener);
                        $(targets[i]).on('click', pokeListener).on('focus', pokeListener);
                    }
                }
            }

            return;

        };

        return {
            data: data,
                getEventProperties: getEventProperties,
                getAnonId: getAnonId,
                getUser: getUser,
                getPerson: getPerson,
                getFund: getFund,
                getDonation: getDonation,
                getInRc: getInRc,
                setData: setData,
                userExists: userExists,
                personExists: personExists,
                fundExists: fundExists,
                donationExists: donationExists,
                inRcExists: inRcExists,
                outRcExists: outRcExists,
                track_referer_code: track_referer_code,
                track_share: track_share,
                track_client_event: track_client_event,
                track_event: track_event,
                addPackageProperty: addPackageProperty,
                addEventProperty: addEventProperty,
                getPackage: getPackage,
                getGaDataLayer: getGaDataLayer,
                dispatchStoredEvents: dispatchStoredEvents,
                eventHandlerJS: eventHandlerJS,
                trackView: trackView,
                poke: pokeListener,
                setMatchRule: setMatchRule


        };
    })(GFM, jQuery);

    $(document).ready(function() {
        if (GFM.analytics.data.event_store) {
            GFM.analytics.dispatchStoredEvents();
        }
    });

} catch(e) {
    if (window.console) {
        window.console.log("GFM.analytics NOT loaded.");
    }
}
