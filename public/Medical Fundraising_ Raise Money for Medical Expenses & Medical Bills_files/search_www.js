var userAttemptedSearch = false;//this is to make sure that we track this event only once
$(document).ready(function(){

        $('body').click(function() {
                $('.where_drop').hide();
                $('.loc_suggest_drop').hide();
                $('.loc_suggest_drop_top').hide();
                $('.hover').removeClass('hover');
        });

        // Drop input hints when they're clicked and assume focus.
        jQuery('.hinted').click(function(e) {
                e.preventDefault();
                if (jQuery(this).hasClass('hinted')) {
                        jQuery(this).removeClass('hinted');
                        //jQuery(this).val('');
                }
        });

        $("#search_term").on("click", function(){
                var value = $(this).val();

                if(isPotentialPostalCode(value)) {
                        makeSearchLocationSuggest('#search_term', ".loc_suggest_drop");
                }
                else if(isPotentialLocation(value)) {
                        makeSearchLocationTextSuggest('#search_term', '.loc_suggest_drop');
                }
        });

        $("#search_term_top").on("click", function(){
                var value = $(this).val();

                if(isPotentialPostalCode(value)) {
                makeSearchLocationSuggest('#search_term_top', ".loc_suggest_drop_top");
            }
                else if(isPotentialLocation(value)) {
                        makeSearchLocationTextSuggest('#search_term_top', '.loc_suggest_drop_top');
                }
        });


        $("#search_term_top").on("keyup",function(e) {
                return handleSearchKeyup('#search_term_top', ".loc_suggest_drop_top",e);
        });

        $("#search_term").on("keyup",function(e) {
                return handleSearchKeyup('#search_term', ".loc_suggest_drop",e);
        });
});

function handleSearchKeyup(searchField, suggestDrop, e){

    var droptype = getLocDropType(searchField);
    $(searchField).removeClass('error');

    var keyCode = e.keyCode || e.which;
    if(keyCode!=38 && keyCode!=40 && keyCode!=13)
    {
        if ($(searchField).val() != "")
        {
            if (isPotentialPostalCode($(searchField).val()))
                makeSearchLocationSuggest(searchField, suggestDrop);
            else if(isPotentialLocation($(searchField).val())) {
                makeSearchLocationTextSuggest(searchField, suggestDrop);
            }
            else{
                $(suggestDrop).hide();
            }
        }

        return false;
    }
    else if($(suggestDrop).is(":visible"))
    {
        if (keyCode==38 || keyCode==40)
        {
            var i = $('.'+droptype+'.hover', suggestDrop).index(suggestDrop+' > .'+droptype) + keyCode-39;

            $('.loc_drop', suggestDrop).attr('debug',i+", "+(keyCode-39));
            $('.hover', suggestDrop).removeClass('hover');

            if(i>=$('.'+droptype, suggestDrop).length)
                i=0;
            else if (i<-1)
                i=-1;

            $('.'+droptype, suggestDrop).eq(i).addClass('hover');
        }
        else if(keyCode==13)
        {
            if($(suggestDrop).is(":visible"))
            {
                if($('.'+droptype+'.hover', suggestDrop).length==0)
                {
                    gotoTerm(searchField);
                }
                else
                {
                    e.preventDefault();
                    top.location=$('.'+droptype+'.hover').eq(0).attr('href');
                }
            }

        }
    }else if (keyCode == 13)
    {
        gotoTerm(searchField);
    }

    return false;
}

var timeout = false;
function makeSearchLocationSuggest(searchField, suggestDrop)
{
        if (timeout){ clearTimeout(timeout); }
        /*if (v.length == 1){
                $('.loc_suggest_drop').show();
                $('.loc_suggest_drop').html('<a class="loc_suggest"><em>Searching Charities...</em></a>');
        }else*/
        if($(searchField).val().length == 0){
                $(suggestDrop).hide();
        }

        timeout = setTimeout(function(){
                doLocationSearch(searchField, suggestDrop);
        }, 100);

        return false;
}

