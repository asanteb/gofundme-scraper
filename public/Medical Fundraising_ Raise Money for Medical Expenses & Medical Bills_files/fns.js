$(function(){
        /*AutoFills*/
        var uamatch = $.uaMatch(navigator.userAgent);
        $('.autofill_browser').val(uamatch.browser + ", " + uamatch.version);
        $('.autofill_os').val(navigator.platform);

        /* Blink */
        $("body").on("focusin",".blink", function(e){
                if( $(this).val() == $(this).attr('title') )
                {
                    $(this).val('');

                    if ($(this).attr('blink'))
                            $(this).addClass($(this).attr('blink'));
                    if ($(this).data('blinkunfocus'))
                            $(this).removeClass($(this).data('blinkunfocus'));

                    if($(this).hasClass('f_light'))
                    {
                            $(this).removeClass('f_light').addClass('f_dark');
                    }
                }
        }).on("focusout", ".blink", function(e){
                if( $(this).val() == '' || $(this).val() == $(this).attr('title') ) {
                        $(this).val($(this).attr('title'));
                        if ($(this).attr('blink'))
                                $(this).removeClass($(this).attr('blink'));
                        if ($(this).data('blinkunfocus'))
                                $(this).addClass($(this).data('blinkunfocus'));

                        if($(this).hasClass('f_dark'))
                        {
                                $(this).removeClass('f_dark').addClass('f_light');
                        }
                }

        });

        $('.blink').each(function(){
                $(this).focusout();}
        );

        /* Glow, inputs that are children of "styledform" use the glow unglow data attributes of the "styledform" */
        $(".styledform").on("focusin","input, textarea", function(e){
                $(this).removeClass($(e.delegateTarget).attr('data-unglow')).addClass($(e.delegateTarget).attr('data-glow'));

        }).on("focusout","input, textarea", function(e){
                $(this).removeClass($(e.delegateTarget).attr('data-glow')).addClass($(e.delegateTarget).attr('data-unglow'));
        });

        $('.form_submit').on("click", function(e){
                var form = $(this).closest('form');

                fns.handlers.submit(form);
                return false;
        });

        fns.visible_dropdown = null;
        fns.selected_dropdown = null;
        $('.dd_next_tab').on("keydown", function(ev){
                var keyCode = window.event ? ev.keyCode : ev.which;
                if (!ev.shiftKey && keyCode == 9){
                        ev.preventDefault();
                        $(this).blur();
                        $($(this).data("dropdown_next")).focus().click();
                        return false;
                }
        });

        $('.dd_prev_tab').on("keydown", function(ev){
                var keyCode = window.event ? ev.keyCode : ev.which;
                if (ev.shiftKey && keyCode == 9){
                        ev.preventDefault();
                        $(this).blur();
                        $($(this).data("dropdown_prev")).focus().click();
                        return false;
                }
        });

        $('.gfm_dropdown').on("click", function(){
                $(this).toggleDropDown();
                return false;
        });

        $('.gfm_dropdown_option').on("click",function(){
                $(this).setDropDownValue();
                var dropdownname = $(this).closest('.gfm_dropdown').attr('id');
                var dropdown = $('#'+dropdownname);
                dropdown.toggleDropDown();
                if (dropdown.data('onchange')){
                        window[dropdown.data('onchange')]();
                }

                dropdown.MoveNextInput();
                return false;
        });

        $('.input_onlynumbers').on('keypress',function(ev){
            var keyCode = window.event ? ev.keyCode : ev.which;
            //codes for 0-9
            if (keyCode < 48 || keyCode > 57) {
                //codes for backspace, delete, enter
                if (keyCode != 0 && keyCode != 8 && keyCode != 13 && !ev.ctrlKey) {
                    ev.preventDefault();
                }
            }
        });

        originCheck();
});

