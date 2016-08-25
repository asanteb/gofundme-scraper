(function() {
    try {
        document.addEventListener("DOMContentLoaded", function(event) {
            if($.cookie("visitor")) {
                var visitorJSON;
                try {
                    visitorJSON = JSON.parse(decodeURIComponent($.cookie('visitor'))); // $.cookie decodes once, but edge case where cookies can be doubly URI encoded has occurred, but double decoding is safe, even if single decoding will do the job
                } catch (e) {
                    if (NREUM !== undefined) {
                        NREUM.noticeError(e);
                    }
                    return;
                }
                var isResponsive = document.querySelectorAll('.fixed-container').length > 0;
                var cookieDomain = window.location.hostname;
                cookieDomain = "." + cookieDomain.substring(cookieDomain.indexOf('gofundme'), cookieDomain.length); // adding the "." makes it available to all subdomains

                var saveVisitorCookie = function() {
                    $.cookie("visitor", encodeURIComponent(JSON.stringify(visitorJSON)), {path: "/", domain: cookieDomain});
                };

                var setVisitorCookie = function(key, value) {
                    visitorJSON[key] = value;
                    saveVisitorCookie();
                };

                var deleteVisitorCookie = function(key) {
                    unset(visitorJSON[key]);
                    saveVisitorCookie();
                };

                var dismissCookieWarning = function() {
                    setVisitorCookie('cookieWarning', 1);
                    if (isResponsive) {
                        var container = document.getElementsByClassName('fixed-container')[0];
                        container.removeChild(container.children[0]);
                        // TODO(bkim): Need to test if enough time for fixed-container to respond to removing of banner
                        document.querySelectorAll('.sticky-header .main-column')[0].style = "margin-top:"+document.querySelectorAll('.fixed-container')[0].offsetHeight+"px;";
                        document.querySelectorAll('.sticky-header .side-column')[0].style = "margin-top:"+document.querySelectorAll('.fixed-container')[0].offsetHeight+"px;";
                    } else {
                        var body = document.getElementsByTagName('body')[0];
                        var headerChildNumber = 0;
                        while (body.children[headerChildNumber].tagName !== 'DIV' && headerChildNumber < body.children.length) {
                            headerChildNumber++;
                        }
                        body.removeChild(body.children[headerChildNumber]);
                        if (!navigator.userAgent.match(/IEMobile|Android|BlackBerry|iPhone|iPod|Opera Mini/i)) {
                            body.children[headerChildNumber].style = "top:40px";
                            if (document.querySelectorAll('.topbar').length > 0) {
                                document.querySelectorAll('.topbar')[0].style = "";
                            } else if (document.querySelectorAll('.head_contain').length > 0) {
                                document.querySelectorAll('.head_contain')[0].style = "";
                            } else if (document.querySelectorAll('.head_contain_small').length > 0) {
                                document.querySelectorAll('.head_contain_small')[0].style = "";
                            } else if (document.querySelectorAll('.hpt2 .box').length > 0) {
                                document.querySelectorAll('.hpt2 .box')[0].style = "";
                            } else if (document.querySelectorAll('.a .container_wide').length > 0) {
                                document.querySelectorAll('.a .container_wide')[0].style = "";
                            }
                        }
                        body.children[headerChildNumber].style = ""; // this call needs to come a little after removeChild, because index doesn't update fast enough, race condition
                    }
                };

                var showCookieWarning = function() {
                    var cookieAlert = document.createElement("div");
                    cookieAlert.className = "hd_alert";
                    var mobileCookieAlert = "<div class='mob-width'><div class='wrap'>By continuing to use the website, you will be agreeing to our <a href='//gofundme.com/privacy#cookies'>Use of Cookies.</a></div><div class='ico-close'></div></div>";
                    var desktopCookieAlert = "<div class='hd_alert_contain'>We use cookies. By continuing to use the website, you will be agreeing to our <a href='//gofundme.com/privacy#cookies'>Use of Cookies.</a><div class='close' style='cursor:pointer;'></div></div>";
                    var responsiveCookieAlert = "<!-- COOKIE BANNER --><div class='alert-notif'><div class='disp-ib'>By continuing to use the website,</div><div class='disp-ib'>&nbsp;you agree to our <a href='//gofundme.com/privacy#cookies'>Use of Cookies</a></div>.<a class='close-button' data-close='' aria-label='Close modal'><i class='fa fa-times'></i></a></div>";
                    var close = cookieAlert.querySelectorAll('.close')[0];
                    // check if responsive page first
                    if (isResponsive) {
                        cookieAlert.innerHTML = responsiveCookieAlert;
                        close = cookieAlert.querySelectorAll('.close-button')[0];
                    } else {
                        //if is mobile
                        if (navigator.userAgent.match(/IEMobile|Android|BlackBerry|iPhone|iPod|Opera Mini/i)) {
                            cookieAlert.innerHTML = mobileCookieAlert;
                            close = cookieAlert.querySelectorAll('.ico-close')[0];
                        } else { // desktop + iPad
                            cookieAlert.innerHTML = desktopCookieAlert;
                            close = cookieAlert.querySelectorAll('.close')[0];
                        }
                    }

                    if (isResponsive) {
                        var container = document.getElementsByClassName('fixed-container')[0];
                        container.insertBefore(cookieAlert, container.children[0] || null);
                        document.querySelectorAll('.sticky-header .main-column')[0].style = "margin-top:"+document.querySelectorAll('.fixed-container')[0].offsetHeight+"px;";
                        document.querySelectorAll('.sticky-header .side-column')[0].style = "margin-top:"+document.querySelectorAll('.fixed-container')[0].offsetHeight+"px;";
                    } else {
                        var body = document.getElementsByTagName('body')[0];
                        var headerChildNumber = 0;
                        while (body.children[headerChildNumber].tagName !== 'DIV' && headerChildNumber < body.children.length) {
                            headerChildNumber++;
                        }
                        if (!navigator.userAgent.match(/IEMobile|Android|BlackBerry|iPhone|iPod|Opera Mini/i)) {
                            body.children[headerChildNumber].style = "top:40px";
                            if (document.querySelectorAll('.topbar').length > 0) { // home page
                                document.querySelectorAll('.topbar')[0].style = "margin-top:140px;";
                            } else if (document.querySelectorAll('.head_contain').length > 0) { //mobile pages
                                document.querySelectorAll('.head_contain')[0].style = "margin-top:40px;";
                            } else if (document.querySelectorAll('.head_contain_small').length > 0) { // campaign pages
                                document.querySelectorAll('.head_contain_small')[0].style = "margin-top:40px;";
                            } else if (document.querySelectorAll('.hpt2 .box').length > 0) { // contact page
                                document.querySelectorAll('.hpt2 .box')[0].style = "margin-top:40px;";
                            } else if (document.querySelectorAll('.a .container_wide').length > 0) { // newer landing pages
                                document.querySelectorAll('.a .container_wide')[0].style = "margin-top:127px;";
                            }
                        }
                        body.insertBefore(cookieAlert, body.children[headerChildNumber] || null);
                    }
                    close.addEventListener('click', function (e) {
                        dismissCookieWarning();
                    });
                };

                var isCookieWarningCountry = function(country) {
                    // export the below list into a constants hash we can require... because this will happen on every page, this is better than a http request to get this info
                    var CookieWarningCountries = [ //EU and CA
                        'AT',
                        'BE',
                        'BG',
                        'HR',
                        'CY',
                        'CZ',
                        'DK',
                        'EE',
                        'FI',
                        'FR',
                        'DE',
                        'GB',
                        'GR',
                        'HU',
                        'IE',
                        'IT',
                        'LV',
                        'LT',
                        'LU',
                        'MT',
                        'NL',
                        'PL',
                        'PT',
                        'RO',
                        'SK',
                        'SI',
                        'ES',
                        'SE',
                        'UK',
                        'CA'
                    ];
                    if (CookieWarningCountries.indexOf(country) !== -1) {
                        return true;
                    }
                    return false;
                };

                // Various operations regarding visitorCookie can be in the following area and use the set / delete methods shown above.

                if (visitorJSON['cookieWarning'] == null) {
                    visitorJSON['cookieWarning'] = '0';
                    saveVisitorCookie();
                }

                if (visitorJSON['country'] !== null && visitorJSON['cookieWarning'] === '0') {
                    if (isCookieWarningCountry(visitorJSON.country)) {
                        showCookieWarning();
                    }
                }
            }
        });
    } catch (e) {
        if (NREUM !== undefined) {
            NREUM.noticeError(e);
        }
    }
})();