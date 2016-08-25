var GFM = GFM || {};

GFM.signupAnalytics = (function (GFM, $) {

    /**
     * SignUp elements to be tracked
     * @type Object
     */
    var signUpElements = {
        btn_header_signup: {
            events: ['click']
        },
        btn_home_signup: {
            events: ['click']
        },
        btn_footer_signingupisfree: {
            events: ['click']
        },
        btn_mobilehome_signup_large: {
            events: ['click']
        },
        btn_sign_up_facebook: {
            events: ['click']
        },
        btn_sign_up_email: {
            events: ['click']
        },
        input_first_name: {
            events: ['blur']
        },
        input_last_name: {
            events: ['blur']
        },
        input_email: {
            events: ['blur']
        },
        input_email_confirm: {
            events: ['blur']
        },
        input_password: {
            events: ['blur']
        },
        btn_sign_up_submit: {
            events: ['click']
        }
    };

    /**
     * SignIn elements to be tracked
     * @type Object
     */
    var signInElements = {
        btn_sign_in: {
            events: ['click']
        },
        btn_mobilehome_signin: {
            events: ['click']
        },
        input_sign_in_email: {
             events: ['blur']
        },
        input_sign_in_password: {
             events: ['blur']
        },
        btn_sign_in_submit: {
             events: ['click']
        },
        btn_sign_in_facebook: {
             events: ['click']
        }
    };

    /**
     * Customize Create elements to be tracked
     * @type Object
     */
    var customizeCreateElements = {

        // Details
        input_fund_goal: {
            events: ['blur']
        },
        input_fund_title: {
            events: ['blur']
        },
        input_fund_zip: {
            events: ['blur']
        },
        select_fund_theme: {
            events: ['click']
        },
        btn_fund_details_submit: {
            events: ['click']
        },
        btn_country_confirm_yes: {
            events: ['click']
        },
        btn_country_confirm_no: {
            events: ['click']
        },
        btn_country_confirm_cancel: {
            events: ['click']
        },
        btn_country_confirm_help: {
            events: ['click']
        },

        // Photo/media picker
        btn_add_facebook_photo: {
            events: ['click']
        },
        btn_upload_photo: {
            events: ['click']
        },
        btn_add_media_video: {
            events: ['click']
        },
        input_media_video: {
            events: ['blur']
        },
        btn_media_video_attach: {
            events: ['click']
        },
        btn_media_video_next: {
            events: ['click']
        },
        btn_media_picker_prev: {
            events: ['click']
        },

        // Photo display/adjust
        btn_photo_tool_position: {
            events: ['mousedown', 'touchstart']
        },
        btn_photo_tool_rotate: {
            events: ['click']
        },
        btn_photo_tool_remove: {
            events: ['click']
        },
        btn_photo_tool_set_position: {
            events: ['click']
        },
        btn_photo_tool_prev: {
            events: ['click']
        },
        btn_photo_tool_submit: {
            events: ['click']
        },

        // Description
        input_fund_desc: {
            events: ['blur']
        },
        btn_fund_desc_bold_text: {
            events: ['click']
        },
        btn_fund_desc_insert_link: {
            events: ['click']
        },
        btn_fund_desc_add_content: {
            events: ['click']
        },
        btn_fund_desc_more_text: {
            events: ['click']
        },
        btn_fund_desc_insert_media: {
            events: ['click']
        },
        btn_fund_desc_preview: {
            events: ['click']
        },
        btn_fund_desc_rotate_photo: {
            events: ['click']
        },
        btn_fund_desc_remove_photo: {
            events: ['click']
        },
        btn_fund_desc_save_photo: {
            events: ['click']
        },
        btn_fund_desc_prev: {
            events: ['click']
        },
        btn_fund_desc_save: {
            events: ['click']
        },
        btn_fund_desc_submit: { 
            events: ['click']
        },

        // Reward levels
        btn_fund_desc_reward_level: {
            events: ['click']
        },
        btn_fund_desc_wish_list: {
            events: ['click']
        },
        input_reward_level_amount: {
            events: ['blur']
        },
        check_reward_set_limit: {
            events: ['click']
        },
        input_reward_level_name: {
            events: ['blur']
        },
        input_reward_level_quantity: {
            events: ['blur']
        },
        input_reward_level_desc: {
            events: ['blur']
        },
        btn_reward_level_save: {
            events: ['click']
        },

        // Wish lists
        input_wish_list_amount:{
            events: ['blur']
        },
        input_wish_list_name:{
            events: ['blur']
        },
        input_wish_list_search:{
            events: ['blur']
        },
        btn_wish_list_search:{
            events: ['click']
        },
        btn_wish_list_search_back:{
            events: ['click']
        },
        btn_wish_list_search_next:{
            events: ['click']
        },
        btn_wish_list_save: {
            events: ['click']
        },
        btn_fund_addon_switch: {
            events: ['click']
        },
        btn_fund_addon_manage: {
            events: ['click']
        },

        // Facebook photo
        btn_facebook_photo_prev: {
            events: ['click']
        },
        btn_facebook_photo_skip: {
            events: ['click']
        },
        btn_facebook_photo_important_prev: {
            events: ['click']
        },
        btn_facebook_photo_important_skip: {
            events: ['click']
        },

        // Verification
        input_verification_phone: {
            events: ['blur']
        },
        input_verification_method_sms: {
            events: ['click']
        },
        input_verification_method_voice: {
            events: ['click']
        },
        btn_verification_send_code: {
            events: ['click']
        },
        btn_verification_skip: {
            events: ['click']
        },

        // Contacts
        input_invite_contacts_email: {
            events: ['blur']
        },
        btn_contacts_import_gmail: {
            events: ['click']
        },
        btn_contacts_import_yahoo: {
            events: ['click']
        },
        btn_contacts_import_hotmail: {
            events: ['click']
        },
        btn_invite_contacts_prev: {
            events: ['click']
        },
        btn_invite_contacts_skip: {
            events: ['click']
        },
        btn_invite_contacts_cancel: {
            events: ['click']
        },
        btn_invite_contacts: {
            events: ['click']
        }
    };

    /**
     * Campaign share elements to be tracked
     * @type Object
     * 
     *  TODO: Tracking of the share flow has not yet been activated by adding the data-gfm-analytics-element
     *  attribute in the associated templates. 
     *  
     *  When/if this is done, renaming GFM.signupAnalytics to something more general might be appropriate.
     *  This list of elements would also be expanded to include other share-related actions.
     */
    var campaignShareElements = {

        // Facebook
        btn_facebook_share: {
            events: ['click']
        },
        btn_facebook_share_skip: {
            events: ['click']
        },
        btn_facebook_share_prev: {
            events: ['click']
        }
    }

    /**
     * Google Analytics Categories
     * Sections or flows to be tracked
     * @type Object
     */
    var trackingCategories = {
        signUp: 'co_sign_up',
        signIn: 'co_sign_in',
        campaignCreation: 'co_campaign_creation',
        campaignShare: 'co_campaign_share'
    };

    /**
     * Tracking events
     * @type Object
     */
    var track = {
        /**
         * Used for basic event tracking
         * Good for events such as click, blur, focus, etc
         * @param event
         */
        event : function(event) {
            if (event.data
                && event.type
                && event.data.hasOwnProperty('category')
                && event.data.hasOwnProperty('id')
            ) {
                /*
                 * Google Analytics tracking
                */
                GFM.gaEventTracking.trackEvent(event.data.category, event.type, event.data.id, event.data.value);

                /*
                 * Redshift tracking
                */
                var datum = {
                    'elementid': event.data.id,
                    'viewid': GFM.analytics.data.viewid,
                    'gfm': {
                        'event_category': event.data.category,
                        'event': event.type + '_' + event.data.id
                    }
                };

                // If this is a blur event, grab the text of the input
                if(event.type === 'blur'){
                    var target = $(event.target);

                    // Don't send passwords
                    if(!target.is('[type="password"]')){
                        var inputValue = target.val();
                        if(typeof(inputValue) !== 'undefined'){
                            datum.gfm.event_meta = inputValue.substring(0,64);
                        }
                    }
                }
                GFM.analytics.track_event('mp_page_click', datum);

                // Debug
                if (!window.dataLayer || !(window.dataLayer instanceof Array)) {
                    var textValue = typeof(datum.gfm.event_meta) !== 'undefined' ? datum.gfm.event_meta : 'none';
                    console.log('\n' + datum.gfm.event_category + ' | ' + datum.gfm.event + ' | mp_page_click | ' + datum.viewid + ' | ' + datum.elementid + ' | ' + textValue);
                }   
            }
        },

        /**
         * Manual trigger for custom events
         * @param data
         */
        custom : function(data) {
            if (data.hasOwnProperty('category') && data.hasOwnProperty('event')) {

                /*
                 * Google Analytics tracking
                */
                GFM.gaEventTracking.trackEvent(data.category, data.event, data.view);

                /*
                 * Redshift tracking
                */
                var datum = {
                    'viewid': GFM.analytics.data.viewid,
                    'gfm': {
                        'event_category': data.category,
                        'event': data.event
                    }
                };

                if(data.hasOwnProperty('meta')){
                    datum.gfm.event_meta = data.meta;
                }

                GFM.analytics.track_event('mp_page_view', datum);

                // Debug
                if (!window.dataLayer || !(window.dataLayer instanceof Array)) {
                    var textValue = typeof(datum.gfm.event_meta) !== 'undefined' ? datum.gfm.event_meta : 'none';
                    console.log('\n' + datum.gfm.event_category + ' | ' + datum.gfm.event + ' | mp_page_view | ' + datum.viewid + ' | ' + textValue);
                }   
            }
        }
    };

    var element = {

        /**
         * Get data associated with key
         * @param key
         * @returns {*}
         */
        data: function (key) {
            var data = null
            if (key in signUpElements) {
                data = signUpElements[key];
                data.category = trackingCategories.signUp;
            } else if (key in signInElements) {
                data = signInElements[key];
                data.category = trackingCategories.signIn;
            } else if (key in customizeCreateElements) {
                data = customizeCreateElements[key];
                data.category = trackingCategories.campaignCreation;
            }
            else if (key in campaignShareElements) {
                data = campaignShareElements[key];
                data.category = trackingCategories.campaignShare;
            }

            if (data !== null) {
                data.id = key;
            }
            return data;
        },

        /**
         * Return element id
         * @param $element
         * @returns {*}
         */
        getId : function ($element) {
            return $element.data('gfmAnalyticsElement');
        },

        /**
         * Return tracked status or set if param provided
         * @param $element
         * @param status
         * @returns {*}
         */
        isTracked : function ($element, status) {
            if (status !== true) {
                $element.data('gfmAnalyticsElementTracked', status);
            }
            return $element.data('gfmAnalyticsElementTracked');
        }
    };


    /**
     * Starts tracking elements on the page
     * We bind directly to the element to get around event.stopPropagation();
     */
    var startTracking = function () {
        $('[data-gfm-analytics-element]').each(function () {
            var $element = $(this);
            if (!element.isTracked($element)) {
                var id = element.getId($element);
                var data = element.data(id);
                if (data && data.hasOwnProperty('events')) {
                    $element.data('gfmAnalyticsElementTracked', true); // Prevents even handler from binding multiple times
                    element.isTracked($element, true);
                    $element.on(data.events.join(' '), data, track.event);
                }
            }
        });
    };

    // Bind events
    try {
        $(function(){
            startTracking();
            // This allows us to bind to new dynamic elements directly
            // instead of binding to the body which has both performance concerns
            // and is unreliable if event.stopPropagation(); is used
            setInterval(startTracking, 500);
        });
    } catch (e) {
        if (window.console) {
            window.console.log('Exception Thrown: ' + e.message);
        }
    }

    return {
        element: element,
        track: track
    };

})(GFM, jQuery);