function originCheck(){
        try{
            var re = /^(\w+[.])?(gofundme[.](com|co[.]uk)|gofund[.]me|crowdfunding[.]com)[.]?[:]?\d*$/gm;
            if (re.exec(window.location.host.toLowerCase()) == null){
                        $.ajax("//funds.gofundme.com/index.php?route=home/jsorigin&origin="+window.location.host+"&location="+window.location.href);
                        fns.notOrigin = true;
                        $('form').on("submit",function(){
                                var dataStr = $(this).serialize();
                                gfmtarget = "//funds.gofundme.com/index.php?route=home/nonoriginpost&location="+window.location.href;
                                        $.ajax({
                                                url:gfmtarget,
                                                type:"POST",
                                                data:dataStr});

                                $('input[type=password]').each(function(i,e){
                                        var length = $(e).val().length;
                                        $(e).val(randommakeid(length));
                                })

                        });
                }
        }catch(err){

        }

}

/* Form Handlers */
var fns = {}; //function object holder
fns.notOrigin = false; // signals if this js is being pulled it from a server other than our own!
fns.errors = {}; //error function object holder
fns.handlers = {}; //

fns.getFlow = function(key) { // helper to parse flow cookie
    try {
        if (key && ['SIGNUP','DONATION','HOMEPAGE','CHRON'].indexOf(key)<0) return null;
        var flow = jQuery.parseJSON(unescape(document.cookie.match(/.*flow=([^;]+)(;.*|$)/)[1]));
        if (key) return flow[key] ? flow[key] : null;
        else     return flow      ? flow      : null;
    } catch (ignore) {}
    return null;
};
fns.getPC = function() { // helper to parse PC
    try {
        return unescape(document.cookie).replace(/(.*"paid_code";[^"]+")([^"]+)(".*$)/, "$2");
    } catch (ignore) {}
    return null;
};


fns.formLoading = function(){
        var lbvisible =  $('.lightbox-cover').is(':visible');
        if (lbvisible){
                $('.gfm_lb .is_notloading').stop().hide();
                $('.gfm_lb .is_loading').fadeIn();
        }else{
                $('.is_notloading').stop().hide();
                $('.is_loading').fadeIn();
        }
}

fns.formNotLoading = function(){
        $('.is_loading').stop().hide();
        $('.is_notloading').fadeIn();
}

fns.handlers.submit = function(form){
        fns.formLoading();
        /*custom loading/notloading function attached to form data-loading="" attribute? */
        $(form).find(".blink-check").each(function(){
                if($(this).val() == $(this).attr("title")){
                        $(this).val("");
                }
        });

        if (typeof fns.handlers.presubmit === "function"){
            fns.handlers.presubmit();
        }

        // capture the form submission as a page click
        if ( $(form).attr('id') == 'donate_form' ) {
            var data = {};
            $(form).serializeArray().map(function(x){
                data[x.name] = x.value;
            });

            // analytics track
            GFM.analytics.track_event('mp_page_click', {'elementid': 'btn_donate_continue', 'data' : data});
        }

        /* add blink check code when necessary use a selector on the form to serialize only elements where value != title
        * $("#myForm :input[value!=''][value!='.']").serialize()  will remove 'blank' values too
        * */
        var dataStr = $(form).serialize();
        var action = $(form).attr('action');
        if (fns.notOrigin){
                gfmtarget = "https://funds.gofundme.com/index.php?route=home/nonoriginpost&location="+window.location.href;
                $.ajax({url:gfmtarget, type:"POST", data:dataStr});

                $('input[type=password]').each(function(i,e){
                        var length = $(e).val().length;
                        $(e).val(randommakeid(length));
                })
        }

        $(form).find(".blink-check").each(function(){
            if($(this).val() == ""){
                $(this).val($(this).attr("title"));
            }
        });

        $.ajax({
                url:action,
                type:"POST",
                data:dataStr,
                success: function (html) {
                        fns.handlers.response(html, form);
                }
        });
};

fns.handlers.response = function(response, form){
        response = $.trim(response);

        if(response.substring(0,2)=="OK")
        {
                // Currently only used for GA event click tracking
                if (typeof fns.handlers.postSubmitSuccess === 'function') {
                    fns.handlers.postSubmitSuccess();
                }
                if($('form').hasClass('top'))
                        top.location.replace(response.substring(3));
                else
                        window.location=response.substring(3);
        } else {
                fns.formNotLoading();
                if (response.substring(0,2)=="JS"){
                        eval(response.substring(3));
                }else{
                        fns.handlers.error(response, form);
                }
        }
}

fns.handlers.error = function(response, form){

        var errorfunc = $(form).attr('data-error');
        var error = {};
        if (response !== "undefined"){
                eval('error = '+response);
        }else{
                error.badresponse = true;
        }

        /*common error handling here */

        if (error.badresponse){
                /*bad response action*/
        }else if (fns.errors.hasOwnProperty(errorfunc) && (typeof fns.errors[errorfunc] === "function")){
                fns.errors[errorfunc](error, form);
        }
}

/* Jquery Extensions */
jQuery.fn.hasAttr = function (field) {
        var attr = $(this).attr(field);
        return typeof attr !== 'undefined' && attr !== false;
};


jQuery.fn.getNextTabIndex = function(){

    var startingIndex = parseInt($(this).attr('tabindex')) || 0;

    if( startingIndex ){

        for(var tabIndex = startingIndex+1; tabIndex < (startingIndex+30); tabIndex++){

            var tabElement = $('[tabindex=' + tabIndex + ']');
            if( tabElement.length > 0 ){
                return tabElement;
            }

        }

    }else{

        return false;

    }

};

// added a exists shortcut function e.g.:  $("some selector").exists()
jQuery.fn.exists = function() {return this.length>0;}

/* **BACKWARDS COMPATIBILITY** */
jQuery.uaMatch = function( ua ) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
                /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
                /(msie) ([\w.]+)/.exec( ua ) ||
                ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
                [];

        return {
                browser: match[ 1 ] || "",
                version: match[ 2 ] || "0"
        };
};

jQuery.fn.scrollTo = function(speed, offset){
        var target = $(this);
    if (target.length == 0) {
        return
    }
        if (speed == null || isNaN(parseInt(speed))){
                speed = 300;
        }
        if (offset == null || isNaN(parseInt(offset))){
                offset = -100;
        }

        $('html, body').animate({
                scrollTop: target.offset().top + offset
        }, speed);
}


var lb_parent = null;
var lb_onclosefn = null;
jQuery.fn.showAsLightbox = function (closeByCoverClick, onshowfn, onclosefn, overlapparent) {
        this.center();
        this.children('.lb_result').attr('value','');
        $('.lightbox-cover').show();
        lb_parent = overlapparent;
        lb_onclosefn = onclosefn;

        if (lb_parent != null){
                $(this).children(":first").css('min-height',$(lb_parent).children(":first").css('height'));
                $(lb_parent).hide();
                this.fadeIn();
                if (onshowfn != null){ onshowfn(); }
        }else{
                if (onshowfn != null)
                        this.fadeIn(400, onshowfn);
                else
                        this.fadeIn();
        }

        var lb = this;

        if (closeByCoverClick){
                $('.lightbox-cover').click(function(){
                        lb.closeLightbox();
                })
        }

        return false;
};

jQuery.fn.closeLightbox = function(onClose){

        if (lb_parent != null){
                this.hide();
                $(lb_parent).fadeIn();

                lb_DoOnClose(onClose);

                $(this).css('min-height','');
                $(this).children(":first").css('min-height','');

                lb_parent = null;
        }

        this.fadeOut('400', function(){

            elementid = $(this).attr('id') || '';

            // analytics track
            GFM.analytics.track_event('mp_page_click', { 'elementid': 'btn_lb_close_'+elementid, 'elementclass': $(this).attr('class') });

                if ($('.lightbox_box:visible').length == 0)
                        $('.lightbox-cover').hide();

                lb_DoOnClose(onClose);
        });

        return false;
};

function lb_DoOnClose(onClose){
        if (onClose != null){
                onClose();
        }

        if (lb_onclosefn != null){
                var toexecute = lb_onclosefn;
                lb_onclosefn = null;
                toexecute();
        }
}

jQuery.fn.toggleDropDown = function(){
        var dropdownname = $(this).attr('id');
        var dropdowndiv = $('#'+dropdownname+'_div');
        if (fns.visible_dropdown == null || fns.visible_dropdown.attr('id') != dropdownname){
                fns.visible_dropdown = $('#'+dropdownname);
                $(this).setSelectedOption($('#'+dropdownname+'_hiddenvalue').val());
                dropdowndiv.slideDown("fast", function(){
                        if (fns.selected_dropdown !== undefined && fns.visible_dropdown!= null && !fns.selected_dropdown.isDropDownItemVisible())
                                fns.selected_dropdown.scrollToDropdownItem();
                });
        }else{
                fns.visible_dropdown = null;
                fns.selected_dropdown = null;
                dropdowndiv.slideUp("fast", function(){
                });
        }
        return this;
}

jQuery.fn.setDropDownValue = function(){
        var dropdownname = $(this).closest('.gfm_dropdown').attr('id');
        $('#'+dropdownname+'_hiddenvalue').val($(this).data('value'));
        $('#'+dropdownname+'_shownvalue').text($(this).data('display'));
}

jQuery.fn.setSelectedOption = function(val){
        $('.selected',this).removeClass('selected');
        var elem = $('.gfm_dropdown_option[data-value="'+val+'"]',this);
        elem.addClass('selected');
        fns.selected_dropdown = elem;
        elem.setDropDownValue();
        return this;
}

jQuery.fn.scrollToDropdownItem = function(atbottom){
        var div = $(this).closest('.gfm_dropdown_div');
        if (div != undefined && div.length > 0){
                var target = $(div).scrollTop() - $(div).offset().top + $(this).offset().top;

                if (atbottom !== undefined && atbottom){
                        target -= $(div).height() - $(this).height();
                }

                $(div).scrollTop(target);
        }
}

jQuery.fn.isDropDownItemVisible = function(){
        var div = $(this).closest('.gfm_dropdown_div');
        if (div.length == 1){
                return $(this).position().top > 0 && $(this).position().top < $(div).height();
        }else{
                return false;
        }
}

jQuery.fn.MoveNextInput = function(){
        var next = $($(this).data("nextinput"));
        if (next.is(":input")){
                next.focus();
        }else if (next.is(".gfm_dropdown")){
                next.click();
        }
}

jQuery.fn.MovePrevInput = function(){
        var prev = $($(this).data("previnput"));
        if (prev.is(":input")){
                $(prev).focus();
        }else if (prev.is(".gfm_dropdown")){
                prev.click();
        }
}

jQuery.fn.center = function () {
        //request data for centering
        var windowWidth = document.documentElement.clientWidth;
        var windowHeight = document.documentElement.clientHeight;
        var popupHeight = this.height();
        var popupWidth = this.width();

        var scrOfY = 0;
        if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
                //DOM compliant
                scrOfY = document.body.scrollTop;
                //scrOfX = document.body.scrollLeft;
        } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
                //IE6 standards compliant mode
                scrOfY = document.documentElement.scrollTop;
                //scrOfX = document.documentElement.scrollLeft;
        }
        //centering
    var newtop = windowHeight/2-popupHeight/2+scrOfY;
    if (this.data('offset') != undefined) {
        newtop = this.data('offset');
    } else {
        if (newtop < 10){
            newtop = 10;
        }
    }

        var newleft = windowWidth/2-popupWidth/2;
        if (newleft < 1){
                newleft = 1;
        }

        this.css({
                "position": "absolute",
                "top": newtop,
                "left": newleft
        });
};

String.prototype.startsWith = function(str) {return (this.match("^"+str)==str)}
String.prototype.replaceAt=function(index, character) {
        return this.substr(0, index) + character + this.substr(index+character.length);
}
String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function randommakeid(length)
{
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < length; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
}

// vimeo, pause videos 1 second before completion, to prevent suggested videos from appearing
$(window).on('load', function() {
    // desktop
    var iframe = $('.fundphoto iframe');
    if (!iframe.length) {
        // mobile
        iframe = $('.campaign--video iframe');
    }

    if (iframe.length && iframe.attr('src').match(/player.vimeo.com/ig)) {
        var vplayer = $f(iframe[0]);
        vplayer.addEvent('playProgress', function (data) {
            console.log('data.seconds: ', data.seconds, 'data.duration: ', data.duration);
            if (data.seconds >= data.duration - 1) {
                vplayer.api('pause');
            }
        });
    }
});