function doLocationSearch(searchField, suggestDrop){
        var term = $(searchField).val();
        var url = "/iapi/index.php?route=location/zipsearch&exact=1&predict=1&all=1&limit=8&zip="+term;
        var droptype = getLocDropType(searchField);
        var cat = "";

        var baseurl = "//www.gofundme.com/mvc.php?route=search&";

        // Trigger event for analytics below
        if (searchField === '#search_term_top') {
            $(searchField).trigger('gfmSearch.searchTermEntered');
        }

        if (!$(suggestDrop).hasClass('loc_suggest_drop_top')){
                if ($('.search_category_filter').length > 0){
                        baseurl = "//www.gofundme.com/"+$('.search_category_filter').val()+"?";
                }else if ($('.search_partner_filter').length > 0){
                        baseurl = "//www.gofundme.com/partner/"+$('.search_partner_filter').val()+"?";
                }else if($("#subsearchTerm").length > 0){
                        baseurl += "&addterm="+$("#subsearchTerm").val() + "&";
                }
        }
        if (!userAttemptedSearch) {
            GFM.gaEventTracking.trackSearch('user attempted search', "");
            userAttemptedSearch = true;
        }
        $.getJSON(url, null, function(data){

            var html = '<a class="' + droptype + ' searchtermrow" href="javascript:;"  onclick="gotoTerm(\'' + searchField + '\');gaTrackSearch(\'search term click\'); return true;" ><span class="search-result-icon"></span><span class="location_choice" > ' +
                term + '</span></a>';
            $.each(data, function(index, location){

                html += '<a class="' + droptype + '" href="' + baseurl + 'term=' + encodeURIComponent(location.zip_code) +
                    '&country=' + encodeURIComponent(location.country) + '" text2="' + location.locationtext + '" city="'+location.city +
                    '" state="' + location.state_prefix +'" country="' + location.country +
                    '" onclick="gaTrackSearch(\'location search click\'); return true;" > <span class="search-map-marker"></span><span class ="location_choice" value="' +
                    location.locationtext+'">' + location.locationtext + '</span></a>';
            });

            if (html !== ''|| $(suggestDrop).html() === ''){
                $(suggestDrop).html(html);
                if (html != ""){
                        $(suggestDrop).show();
                } else {
                        $(suggestDrop).hide();
                }
            }
        });

        return false;
}

function getLocDropType(searchField){
        var retval = "loc_suggest";
        if ($(searchField).attr('droptype') != null){
                retval = $(searchField).attr('droptype');
        }

        return retval;
}


function gotoTerm(searchField){
    if(searchField == "#search_term_top"){
        // Trigger event for analytics below
        $(searchField).trigger('gfmSearch.searchExecuted');

        if($('#search_term_top').val()==$('#search_term_top').attr('title'))
            return false;

        top.location='https://www.gofundme.com/mvc.php?route=search&term='+encodeURIComponent($('#search_term_top').val());
        return false;
    }else if(searchField == "#search_term"){
        if($('.search-main').length == 0){

            var searchVal = $(searchField).val();

            if(searchVal==$(searchField).attr('title') || searchVal == "")
                return false;

            var destination = 'https://www.gofundme.com/mvc.php?route=search';

            var searchTerm = $("#subsearchTerm").val();

            if($('.head_main .catnotfound').length == 0 && searchTerm !== undefined && !isPotentialPostalCode(searchVal)){
                searchTerm += " AND " + searchVal;
            }else{
                searchTerm = searchVal;
            }

            if ($('.search_location_zip_filter').length > 0){
                destination +="&addterm="+encodeURIComponent(searchVal)
                +"&term="+$('.search_location_zip_filter').val()
                +"&country="+$('.search_location_country_filter').val();
            }else if ($('.search_partner_filter').length > 0) {
                destination ="https://www.gofundme.com/partner/"+$('.search_partner_filter').val()+"?term="+encodeURIComponent(searchTerm);
            }else if ($('.search_category_filter').length > 0){
                destination ="https://www.gofundme.com/"+$('.search_category_filter').val()+"?term="+encodeURIComponent(searchTerm);
            }else{
                destination +="&term="+encodeURIComponent(searchTerm);

                if(isPotentialLocation(searchVal) &&  $("#subsearchTerm").length > 0){
                    destination += "&addterm=" + $("#subsearchTerm").val();
                }
            }

            top.location=destination;
        }else{
            $('.search-main').click();
        }
    }
    GFM.gaEventTracking.trackSearch('search enter', "");
}

function gaTrackSearch(argument) {
    GFM.gaEventTracking.trackSearch(argument, "");
}

function makeSearchLocationTextSuggest(searchField, suggestDrop) {
        if (timeout){ clearTimeout(timeout); }

        if($(searchField).val().length == 0){
                $(suggestDrop).hide();
        }

        timeout = setTimeout(function(){
                doLocationTextSearch(searchField, suggestDrop);
        }, 100);

        return false;
}

var potentialLocation = true;
var lastBadLocationSearch = '';
function doLocationTextSearch(searchField, suggestDrop) {
        var term = $(searchField).val();
        var url = "/iapi/index.php?route=location/locationsearch&exact=0&predict=1&all=1&limit=8&location="+term;
        var droptype = getLocDropType(searchField);
        var cat = "";

        var baseurl = "//www.gofundme.com/mvc.php?route=search&";

        if (!$(suggestDrop).hasClass('loc_suggest_drop_top')){
                if ($('.search_category_filter').length > 0){
                        baseurl = "//www.gofundme.com/"+$('.search_category_filter').val()+"?";
                }else if ($('.search_partner_filter').length > 0){
                        baseurl = "//www.gofundme.com/partner/"+$('.search_partner_filter').val()+"?";
                }else if($("#subsearchTerm").length > 0){
                        baseurl += "&addterm="+$("#subsearchTerm").val() + "&";
                }
        }
        if (!userAttemptedSearch) {
            GFM.gaEventTracking.trackSearch('user attempted search', "");
            userAttemptedSearch = true;
        }
        $.getJSON(url, null, function(data){

            var html = '<a class="' + droptype + ' searchtermrow" href="javascript:;" onclick="gotoTerm(\'' + searchField + '\');gaTrackSearch(\'search term click\'); return true;" data-gfm-analytics-element="btn_home_searchitemhit"><span class="search-result-icon"></span><span class="location_choice" >' +
                term +'</span></a>';
            $.each(data, function(index, location){

                html += '<a class="' + droptype + '" href="'+ baseurl + 'term=' + encodeURIComponent(location.zip_code) + '&country=' +
                    encodeURIComponent(location.country) +'" text2="' + location.locationtext + '" city="'+location.city + '" state="' + location.state_prefix +
                    '" country="'+location.country +'" onclick="gaTrackSearch(\'location search click\'); return true;"> <span class="search-map-marker"></span><span class ="location_choice" value="' +
                    location.locationtext+'">'+ location.locationtext + '</span></a>';
            });

            if (html == '' && $(suggestDrop).html() != '') {
                lastBadLocationSearch = term;
                potentialLocation = false;
            } else {
                potentialLocation = true;
                lastBadLocationSearch = '';
                $(suggestDrop).html(html);
                if (html != "") {
                        $(suggestDrop).show();
                } else {
                        $(suggestDrop).hide();
                }
            }
        });

        return false;
}

function isPotentialPostalCode(val){
        var retval = false;
        if (val.length > 2){
                retval = true;

                var regex = /\d/g;
                retval = regex.test(val);
        }

        return retval;
}

function isPotentialLocation(val) {
        if(val.length > 2 && !val.match(/[^a-z0-9\, ]/i)) {
                // prevent hitting servers after we haven't matched a city
                return potentialLocation || lastBadLocationSearch.length > val.length;
        }

        return false;
}


// Search Analytics
$(function() {
    var analyticsEvent = 'global_nav_search';
    var $navSearchIcon = $('#search-panel-handle');
    var $navSearchInput = $('#search_term_top');
    var $navSearchDrop = $('#js-search-panel').find('.loc_suggest_drop_top');

    if (GFM && GFM.analytics && GFM.analytics.track_client_event) {
        $navSearchIcon.on('click.searchIntentEvent', function() {
            GFM.analytics.track_client_event(analyticsEvent, 'search_intent_button_clicked');
            $(this).off('click.searchIntentEvent');
        });

        $navSearchInput.on('gfmSearch.searchTermEntered', function() {
            GFM.analytics.track_client_event(analyticsEvent, 'search_term_entered');
            $(this).off('gfmSearch.searchTermEntered');
        });

        $navSearchInput.on('gfmSearch.searchExecuted', function() {
            GFM.analytics.track_client_event(analyticsEvent, 'search_executed');
        });

        $navSearchDrop.on('click.searchExecutedEvent', '.loc_suggest:not(.searchtermrow)', function() {
            GFM.analytics.track_client_event(analyticsEvent, 'search_executed');
        });
    }
});
