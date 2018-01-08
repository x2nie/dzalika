

// // 8-jplayer.js


var QuranText = {
    text: {},
    init: function() {
        for (var i in quranTypes)
            this.text[i] = [];
    },
    get: function(ayaCoord, textType) {
        textType = textType || curr.quran;
        var index = Quran.getIndex(ayaCoord);
        return this.text[textType][index];
    },
    set: function(ayaCoord, value, textType) {
        textType = textType || curr.quran;
        var index = Quran.getIndex(ayaCoord);
        this.text[textType][index] = value;
    },
    end: 0
};
var TransText = {
    text: {},
    init: function() {
        for (var i in transList)
            this.text[i] = [];
    },
    get: function(ayaCoord, textType) {
        textType = textType || curr.trans;
        var index = Quran.getIndex(ayaCoord);
        var text = this.text[curr.trans][index];
        return text;
    },
    set: function(ayaCoord, value, textType) {
        textType = textType || curr.trans;
        var index = Quran.getIndex(ayaCoord);
        this.text[textType][index] = value;
    },
    fetch: function(ayaCoord, textType) {
        textType = textType || curr.trans;
        var s = Quran.getIndex(ayaCoord);
        var t = s;
        while ($.trim(this.text[textType][s--]) == '=');
        while ($.trim(this.text[textType][++t]) == '=');
        s++;
        t--;
        var coord = Quran.getAya(s);
        return {
            text: this.text[textType][s] || '',
            sura: coord.sura,
            aya: coord.aya,
            ayaTo: coord.aya + t - s
        };
    },
    end: 0
};
var isIE = $.browser.msie
var isIE6 = isIE && parseFloat($.browser.version) < 7;
var isIE7 = isIE && parseFloat($.browser.version) < 8;
var isIE9 = isIE && parseFloat($.browser.version) >= 9;
var isOpera = $.browser.opera;
var isFirefox = navigator.userAgent.indexOf("Firefox") != -1;
var isFF4 = isFirefox && parseFloat($.browser.version) >= 2;
var isOldFirefox = isFirefox && !document.getElementsByClassName;
var isChrome = /chrome/.test(navigator.userAgent.toLowerCase());
var isMac = /mac/i.test(navigator.platform);
var isSafari = /Safari/i.test(navigator.userAgent);
var isMSafari = /webkit.*mobile/i.test(navigator.userAgent);
var isIOS = /(iPad|iPhone|iPod)/i.test(navigator.userAgent);
var localhost = location.href.indexOf("localhost") != -1;
var domain = document.location.href.split('#')[0];
var server = domain.split('/')[2];
var isTest = localhost;

// // 9-ischeck.js

if (isMSafari) {
    (function($) {
        $.fn.offsetOld = $.fn.offset;
        $.fn.offset = function() {
            var result = this.offsetOld();
            result.top -= window.scrollY;
            result.left -= window.scrollX;
            return result;
        };
    })(jQuery);
}

function unselect() {
    if (document.selection) {
        try {
            document.selection.empty();
        } catch (e) {}
    } else
        window.getSelection().removeAllRanges();
}

function _(str) {
    return Consts[str] ? Consts[str] : str;
}

function _num(num, lang, digitsOnly) {
    lang = lang || language;
    var base = {
        'def': 0x0030,
        'fa': 0x06F0,
        'ar': 0x0660
    };
    var regexp = new RegExp(digitsOnly ? '([0-9])' : '(.)', 'g')
    var digBase = base[lang] || base['def'];
    var res = String(num).replace(regexp, function(s, n, ofs, all) {
        return String.fromCharCode(digBase + (n.charCodeAt(0) & 0x0F));
    });
    return res;
}

function _enum(num, lang) {
    lang = lang || language;
    return _num(num, lang, true);
}
String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++)
        formatted = formatted.replace("{" + i + "}", arguments[i]);
    return formatted;
}

function val(num) {
    return 1 * _num(num, 'en');
}

function arabicNumberName(num) {
    var unary = Array('الاول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر');
    var decimal = Array('عشر', 'العشرون', 'الثلاثون');
    if (num < 1 || num >= 40) return '';
    if (num <= 10) return unary[num - 1];
    var digit = num % 10;
    var dec = parseInt(num / 10);
    unary[0] = 'الحادي';
    var res = (digit > 0 ? unary[digit - 1] + (dec > 1 ? ' و' : ' ') : '') + decimal[dec - 1];
    return res;
}

function getCurrDir(tab) {
    tab = tab || currTab;
    return {
        quran: 'rtl',
        search: (isRTL ? 'rtl' : 'ltr')
    }[tab] || getTransDir();
}

function getCurrTextDir() {
    var tab = (currTab == 'search') ? 'quran' : currTab;
    return {
        quran: 'rtl',
        search: 'ltr'
    }[tab] || getTransDir();
}

function getTransDir() {
    var lang = getTransLang();
    return $.isInArray(lang, rtlLangs) ? 'rtl' : 'ltr';
}

function getTransLang(trans) {
    trans = trans || curr.trans;
    return trans.split('.')[0];
}

function isUthmani(type) {
    type = type || curr.quran;
    return /uthmani/.test(type);
}

function initMenuCollapse() {
    $('.sub-menu').each(function() {
        if (!$(this).hasClass('collapsed'))
            toggleCollapse(this, true);
    });
    $('.menu-top').click(function() {
        toggleCollapse($(this).parent());
    }).each(function() {
        $(this).html('<span class="icon"></span>' + $.trim($(this).html()));
    });
}

function toggleCollapse(obj, show) {
    var vis = (typeof show != 'undefined') ? show : $(obj).hasClass('collapsed');
    $(obj).toggleClass('collapsed', !vis);
    var target = $(obj).find('.menu-content, .menu-body');
    if (isIE)
        target.toggle(vis);
    else
        target[vis ? 'slideDown' : 'slideUp'](300);
}

function isSet(x) {
    return (typeof x != 'undefined')
}

function hideLoadingImage() {
    $("#loadingImage").hide();
}

function showError() {}

function loadGoogleAnalytics() {
    var url = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
    url += 'google-analytics.com/ga.js';
    $.getScript(url, function() {
        var pageTracker = _gat._getTracker("UA-9204679-1");
        pageTracker._trackPageview();
    });
}

function log() {
    if (!isTest)
        return;
    if (typeof(console) != 'undefined')
        console.log(arguments);
    else
        Console.log(arguments);
}
var Console = {
    pad: null,
    init: function() {
        this.pad = $('<div/>').addClass('console').css({
            opacity: .8
        }).appendTo(document.body).hide();
    },
    log: function(args) {
        var str = '';
        $.each(args, function() {
            str += ' : ' + this;
        });
        this.pad.append($('<div/>').text(str)).show();
    },
    end: 0
};
var Scroller = {
    duration: 600,
    marginTop: 1 / 8,
    marginBottom: 1 / 20,
    scrollTo: function(obj) {
        var margin = $(window).height() * this.marginTop;
        margin = Math.min(Math.round(margin), 125);
        var target = obj.offset().top - margin;
        var scrollElement = isOpera ? $('html') : $('html, body');
        scrollElement.stop().animate({
            scrollTop: target
        }, this.duration, 'swing');
    },
    scrollToAya: function() {
        var obj = $('#' + curr.sura + '-' + curr.aya);
        if (currTab == 'trans')
            obj = $('#t-' + curr.sura + '-' + curr.aya);
        if (obj.length == 0)
            return;
        if (curr.aya == 1)
            obj = obj.prevUntil('span').last();
        var top = obj.offset().top;
        var bottom = top + obj.height();
        if (currTab == 'quran' && opt.showTrans == 'fixed')
            bottom = Math.max(bottom, $('.tbox').offset().top + $('.tbox').height());
        var wintop = $(document).scrollTop();
        var winh = $(window).height();
        if (top - wintop < winh * this.marginTop || bottom > wintop + winh * (1 - this.marginBottom))
            this[isMSafari ? 'goTo' : 'scrollTo'](obj);
    },
    method: 'quadratic',
    startTime: 0,
    target: 0,
    initGap: 0,
    task: null,
    goTo: function(obj) {
        clearInterval(this.task);
        var margin = $(window).height() * this.marginTop;
        margin = Math.min(Math.round(margin), 125);
        this.target = obj.offset().top - margin;
        this.initGap = this.target - $(document).scrollTop();
        this.startTime = (new Date()).getTime();
        setTimeout('Scroller.scrollWindow()', 10);
    },
    scrollWindow: function() {
        var currPos = {
            X: $(document).scrollLeft(),
            Y: $(document).scrollTop()
        };
        var now = (new Date()).getTime();
        if (now - this.startTime < this.duration) {
            var newY = this.target - this.newGap(now);
            window.scrollTo(currPos.X, newY);
            if (newY == currPos.Y || currPos.Y != $(document).scrollTop()) {
                clearInterval(this.task);
                this.task = setTimeout('Scroller.scrollWindow()', 10);
            }
        } else
            window.scroll(currPos.X, this.target);
    },
    newGap: function(now) {
        var portion = 0;
        var deltaTime = (now - this.startTime) / this.duration;
        if (this.method == 'quadratic')
            portion = 1 - Math.pow(1 - deltaTime, 2);
        else
            portion = deltaTime;
        return parseInt(this.initGap * (1 - portion));
    }
};

function bindHotKeys() {
    bindKey('left', function(e) {
        changePage('left');
    });
    bindKey('right', function(e) {
        changePage('right');
    });
    if (!isOpera) {
        bindKey('up', function(e) {
            changeAya(-1);
        });
        bindKey('down', function(e) {
            changeAya(+1);
        });
        bindKey('ctrl+left', function(e) {
            changeSura('left');
        });
        bindKey('ctrl+right', function(e) {
            changeSura('right');
        });
        bindKey('space', function(e) {
            Player.togglePlay();
        });
    }
}

function bindKey(key, fn) {
    $(document).bind('keydown', key, function(e) {
        if (currTab != 'search') {
            fn.apply(this, arguments);
            return false;
        }
    });
}

function addBookmark(title, url) {
    if (window.sidebar)
        window.sidebar.addPanel(title, url, '');
    else if (isIE && window.external)
        window.external.AddFavorite(url, title);
    else {
        document.title = title;
        alert('Your browser doesn\'t support automatic bookmarking. Please bookmark the page manually.');
    }
    return false;
}
var History = {
    callState: 'new',
    init: function() {
        $.history.init(History.show, {
            unescape: !isIOS ? true : function(hash) {
                return hash.replace(/%2F/g, '/').replace(/%3A/g, ':');
            }
        });
    },
    load: function(args) {
        var hash = this.getHash(args);
        $.history.load(hash);
    },
    getHash: function(args) {
        var def = {
            sura: curr.sura,
            aya: curr.aya,
            tab: currTab,
            id: curr.trans,
            type: Search.type,
            query: Search.query,
            page: Search.page
        };
        args = $.extend(def, args);
        var hash = '';
        if (args.tab == 'trans')
            hash = 'trans/' + (args.id) + '/';
        if (args.tab == 'search')
            hash = 'search/' + args.type + '/' + args.query + (args.page == 1 ? '' : '/p' + args.page);
        else
            hash += args.sura + ':' + args.aya;
        return hash;
    },
    show: function(hash) {
        var self = History;
        if (hash == '') {
            if (self.callState == 'new')
                self.load();
            else
                window.history.back(1);
            self.callState = 'old';
        } else {
            try {
                var args = hash.split('/');
                var searchArgs = {};
                var type = args[0];
                if (type != 'trans' && type != 'search')
                    type = 'quran';
                currTab = type;
                if (type == 'search') {
                    searchArgs = {
                        type: args[1],
                        query: args[2],
                        page: Math.max((args[3] || 'p1').replace(/p-?/, '') * 1, 1)
                    };
                    Search.display(searchArgs);
                    currPage = '';
                } else {
                    var transID = args[1];
                    if (transID && transList[transID] && curr.trans != transID) {
                        $('#transMenu').val(transID);
                        updateTrans();
                    }
                    var addr = (args.length <= 1) ? args[0] : args[2];
                    var coords = self.locate(addr);
                    display(coords.sura, coords.aya);
                }
                self.setTitle({
                    tab: type,
                    search: searchArgs
                });
            } catch (e) {
                log(e);
                self.load({
                    tab: 'quran'
                });
            }
        }
    },
    locate: function(addr) {
        var res = {};
        var p = addr.split('-');
        if (p[0] == 'page' || p[0] == 'juz')
            res = Quran[p[0] + 'Props'](1 * p[1]);
        else {
            var q = addr.split(':');
            res = {
                sura: 1 * q[0] || curr.sura,
                aya: 1 * q[1] || 1
            };
        }
        return res;
    },
    setTitle: function(args) {
        var title = '';
        var name = Quran.getSuraName(curr.sura, 'tname');
        var addr = name + ' [' + curr.sura + ':' + curr.aya + ']';
        switch (args.tab) {
            case 'quran':
                title = addr + '';
                break;
            case 'trans':
                title = addr + ' - ' + transList[curr.trans];
                break;
            case 'search':
                title = args.search.query + ' - ';
                title += (args.search.type == 'root') ? 'Root Search' : 'Quran Search';
                break;
        }
        document.title = title + ' - Tanzil Quran Navigator';
    },
    end: 0
};﻿
var useLocalStorage = true;
var resultsPerPage = 20;
var searchTextType = defQuranType;
var highlightAya = false;
var transFont, transFontSize;
var popDelay = 0;
var defJustify = !isOpera && !isOldFirefox;
var currTab = 'quran';
var currPage = '';
var winDim = {};
var lastXPos = 0;
var fontList = {
    def: {
        name: _('Default')
    },
    
/*http://fonts.googleapis.com/earlyaccess/amiri.css    
/style/
       	@import url(http://fonts.googleapis.com/earlyaccess/amiri.css);
		.amiri{
			font-family: 'Amiri', serif;
			font-size: 20px;}
	/style */
    
    amiri: {
        name: 'Amiri',
        family: 'Amiri',
        embed: 'Amiri',
        css: 'http://fonts.googleapis.com/earlyaccess/amiri.css',
        scale: 1
    },
    me_quran: {
        name: 'Me-Quran',
        family: 'me_quran',
        embed: 'meQuran',
        file: 'me_quran',
        scale: 0.85
    },
    scheherazade: {
        name: 'Scheherazade',
        family: 'Scheherazade',
        embed: 'Scheheraza',
        file: 'Scheherazade',
        scale: 1.22
    },
    saleem: {
        name: 'PDMS Saleem',
        family: '_PDMS_Saleem_QuranFont',
        embed: 'PDMS_Saleem',
        file: 'PDMS_Saleem',
        scale: 1.2
    },
    naskh: {
        name: 'KFGQPC Naskh',
        family: 'KFGQPC Uthman Taha Naskh',
        embed: 'KFGQPC_Naskh',
        file: 'KFC_naskh',
        scale: 1
    },
    trad: {
        name: 'Traditional Arabic',
        family: 'Traditional Arabic',
        scale: 1.22
    },
    arabtype: {
        name: 'Arabic Typesetting',
        family: 'Arabic Typesetting',
        scale: 1.33
    },
    majalla: {
        name: 'Sakkal Majalla',
        family: 'Sakkal Majalla',
        scale: 1.1
    },
    uighur: {
        name: 'MS Uighur',
        family: 'Microsoft Uighur',
        scale: 1.27
    },
    arial: {
        name: 'Arial',
        family: 'Arial',
        scale: 0.95
    },
    custom: {
        name: _('Custom')
    }
};
var fontPrefs = {
    simple: ['naskh', 'scheherazade', 'trad', 'arabtype', 'majalla', 'uighur'],
    uthmani: ['me_quran', 'scheherazade', 'majalla', 'arabtype', 'arial'],
    simpleSmall: ['trad', 'scheherazade', 'naskh', 'majalla', 'arabtype', 'uighur'],
    uthmaniSmall: ['majalla', 'scheherazade', 'arabtype', 'arial']
};
var currFontID = '';
var baseFont = 'Times New Roman';
var embeddedFonts = [fontAdded ? 'naskh' : 'nothing'];
var tryFontCounter = 0;
var fixedTransEnabled = false;

function initPage(start) {
    checkBrowser();
    Console.init();
    adjustDefaults(start)
    Storage.init();
    adjustVariables();
    QuranText.init();
    TransText.init();
    TextTools.init();
    initMenus();
    History.init();
    checkInstalledFonts();
    fontExists(fontFace(getFontID()));
    initFontMenu();
    bindHotKeys();
    initUI();
    setTransFontDefs();
    updateFontSettings();
    applyFont(getPrefInstalledFont());
    updateFont();
    selectTab('search-quran');
    $('#quran-selector a').focus().blur();
    $(window).resize(adjustPageHeight);
    Player.init();
    if (!localhost)
        setTimeout('loadGoogleAnalytics()', 2000);
    if (!isChrome)
        setTimeout('refresh()', 1000);
    $(window).unload(unload);
}

function initUI() {
    initTabs();
    Dialog.init();
    Modal.init();
    TransBox.init();
    initMenuCollapse();
    initTextInputs();
    $('#searchText').val(opt.searchText);
    $('#gotoText').val(_num(curr.sura) + ':' + _num(curr.aya));
    $('#customFont').val(opt.customFont);
    $('#fontSize').val(_num(opt.fontSize));
    $('#textJustify').toggleCheck(opt.textJustify);
    $('#showSigns').toggleCheck(opt.showSigns);
    $('#showSmallAlef').toggleCheck(opt.showSmallAlef);
    $.Radio.val('showTrans', opt.showTrans);
    initAudioUI();
    setAudioTrans();
    initTooltips();
    $('.noSelect, label, .button, .ui-tab, .top-menu, .menu-top').disableTextSelect();
    if (isMSafari) {
        $('#searchFrame').css({
            maxHeight: 'none'
        });
        $('.menu-body select').css({
            borderColor: '#555'
        });
    }
}

function initTextInputs() {
    $('input:text').keypress(function(e) {
            if (e.which == 13) {
                $(this).closest('form').submit();
                e.preventDefault();
            }
        })
        .focus(function() {
            this.select();
        })
        .blur(function() {
            unselect();
        });
}

function initAd() {
    $('.donate').attr('title', 'Only ' + donateDaysLeft + ' days left').tipsy({
        gravity: 'n',
        trigger: 'manual',
        fade: true
    }).tipsy('show');
    setTimeout("$('.donate').tipsy('hide').attr('title', 'Contribute to Tanzil')", 7000);
}

function checkBrowser() {
    if (isRTL && isIE7) {
        location.href = 'http://tanzil.net/';
    }
}

function unload() {
    Storage.save();
    QuranText.text = TransText.text = null;
}

function update(name, val) {
    var p = name.split('.');
    window[p[0]][p[1]] = val;
    Storage.save(p[0]);
}

function adjustDefaults(start) {
    if (start.defTrans)
        Storage.data.curr.trans = start.defTrans;
    if (isMSafari)
        Storage.data.opt.showTrans = 'none';
}

function adjustVariables() {
    opt.fontSize = opt.fontSize || 16;
    opt.fontID = fontList[opt.fontID] ? opt.fontID : 'def';
    curr.quran = quranTypes[curr.quran] ? curr.quran : defQuranType;
    curr.trans = transList[curr.trans] ? curr.trans : defTrans;
    try {
        reciteList[opt.reciters[0].id].name
    } catch (e) {
        opt.reciters = Storage.data.opt.reciters;
    }
}

function initMenus() {
    initJuzMenu();
    initTransMenu();
    initQuranTypesMenu();
    initRootList();
    initRootMenu();
    updateMenus(curr.sura, curr.aya);
}

function updateMenus(sura, aya) {
    var page = Quran.getPage(sura, aya);
    var juz = Quran.getJuz(sura, aya);
    $('#juzMenu').val(juz);
    $('#pageNum').val(_num(page));
    initSuraMenu(sura);
    initAyaMenu(sura, aya);
}

function initSuraMenu(sura) {
    var nameType = (getCurrTextDir() == 'ltr') ? 'tname' : 'name';
    if ($('#suraMenu').data('nameType') == nameType) {
        $('#suraMenu').val(sura);
        return;
    }
    var items = [];
    for (var i = 1; i <= Quran.numSuras; i++)
        items.push({
            text: _num(i) + '. ' + Quran.getSuraName(i, nameType),
            value: i
        });
    initMenu('suraMenu', items, sura);
    $('#suraMenu').data('nameType', nameType);
}

function initAyaMenu(sura, aya) {
    var numAyas = Quran.suraProps(sura).ayas;
    if ($('#ayaMenu option').length == numAyas) {
        $('#ayaMenu').val(aya);
        return;
    }
    var items = [];
    for (var i = 1; i <= numAyas; i++)
        items.push({
            text: _num(i),
            value: i
        });
    initMenu('ayaMenu', items, aya);
}

function initJuzMenu() {
    var items = [];
    for (var i = 1; i <= Quran.numJuzs; i++)
        items.push({
            text: _('Juz') + ' ' + _num(i),
            value: i
        });
    initMenu('juzMenu', items);
}

function initTransMenu() {
    var items = [];
    for (var i in transList) {
        var langID = i.split('.')[0];
        var lang = langList[langID];
        var audioTag = '';
        items.push({
            text: lang + ':  ' + transList[i] + audioTag,
            value: i
        });
    }
    items.sort(sortItems);
    initMenu('transMenu', items, curr.trans);
}

function initFontMenu() {
    var items = [];
    for (var i in fontList) {
        font = fontList[i];
        if (font.embed || font.installed || !font.family)
            items.push({
                text: font.name,
                value: i
            });
    }
    initMenu('fontMenu', items, opt.fontID);
}

function initQuranTypesMenu() {
    initMenuFromHash('typeMenu', quranTypes, curr.quran);
}

function sortItems(a, b) {
    return a.text.localeCompare(b.text);
}

function getItems(theArray, textLabel, valueLabel) {
    var items = [];
    for (var i = 0; i < theArray.length; i++)
        items[i] = {
            text: theArray[i][textLabel],
            value: theArray[i][valueLabel] || i
        };
    return items;
}

function initMenu(menu, items, defVal) {
    if (typeof menu == 'string')
        menu = $('#' + menu);
    var html = '';
    for (var i = 0; i < items.length; i++) {
        var opt = '';
        if (items[i].title)
            opt = ' title="{0}"'.format(items[i].title);
        if (/^sep-/.test(items[i].value))
            opt += ' disabled="disabled"';
        html += '<option value="' + items[i].value + '"' + opt + '>' + items[i].text + '</option>';
    }
    menu.html(html).val(defVal);
}

function initMenuFromHash(menuID, items, defVal) {
    var html = '';
    for (var i in items)
        html += '<option value="' + i + '">' + items[i] + '</option>';
    $('#' + menuID).html(html).val(defVal);
}

function selectTab(tab) {
    getTab(tab).trigger('tabSelect');
}

function showTab(tab) {
    var selector = getTabSelector(tab);
    selector.siblings().each(function() {
        $(this).removeClass('selected');
        getTab(this).hide();
    });
    selector.addClass('selected').children().blur();
    getTab(tab).show().trigger('tabShow');
}

function getTabID(tab) {
    if (typeof tab == 'string')
        return tab
    return $(tab).attr('id').replace('-selector', '').replace('-tab', '');
}

function getTab(tab) {
    return $('#' + getTabID(tab) + '-tab');
}

function getTabSelector(tab) {
    return $('#' + getTabID(tab) + '-selector');
}

function initTabs() {
    $('li').each(function() {
        var id = $(this).attr('id');
        if (/-selector/.test(id)) {
            $(this).click(function(e) {
                e.preventDefault();
                selectTab($(this));
                return false;
            });
        }
    });
    $('.main-tab').bind('tabSelect', function() {
        selectMainTab(getTabID(this));
    });
    $('.main-tab').bind('tabShow', function() {
        showMainTab();
    });
    $('.search-tab').bind('tabSelect', function() {
        showTab(this);
    });
}

function showMainTab() {
    if (currTab == 'trans')
        $('#quran-tab').show();
    $('#quranText').toggle(currTab == 'quran');
    $('#transText').toggle(currTab != 'quran');
    $('.tbox').toggle(currTab == 'quran' && opt.showTrans == 'fixed' && !isPageEmbedded);
    $('.tip').hide();
}

function selectMainTab(tabID) {
    currTab = tabID;
    History.load();
}

function showAya(sura, aya) {
    sura = sura || $('#suraMenu').val() * 1;
    aya = aya || $('#ayaMenu').val() * 1;
    sura = Quran.fixSuraNum(sura);
    aya = Quran.fixAyaNum(sura, aya);
    displayAya(sura, aya);
}

function showSura(sura) {
    console.log('showSura!')
    sura = sura || $('#suraMenu').val() * 1;
    sura = Quran.fixSuraNum(sura);
    displayAya(sura, 1);
}

function showPage(page) {
    page = page || val($('#pageNum').val());
    page = Quran.fixPageNum(page);
    displayAya(Quran.pageProps(page));
}

function showJuz(juz) {
    juz = juz || $('#juzMenu').val() * 1;
    juz = Quran.fixJuzNum(juz);
    displayAya(Quran.juzProps(juz));
}

function changeAya(offset, cyclic) {
    var next = Quran.addOffset(curr.sura, curr.aya, offset, cyclic);
    displayAya(next);
}

function changeSura(offset) {
    offset = getArrowOffset(offset) || offset;
    if (offset < 0 && curr.aya > 1)
        offset = 0;
    showSura(curr.sura + offset);
}

function changePage(offset) {
    offset = getArrowOffset(offset) || offset;
    var page = val($('#pageNum').val()) + offset;
    showPage(page);
}

function refresh() {
    currPage = '';
    if (currTab == 'search')
        Search.display();
    else
        display();
}

function displayAya(sura, aya) {
    if (typeof sura == 'object') {
        aya = sura.aya;
        sura = sura.sura;
    }
    var tab = (currTab == 'search') ? 'quran' : currTab;
    History.load({
        sura: sura,
        aya: aya,
        tab: tab
    });
}

function display(sura, aya) {
    sura = sura || curr.sura;
    aya = aya || curr.aya || 1;
    updateMenus(sura, aya);
    curr.sura = 1 * sura;
    curr.aya = 1 * aya;
    var page = val($('#pageNum').val());
    if (page + ':' + curr.quran + ':' + curr.trans + ':' + currTab == currPage)
        updatePage(page);
    else
        retrievePage(page);
    Player.loadAya();
}

function updatePage(page) {
    var id = (currTab == 'trans' ? 't-' : '') + (curr.sura + '-' + curr.aya);
    $('.aya').removeClass('selected');
    $('#' + id).addClass('selected');
    if (currTab == 'quran')
        TransBox.update();
    Scroller.scrollToAya();
}

function retrievePage(page) {
    var startAya = Quran.getPageStart(page);
    var endAya = Quran.getPageStart(page + 1);
    if (!pageInCache(startAya, endAya) || !transInCache(startAya, endAya)) {
        /*var args = {
            type: curr.quran,
            transType: curr.trans,
            pageNum: page,
            startAya: startAya,
            endAya: endAya,
            version: version
        };
        $.ajax({
            type: 'GET',
            url: root + '/php/get-aya.php',
            data: args,
            dataType: 'json',
            success: procPageResp,
            error: showError
        });*/
        InvalidateTxtLoaded(page, startAya, endAya);
        /*function dict(slice){
                var ret={}, num = startAya;
                $.each(slice, function() {
                  ret[num] = this;
                  num++
                });
                return ret
            }
        var res = {
                pageNum: page,
                quranType: curr.quran,
                transType: curr.trans,
                quran : dict(mushaf.lines.slice(startAya, endAya)),
                trans : dict(trans.lines.slice(startAya, endAya)),
                startAya: startAya,
                endAya: endAya,
                version: version
            }
            console.log('RES$=',res)
            procPageResp(res);
            */
        /*makeSureTxtLoaded().done(function(){
            function dict(slice){
                var ret={}, num = startAya;
                $.each(slice, function() {
                  ret[num] = this;
                  num++
                });
                return ret
            }
            var res = {
                pageNum: page,
                quranType: curr.quran,
                transType: curr.trans,
                quran : dict(mushaf.lines.slice(startAya, endAya)),
                trans : dict(trans.lines.slice(startAya, endAya)),
                startAya: startAya,
                endAya: endAya,
                version: version
            }
            console.log('RES$=',res)
            procPageResp(res);
        })*/
        // $("#loadingImage").show();
    } else
        showPageText(page);
}
// don't store this to cookies
var mushaf={lines:[], curr:undefined}
var trans={lines:[], curr:undefined}

function InvalidateTxtLoaded(page, startAya, endAya){
    console.log('InvalidateTxtLoading...')
    function dict(slice){
                var ret={}, num = startAya;
                $.each(slice, function() {
                  ret[num] = this;
                  num++
                });
                return ret
            }
        
            
    var $queue = $("#loadingImage");//$("<div/>");
    var trans_url = "trans/{0}.txt".format(curr.trans),
        mushaf_url = "mushaf/{0}.txt".format(curr.quran);
    $queue
    .show()
    .queue(function(){
        console.log('Invalidate 1...',mushaf.curr ,'==', curr.quran)
        if(mushaf.curr == curr.quran) 
            $queue.dequeue();
        else 
            $.get(mushaf_url, function(data){
                mushaf.lines = data.split('\n');
                mushaf.curr = curr.quran;
                console.log('Invalidate 1 done.')
                $queue.dequeue();
            }) 
    }).queue(function(){
        console.log('Invalidate 2...',trans.curr ,'==', curr.trans)
        if(trans.curr == curr.trans)
            $queue.dequeue();
        else
            $.get(trans_url, function(data){
                trans.lines = data.split('\n');
                trans.curr = curr.trans;
                console.log('Invalidate 2 done.')
                $queue.dequeue();
            }) 
    })
    .queue(function(){
        var res = {
                pageNum: page,
                quranType: curr.quran,
                transType: curr.trans,
                quran : dict(mushaf.lines.slice(startAya, endAya)),
                trans : dict(trans.lines.slice(startAya, endAya)),
                startAya: startAya,
                endAya: endAya,
                version: version
            }
            console.log('RES$=',res);
            procPageResp(res);
            $queue.dequeue();
    })
    
    .hide(); 
    console.log('InvalidateTxtLoaded.')
}
function makeSureTxtLoaded(){
    // Execute the function myFunc when both ajax requests are successful, or myFailure if either one has an error.
    function myFunc(q,t){
        
    }
    function myFailure(){
        alert('make sure failed!')
    }
    var trans_url = "trans/{0}.txt".format(curr.trans),
        mushaf_url = "mushaf/{0}.txt".format(curr.quran);
    var qTxt = mushaf.curr == curr.quran ? mushaf.lines : $.get(mushaf_url, function(data){
        mushaf.lines = data.split('\n');
        mushaf.curr = curr.quran;
    }) 
    var tTxt = trans.curr == curr.quran ? trans.lines : $.get(trans_url, function(data){
        trans.lines = data.split('\n');
        trans.curr = curr.trans;
        return trans.lines
    }) 
    // $.when( $.ajax( "/page1.php" ), $.ajax( "/page2.php" ) )
    return $.when( qTxt, tTxt )
       // .then( myFunc, myFailure );
        
    /*if(curr.quran != mushaf.curr){
        $.get('mushaf/'+curr.quran+'.txt', function(data) {
            mushaf.lines = data.split('\n');
            mushaf.curr = curr.quran
        });
    }*/
}

function procPageResp(res) {
    hideLoadingImage();
    for (var i in res.quran)
        QuranText.set(i, res.quran[i], res.quranType);
    for (var i in res.trans)
        TransText.set(i, res.trans[i], res.transType);
    showPageText(res.pageNum * 1);
}

function showPageText(page) {
    var suraNames = [];
    var prevSura = 0;
    var list = Quran.getPageItems(page);
    var text = '';
    var lang = getTransLang(curr.trans);
    for (i = 0; i < list.length; i++) {
        var sura = list[i].sura;
        var aya = list[i].aya;
        if (sura != prevSura && aya > 0) {
            suraNames.push(Quran.getSuraName(sura));
            prevSura = sura;
        }
        var index = Quran.getAyaStart(sura, aya);
        var ayaText = QuranText.get(index);
        // console.log('ayaText=',ayaText)
        var className = 'aya';
        var args = {
            showSigns: opt.showSigns,
            showSmallAlef: opt.showSmallAlef,
            font: currFontID,
            type: curr.quran
        };
        if (aya == 1) {
            text += '<div class="suraHeaderFrame"><div class="suraHeaderText">' + ((getCurrDir() == 'rtl') ? 'سورة ' + Quran.getSuraName(sura) : Quran.getSuraName(sura, 'tname')) + '</div></div>';
            if (sura != 1 && sura != 9) {
                var besm=mushaf.lines[0]
                ayaFirst = ayaText.replace(/^(([^ ]+ ){4})/, '$1|').split('|');
                // if(ayaFirst.length==1){
                if(ayaFirst[0] != besm){
                        // besm=mushaf.lines[0]
                }
                else{
                    // besm = ayaFirst[0]
                    ayaText = ayaFirst[1];
                }
                console.log('AyaOne=',ayaFirst,'count=', ayaFirst.length)
                text += '<div class="ayaText besm">' + (currTab == 'trans' ? 'بسم الله الرحمن الرحيم' : TextTools.fixText(besm, args)) + '</div>\n';
            }
        }
        if (curr.sura == sura && curr.aya == aya) {
            if (highlightAya)
                ayaText = TextTools.highlight(highlightPattern, ayaText);
            className += highlightAya ? ' highlight' : ' selected';
        }
        ayaText = TextTools.fixText(ayaText, args);
        var trans = TransText.fetch(index);
        if (currTab == 'trans') {
            if (curr.sura == trans.sura && curr.aya >= trans.aya && curr.aya <= trans.ayaTo) {
                className = 'aya selected';
                aya = curr.aya;
            }
            var addr = trans.aya + (trans.aya != trans.ayaTo ? '&ndash;' + trans.ayaTo : '');
            var thisAya = '<span class="ayaText">' + TextTools.fixTransText(trans.text) + '</span> ';
            thisAya += '<span class="ayaNumber">(<a href="{0}">{1}</a>)</span>'
                .format(domain + '#' + History.getHash({
                    sura: sura,
                    aya: aya
                }), _enum(addr, getTransLang()));
            var style = '';
            text += '<span id="t-' + sura + '-' + aya + '" class="' + className + '"' + style + '><span class="aya-wrapper">' + thisAya + '</span></span> \n';
            i += (trans.ayaTo - trans.aya);
        } else {
            var thisAya = '<span class="ayaText">' + ayaText + '</span> ';
            thisAya += '<span class="ayaNumber">﴿<a href="{0}">{1}</a>﴾</span>'
                .format(domain + '#' + History.getHash({
                    sura: sura,
                    aya: aya
                }), _num(aya, 'ar'));
            text += '<span id="' + sura + '-' + aya + '" class="' + className + '"><span class="aya-wrapper">' + thisAya + '</span></span> \n';
        }
    }
    if (currTab == 'trans') {
        $('#transText').html(text).css({
            'direction': getTransDir(),
            'font-family': transFont,
            'font-size': Math.round(transFontSize * 1.8) + 'px',
            'font-align': $.isInArray(lang, noJustifyLangs) ? 'center' : 'justify'
        });
    } else {
        $('#quranText').html(text);
        setQuranFont();
    }
    var currJuz = Quran.getJuz(curr.sura, curr.aya);
    $('#suraName').text((getCurrDir() == 'rtl') ? 'سورة ' + Quran.getSuraName(curr.sura) : Quran.getSuraName(curr.sura, 'tname'));
    $('#juzName').text((getCurrDir() == 'rtl') ? 'الجزء ' + arabicNumberName(currJuz) : 'Juz ' + currJuz);
    $('.pageNumber').text((getCurrDir() == 'rtl') ? _num(page, 'ar') : page);
    showTab(currTab);
    adjustPageHeight();
    setTimeout('initPageActions()', popDelay);
    popDelay = 0;
    currPage = page + ':' + curr.quran + ':' + curr.trans + ':' + currTab;
    updatePage(page);
}

function setQuranFont() {
    var font = fontList[currFontID];
    $('#quranText').css({
        'font-family': fontFace(currFontID),
        'font-size': (font.scale * 1.15) + 'em',
        'font-weight': font.bold ? 'bold' : 'normal'
    });
    $('#quranText .ayaNumber, .sign').css({
        'font-size': (0.92 / font.scale) + 'em'
    });
}

function updateQuranSettings() {
    update('curr.quran', $('#typeMenu').val());
    update('opt.showSigns', $('#showSigns').isChecked());
    update('opt.showSmallAlef', $('#showSmallAlef').isChecked());
    updateFont();
    refresh();
}

function updateTransSettings() {
    update('opt.showTrans', $.Radio.val('showTrans'));
    TransBox.toggle(opt.showTrans == 'fixed');
    refresh();
}

function setTrans() {
    if (currTab == 'trans')
        History.load({
            tab: 'trans',
            id: $('#transMenu').val()
        });
    else
        updateTrans();
}

function updateTrans() {
    update('curr.trans', $('#transMenu').val());
    Search.dirty();
    setTransFontDefs();
    refresh();
}

function setAudioTrans() {
    var hasAudio = $.isInArray(curr.trans, audioTransList);
    var active = false;
    for (var i in opt.reciters)
        if (reciteList[opt.reciters[i].id].trans == curr.trans)
            active = true;
    $('.trans-row .icon').toggleClass('active', active);
}

function updateAudioTransSettings() {
    var active = $('.trans-row .icon').hasClass('active');
    if (active) {
        for (var i in opt.reciters)
            if (reciteList[opt.reciters[i].id].trans == curr.trans)
                removeReciter(i);
    } else {
        for (var i in reciteList)
            if (reciteList[i].trans == curr.trans)
                addReciter(i);
    }
    setAudioTrans();
}

function setTransFontDefs() {
    var lang = getTransLang(curr.trans);
    var data = langData[lang] || langData['def'];
    var sample = data.sample || 'In the name of Allah, بسم الله الرحمن الرحيم';
    transFont = data.font;
    transFontSize = fontWidth(baseFont, sample) / fontWidth(transFont, sample) * 10;
}

function pageInCache(startAya, endAya) {
    for (var i = startAya; i < endAya; i++)
        if (QuranText.get(i) == null)
            return false;
    return true;
}

function transInCache(startAya, endAya) {
    for (var i = startAya; i < endAya; i++)
        if (TransText.get(i) == null)
            return false;
    return true;
}
var Search = {
    query: '',
    type: '',
    page: 1,
    pattern: '',
    highlight: '',
    current: '',
    go: function() {
        var query = $('#searchText').val();
        if ($.trim(query) == '') {
            alert(_('Search string is empty.'));
            return;
        }
        update('opt.searchText', query);
        History.load({
            tab: 'search',
            type: 'quran',
            query: query,
            page: 1
        });
    },
    goRoot: function() {
        var root = $('#rootMenu').val();
        History.load({
            tab: 'search',
            type: 'root',
            query: root,
            page: 1
        });
    },
    goTo: function() {
        var addr = $('#gotoText').val();
        addr = addr.split(':');
        displayAya(val(addr[0]), val(addr[1]) || 1);
    },
    showPage: function(offset) {
        var page = val($('#pageOffset').val()) + offset;
        page = Math.max(page, 1);
        page = Math.min(page, val($('#totalPages').text()));
        $('#pageOffset').val(_num(page));
        this.page = page;
        History.load({
            tab: 'search',
            type: this.type,
            query: this.query,
            page: page
        });
    },
    display: function(args) {
        args = args || {
            type: this.type,
            query: this.query,
            page: this.page
        };
        if (this.current != JSON.stringify(args)) {
            this.update(args);
            this.retrieve(args);
        } else {
            currTab = 'search';
            showTab('search');
        }
    },
    dirty: function() {
        this.current = '';
    },
    update: function(args) {
        $.extend(this, args);
        this.pattern = TextTools.enrichPattern(this.query);
        this.highlight = this.pattern.replace(/[+!:]/g, '|').replace(/^[|]+/g, '');
        this.highlight = (args.type == 'root') ? 'ROOT' : this.highlight;
        if (!TextTools.isValidReg(this.highlight));
    },
    retrieve: function(args) {
        this.current = JSON.stringify(args);
        var pattern = (args.type == 'root') ? 'Root ' + this.query : this.pattern;
        var args = {
            type: searchTextType,
            searchText: encodeURIComponent(this.query),
            pattern: encodeURIComponent(pattern),
            transType: curr.trans,
            pageOffset: this.page,
            resultsPerPage: resultsPerPage
        };
        $.ajax({
            type: 'GET',
            url: root + '/php/search.php',
            data: args,
            dataType: 'text',
            success: function(response) {
                Search.procQuery(response);
            },
            error: showError
        });
        $("#loadingImage").show();
    },
    procQuery: function(response) {
        hideLoadingImage();
        var result = response.split('|');
        var count = result[0].split(':');
        var numAyaMatch = count[0];
        var totalMatch = count[1];
        var resutls = result[1].split('\n');
        var res = [];
        for (var i = 0; i < resutls.length - 1; i++) {
            var item = resutls[i];
            item = item.split(':');
            var trans = item[2].replace(/↕/g, ':');
            TransText.set(item[0], trans);
            res.push({
                index: item[0],
                text: item[1],
                trans: trans
            });
        }
        this.draw(res, numAyaMatch, totalMatch);
    },
    draw: function(results, numAyaMatch, totalMatch) {
        if (results.length == 0)
            this.page = 0;
        $('#pageOffset').val(_num(this.page));
        $('#searchPattern').text(this.query);
        var div = this.compose(results, this.page);
        $('#searchResults').empty().append(div);
        $('#searchFrame').scrollTop(0);
        adjustPageHeight();
        this.initPageActions();
        $('#totalPages').text(_num(Math.ceil(numAyaMatch / resultsPerPage)));
        $('#searchStat').text(_('{0} results in {1} ayas').format(_num(totalMatch), _num(numAyaMatch)));
        this.setResultsFont();
        $('#search-selector').show();
        currTab = 'search';
        showTab('search');
    },
    compose: function(results, pageOffset) {
        var mainDiv = $('<div />');
        var args = {
            showSigns: false,
            showSmallAlef: opt.showSmallAlef,
            ignoreInternalSigns: true,
            font: 'default',
            type: searchTextType
        };
        for (var i = 0; i < results.length; i++) {
            var line = ' ' + results[i].text + ' ';
            line = TextTools.highlight(this.highlight, line);
            line = TextTools.fixText(line, args);
            var item = Quran.getAya(results[i].index);
            var spec = Quran.getSuraName(item.sura) + ': ' + _num(item.aya, 'ar');
            var rowClass = 'row-' + i % 2;
            var id = 's-' + item.sura + '-' + item.aya;
            var div = $('<div />').attr('id', id).addClass('result').html($('<div />').addClass(rowClass).html('<span class="number">' + _num((pageOffset - 1) * resultsPerPage + i + 1) + '. </span>' + line + ' <span class="spec">﴿' + spec + '﴾</span>'));
            mainDiv.append(div);
        }
        return mainDiv;
    },
    setResultsFont: function() {
        var scale = 1.1;
        var textType = isUthmani(searchTextType) ? 'uthmaniSmall' : 'simpleSmall';
        var font = fontList[getPrefInstalledFont(textType)];
        $('#searchResults').css({
            'font-family': font.family,
            'font-size': (font.scale * scale) + 'em'
        });
    },
    initPageActions: function() {
        $('.result').click(function() {
            var id = $(this).attr('id').replace('s-', '').split('-');
            popDelay = 200;
            displayAya(id[0], id[1]);
        });
        initTransTip($('.result'));
    },
    end: 0
};

function initRootList() {
    Roots = [];
    var root = RootList.split(' ');
    for (var i = 0; i < root.length; i++)
        Roots.push(root[i]);
}

function initCharList(chr) {
    var chars = 'آ ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي';
    chars = chars.split(' ');
    var str = '';
    for (var i = 0; i < chars.length; i++) {
        var clas = (chars[i] == chr) ? 'current-char' : '';
        str += '<a class="' + clas + '" href="javascript:initRootMenu(\'' + chars[i] + '\')">' + chars[i] + '</a> ';
    }
    $('#charList').html(str);
}

function initRootMenu(chr) {
    chr = chr || 'ش';
    initCharList(chr);
    var items = [];
    if (chr == 'ا') chr = '[اإأ]';
    if (chr == 'ك') chr = '[كک]';
    reg = new RegExp('^' + chr, '');
    for (var i = 0; i < Roots.length; i++)
        if (reg.test(Roots[i]))
            items.push({
                value: Roots[i],
                text: Roots[i]
            });
    initMenu('rootMenu', items);
}

function adjustPageHeight() {
    winDim = {
        x: $(window).width(),
        y: $(window).height()
    };
    var leftPane = $('#side-content').position();
    var footerHeight = $('#footer-content').height();
    var height = winDim.y - leftPane.top - footerHeight - $('#top-menu').height() - 1;
    $('#side-content').css({
        'min-height': height + 'px'
    });
    var w = winDim.x;
    var pageWidth = $('.container').width();
    var x = parseInt((w - pageWidth) / 2);
    x = Math.max(x, 0);
    if (Math.abs(x - lastXPos) >= 10) {
        lastXPos = x;
        $('#container').css({
            'margin-left': x
        });
        $('body').css({
            'background-position': (x - 16) + 'px 0'
        });
    }
    TransBox.update();
}

function initPageActions() {
    $('.aya').click(function() {
        if (!$(this).hasClass('selected')) {
            var id = $(this).attr('id').replace('t-', '').split('-');
            displayAya(id[0], id[1]);
        }
    });
    var inherit = 'transparent';
    var orgColor = '#F7FCE3';
    var hoverColor = '#E4EEDC';
    $('.aya-wrapper').css({
        backgroundColor: inherit
    });
    $('.aya').hover(function() {
        if (!$(this).hasClass('selected')) {
            var busy = $(this).children().first().css('backgroundColor') != inherit;
            $(this).children().stop().css(busy ? {} : {
                    backgroundColor: orgColor
                })
                .animate({
                    backgroundColor: hoverColor
                }, 300, 'swing', function() {
                    $(this).css({
                        backgroundColor: inherit
                    }).parent().addClass('hover');
                });
        }
    }, function() {
        if (!$(this).hasClass('selected')) {
            var busy = $(this).children().first().css('backgroundColor') != inherit;
            if (!busy && !$(this).hasClass('hover'))
                return;
            $(this).children().stop().css(busy ? {} : {
                    backgroundColor: hoverColor
                })
                .animate({
                    backgroundColor: orgColor
                }, 500, 'swing', function() {
                    $(this).css({
                        backgroundColor: inherit
                    }).parent().removeClass('hover');
                });
        } else
            $(this).removeClass('hover');
    });
    if (currTab == 'quran' && opt.showTrans == 'hover')
        initTransTip($('.aya'));
}

function getObjTrans(obj) {
    var id = $(obj).attr('id').replace(/[st]-/, '').split('-');
    var trans = TransText.fetch([id[0], id[1]]);
    trans.text = TextTools.fixTransText(trans.text);
    return trans;
}

function initTransTip(obj) {
    $(obj).each(function() {
        var trans = getObjTrans(this);
        var addr = (trans.sura + ':' + trans.aya) + (trans.aya != trans.ayaTo ? '&ndash;' + trans.ayaTo : '');
        $(this).tip({
            text: trans.text,
            title: '[' + addr + '] <span>' + transList[curr.trans] + '</span>',
            cls: 'transTip',
            delayIn: 800,
            delayOut: 50,
            fadeIn: 60,
            fadeOut: 90,
            offsetX: -10,
            offsetY: 16,
            shadow: 3,
            width: 270,
            above: true,
            align: isRTL ? 'center' : 'left',
            track: true,
            textStyle: {
                direction: getTransDir(),
                fontFamily: transFont,
                fontSize: Math.round(transFontSize * 1.5) + 'px'
            },
            sticky: isMSafari
        });
    });
}

function initTooltips() {
    if (isMSafari)
        return;
    $.extend($.fn.tipsy.defaults, {
        opacity: 0.9,
        delayIn: 400
    });
    $('.arrow-link').each(function() {
        var self = $(this);
        self.tipsy({
            fallback: function() {
                return arrowTitle(self);
            },
            gravity: $(this).hasClass('arrow-left') ? 'se' : 'sw'
        });
    });
    $('.tipsyd').tipsy({
        gravity: 'sw'
    });
}

function arrowTitle(obj) {
    var dir = $(obj).hasClass('arrow-left') ? 'left' : 'right';
    var num = getArrowOffset(dir);
    return (num == 1) ? _('Next Page') : _('Previous Page');
}

function getArrowOffset(arrow) {
    return {
        rtl: {
            left: +1,
            right: -1
        },
        ltr: {
            left: -1,
            right: +1
        }
    }[getCurrDir()][arrow];
}

function initAudioUI() {
    var firstRow = $('.reciter').first();
    initReciteMenu(firstRow, opt.reciters[0]);
    initRepeatMenu();
    initDelayMenu();
    for (var i in opt.reciters) {
        var reciter = opt.reciters[i];
        if (i == 0)
            initReciteRow(firstRow, reciter);
        else
            createReciterRow(reciter).appendTo('#reciters');
    }
    $('#playScope').val(opt.playScope);
    $('#soundOptions').click(function() {
        $('.sound-options')[isIE7 ? 'toggle' : 'slideToggle'](200);
    });
}

function createReciterRow(reciter) {
    var row = $('<div/>').addClass('menu-row reciter').append($('<select/>').addClass('reciteMenu')).append($('<label/>').addClass('icon icon-close').attr('title', _('Remove')));
    row.find('.icon-close').click(function() {
        removeReciter($(this).parent().index());
    })
    initReciteMenu(row, reciter);
    return row;
}

function initRepeatMenu() {
    var items = [];
    for (var i = 1; i <= 9; i++)
        items.push({
            text: 'x' + i,
            value: i
        });
    items.push({
        text: '∞',
        value: 100
    });
    initMenu($('.repeatMenu'), items);
}

function initDelayMenu() {
    var items = [];
    for (var i = 0; i <= 9; i++)
        items.push({
            text: _('{0} sec').format(_num(i)),
            value: i
        });
    items.push({
        text: _('Duration of Aya'),
        value: 'len'
    });
    initMenu($('#playDelay'), items, opt.playDelay);
}

function initReciteMenu(row, reciter) {
    var items = [];
    for (var i in reciteList)
        if (!reciteList[i].trans)
            items.push({
                text: reciteList[i].name,
                value: i,
                title: reciteList[i].full
            });
    items.sort(sortItems);
    items.push({
        text: '------',
        value: 'sep-1'
    });
    for (var i in reciteList)
        if (reciteList[i].trans)
            items.push({
                text: reciteList[i].name,
                value: i,
                title: reciteList[i].full
            });
    var menu = row.find('.reciteMenu');
    initMenu(menu, items, reciter.id);
    menu.change(function() {
        setRecitation(row, $(this).val());
    }).blur();
}

function initReciteRow(row, reciter) {
    setRepeat(row, reciter.num);
    initRepeatUI(row);
}

function setRepeat(row, count) {
    opt.reciters[row.index()].num = count;
    label = count < 10 ? 'x' + count : '&#8734;';
    row.find('.repeatCount').html(label).parent().removeClass('edit');
    row.find('.repeatMenu').val(count);
    Player.reset();
}

function setRecitation(row, id) {
    opt.reciters[row.index()].id = id;
    Player.reset();
    setAudioTrans();
}

function initRepeatUI(row) {
    row.find('.repeatCount').click(function() {
        $(this).parent().addClass('edit');
        row.find('.repeatMenu').focus();
    }).tipsy({
        gravity: isRTL ? 'se' : 'sw',
        delayIn: 600
    });
    row.find('.repeatMenu').change(function() {
        setRepeat(row, $(this).val());
    }).blur(function() {
        $(this).parent().removeClass('edit');
    });
}

function addReciter(reciterID) {
    if (opt.reciters.length >= 4)
        return;
    opt.reciters.push({
        id: reciterID ? reciterID : defTransRecite,
        num: 1
    });
    var reciter = opt.reciters[opt.reciters.length - 1];
    var row = createReciterRow(reciter).hide();
    row.appendTo('#reciters')[isIE7 ? 'show' : 'slideDown']();
    Player.reset();
    setAudioTrans();
}

function removeReciter(index) {
    if (index == 0)
        return;
    opt.reciters.splice(index, 1);
    $($('.reciter').get(index)).slideUp('normal', function() {
        $(this).remove()
    });
    Player.reset();
    setAudioTrans();
}
Storage = {
    data: {
        curr: {
            sura: defSura,
            aya: 1,
            quran: defQuranType,
            trans: defTrans
        },
        opt: {
            version: '',
            ad: 0,
            showSigns: true,
            showSmallAlef: true,
            showTrans: 'hover',
            fontID: 'def',
            fontSize: 16,
            customFont: 'Lotus',
            textJustify: defJustify,
            volume: 0.8,
            playScope: 'cont',
            playDelay: 0,
            reciters: [{
                id: defRecite,
                num: 1
            }],
            searchText: 'كتاب'
        }
    },
    medium: '',
    cookiesExpire: 120,
    cookiesPath: '/',
    init: function() {
        this.medium = (typeof localStorage != 'undefined' && useLocalStorage) ? 'localStorage' : 'cookie';
        this.load();
        this.upgrade();
    },
    load: function() {
        for (var i in this.data)
            window[i] = $.extend(true, $.clone(this.data[i]), this.read(i));
    },
    save: function(name) {
        for (var i in this.data)
            if (!name || i == name)
                this.write(i, window[i]);
    },
    reset: function(name) {
        for (var i in this.data)
            if (!name || i == name)
                window[i] = $.clone(this.data[i]);
        this.save();
    },
    upgrade: function() {
        if (opt.version && opt.version < '1.4.3')
            curr.quran = {
                'simple-modified': 'simple',
                'simple': 'simple-plain'
            }[curr.quran] || curr.quran;
        if (opt.version == '1.4.3')
            curr.quran = {
                'simple-plain': 'simple'
            }[curr.quran] || curr.quran;
        opt.version = version;
    },
    read: function(name) {
        var res = {};
        var data = (this.medium == 'localStorage') ? localStorage[name] : $.cookie(name);
        try {
            res = data ? JSON.parse(data) : res;
        } catch (e) {};
        return res;
    },
    write: function(name, object) {
        var val = JSON.stringify(object);
        if (this.medium == 'localStorage')
            localStorage[name] = val;
        else
            $.cookie(name, val, {
                expires: this.cookiesExpire,
                path: this.cookiesPath
            });
    },
    end: 0
};

function setFontSize(num) {
    var size = val($('#fontSize').val()) + num;
    $('#fontSize').val(_num(size));
    updateFontSettings();
}

function updateFontSettings() {
    update('opt.fontSize', val($('#fontSize').val()));
    update('opt.textJustify', $('#textJustify').isChecked());
    $('#quranText').css({
        'text-align': opt.textJustify ? 'justify' : 'right'
    });
    $('#quran-tab, #trans-tab').css({
        'font-size': (opt.fontSize + 3) + 'px'
    });
}

function updateFont() {
    update('opt.fontID', $('#fontMenu').val());
    update('opt.customFont', $('#customFont').val());
    $('#customFontRow').toggle(opt.fontID == 'custom');
    fontList['custom'].family = opt.customFont;
    fontList['custom'].scale = fontWidth(baseFont) / fontWidth(opt.customFont);
    setFont();
}

function getFontID() {
    var id = opt.fontID;
    if (id == 'def') {
        id = isUthmani() ? 'me_quran' : 'naskh';
        if (isMac && isSafari) id = 'scheherazade';
        if (isChrome && isUthmani()) id = 'scheherazade';
    }
    return id;
}

function fontFace(fontID) {
    var font = fontList[fontID];
    return font.family + (font.embed ? ',' + font.embed : '');
}

function checkInstalledFonts() {
    for (var i in fontList) {
        var font = fontList[i];
        if (font.family && fontExists(font.family))
            font.installed = true;
    }
}

function getPrefInstalledFont(type) {
    type = type || (isUthmani() ? 'uthmani' : 'simple');
    var list = fontPrefs[type];
    for (var i in list) {
        var fontID = list[i];
        if (fontList[fontID].installed)
            return fontID;
    }
    return 'arial';
}

function fontWidth(fontName, text) {
    text = text || 'ربنا إنك جامع الناس ليوم لا ريب فيه إن الله لا يخلف الميعاد';
    if (text == 2) text = 'In the name of Allah, بسم الله الرحمن الرحيم';
    var tester = $('.font-tester');
    tester.css({
        'font-family': fontName
    }).text(text).show();
    var width = tester.width();
    tester.hide();
    return width;
}

function fontExists(fontName) {
    var fontFamily = fontName + ', ' + baseFont;
    return fontWidth(baseFont) * fontWidth(baseFont, 2) != fontWidth(fontFamily) * fontWidth(fontFamily, 2);
}

function setFont() {
    var fontID = getFontID();
    var font = fontList[fontID];
    if (font.embed)
        applyEmbedFont(fontID);
    else
        applyFont(fontID);
}

function applyFont(fontID) {
    if (!fontExists(fontFace(fontID)))
        fontID = getPrefInstalledFont();
    var font = fontList[fontID];
    currFontID = fontID;
    setQuranFont();
    $('#loading-font').hide();
}

function applyEmbedFont(fontID) {
    embedFontStyle(fontID);
    $('#loading-font').show();
    tryFontCounter = 0;
    tryFont(fontID);
}

function tryFont(fontID) {
    if (++tryFontCounter < 50 && !fontExists(fontFace(fontID))) {
        setTimeout('tryFont("' + fontID + '")', 400);
        return;
    }
    $('#loading-font').hide();
    applyFont(fontID);
}

function embedFontStyle(fontID) {
    if ($.isInArray(fontID, embeddedFonts))
        return;
    embeddedFonts.push(fontID);
    var font = fontList[fontID];
    if(font.css){
        console.log(font.name,'font has css')
        $('<link rel="stylesheet" href="'+font.css+'"/>').appendTo("head");
        return;
    }
    console.log(font.name,'font has not css.')
    var style = "font-family: '" + font.embed + "';" + "src: url('http://tanzil.net/res/font/eot/" + font.file + ".eot');" + "src: local('" + font.family + "'), url('http://tanzil.net/res/font/org/" + font.file + ((font.file == 'KFC_naskh') ? ".otf') format('opentype');" : ".ttf') format('truetype');");
    $("<style type='text/css'> @font-face {" + style + "} </style>").appendTo("head");
}
var TextTools = {
    matchingRules: [
        ["$HAMZA_SHAPE", "$HAMZA_SHAPE"],
        ["$ALEF_MAKSURA", "YY"],
        ["$ALEF", "[$ALEF$ALEF_MAKSURA$ALEF_WITH_MADDA_ABOVE$ALEF_WITH_HAMZA_ABOVE$ALEF_WITH_HAMZA_BELOW$ALEF_WASLA]"],
        ["[$TEH$MARBUTA]", "[$TEH$MARBUTA]"],
        ["$HEH", "[$HEH$MARBUTA]"],
        ["$WAW", "[$WAW$WAW_WITH_HAMZA_ABOVE$SMALL_WAW]"],
        ["$YEH", "[$YEH$ALEF_MAKSURA$YEH_WITH_HAMZA$SMALL_YEH]"],
        ["YY", "[$ALEF_MAKSURA$YEH$ALEF]"],
        [" ", "$SPACE"]
    ],
    wildcardRegs: [
        ["\\.", "P"],
        ["\\*", "S"],
        ["[?؟]", "Q"],
        ["S+", "S"]
    ],
    wildcards: [
        ["S", "$LETTER_HARAKA*"],
        ["Q", "$LETTER"],
        ["P", "$LETTER"]
    ],
    preProcess: [
        ["[$FARSI_YEH$YEH_BARREE]", "$YEH"],
        ["[$FARSI_KEHEH$SWASH_KAF]", "$KAF"],
        ["$HEH_DOACHASHMEE", "$HEH"],
        ["$NOON$SUKUN", "$NOON"],
        ["([$KASRA$KASRATAN])($SHADDA)", "$2$1"]
    ],
    init: function() {
        for (var i in UGroups)
            UGroups[i] = this.regTrans(UGroups[i]);
    },
    fixText: function(text, args) {
        // console.log('fixText=', text)
        if(text && curr.quran=='tajweed'){
            
            return text
                    .replace(/\[h/g, '<span class="ham_wasl" title="Hamzat Wasl" alt="')
                    .replace(/\[s/g, '<span class="slnt" title="Silent" alt="')
                    .replace(/\[l/g, '<span class="slnt" title="Lam Shamsiyyah" alt="')
                    .replace(/\[n/g, '<span class="madda_normal" title="Normal Prolongation: 2 Vowels" alt="')
                    .replace(/\[p/g,'<span class="madda_permissible" title="Permissible Prolongation: 2, 4, 6 Vowels" alt="')
                    .replace(/\[m/g, '<span class="madda_necessary" title="Necessary Prolongation: 6 Vowels" alt="')
                    .replace(/\[q/g, '<span class="qlq" title="Qalqalah" alt="')
                    .replace(/\[o/g, '<span class="madda_obligatory" title="Obligatory Prolongation: 4-5 Vowels" alt="')
                    .replace(/\[c/g, '<span class="ikhf_shfw" title="Ikhfa\' Shafawi - With Meem" alt="')
                    .replace(/\[f/g, '<span class="ikhf" title="Ikhfa\'" alt="')
                    .replace(/\[w/g, '<span class="idghm_shfw" title="Idgham Shafawi - With Meem" alt="')
                    .replace(/\[i/g, '<span class="iqlb" title="Iqlab" alt="')
                    .replace(/\[a/g, '<span class="idgh_ghn" title="Idgham - With Ghunnah" alt="')
                    .replace(/\[u/g, '<span class="idgh_w_ghn" title="Idgham - Without Ghunnah" alt="')
                    .replace(/\[d/g, '<span class="idgh_mus" title="Idgham - Mutajanisayn" alt="')
                    .replace(/\[b/g, '<span class="idgh_mus" title="Idgham - Mutaqaribayn" alt="')
                    .replace(/\[g/g, '<span class="ghn" title="Ghunnah: 2 Vowels" alt="')
                    .replace(/\[/g,  '" >')
                    .replace(/\]/g, "</span>")
        }
        args = args || {};
        if (args.showSigns) {
            text = this.pregReplace(' ([$HIGH_SALA-$HIGH_SEEN])', '<span class="sign">&nbsp;$1</span>', text);
            text = this.pregReplace('($SAJDAH)', args.ignoreInternalSigns ? '' : '<span class="internal-sign">$1</span>', text);
            text = this.pregReplace('$RUB_EL_HIZB', args.ignoreInternalSigns ? '' : '<span class="icon juz-sign"></span>', text);
        } else
            text = this.pregReplace('[$HIGH_SALA-$RUB_EL_HIZB$SAJDAH]', '', text);
        if (isFF4)
            text = this.pregReplace('($REH$HARAKA*$END)', '$1$ZWNJ', text);
        if (!args.showSmallAlef)
            text = this.pregReplace('$SUPERSCRIPT_ALEF', '', text);
        if (args.font == 'me_quran') {
            text = this.pregReplace('([$HAMZA$DAL-$ZAIN$WAW][$SHADDA$FATHA]*)($SUPERSCRIPT_ALEF)', '$1$ZWNJ$2', text);
            text = this.pregReplace('($LAM$HARAKA*)$TATWEEL$HAMZA_ABOVE($HARAKA*$ALEF)', '$1$HAMZA$2', text);
        } else {
            text = this.pregReplace('($SHADDA)([$KASRA$KASRATAN])', '$2$1', text);
            text = this.pregReplace('($LAM$HARAKA*$LAM$HARAKA*)($HEH)', '$1$TATWEEL$2', text);
        }
        text = this.removeExtraMeems(text);
        text = this.pregReplace('$ALEF$MADDA', '$ALEF_WITH_MADDA_ABOVE', text);
        return text;
    },
    fixTransText: function(text, args) {
        text = text.replace(/\]\]/g, '$').replace(/ *\[\[[^$]*\$/g, '');
        return text;
    },
    removeExtraMeems: function(text) {
        text = this.pregReplace('([$FATHATAN$DAMMATAN])$LOW_MEEM', '$1', text);
        text = this.pregReplace('($KASRATAN)$HIGH_MEEM', '$1', text);
        return text;
    },
    highlight: function(pattern, str) {
        pattern = new RegExp('(' + pattern + ')', 'g');
        str = str.replace(pattern, '◄$1►');
        str = str.replace(/◄\s/g, ' ◄').replace(/\s►/g, '► ');
        str = str.replace(/([^\s]*)◄/g, '◄$1').replace(/►([^\s]*)/g, '$1►');
        while (/◄[^\s]*◄/.test(str))
            str = str.replace(/(◄[^\s]*)◄/g, '$1').replace(/►([^\s]*►)/g, '$1');
        str = str.replace(/◄/g, '<span class="highlight">').replace(/►/g, '</span>');
        return str;
    },
    enrichPattern: function(pattern, ignoreHaraka) {
        if (ignoreHaraka)
            pattern = this.pregReplace("$HARAKA", '', pattern);
        pattern = this.pregReplace('$TATWEEL', '', pattern);
        pattern = pattern.replace(/\-/g, '!');
        pattern = this.regTrans(pattern);
        pattern = this.handleSpaces(pattern);
        pattern = this.applyRules(this.preProcess, pattern);
        pattern = this.applyRules(this.wildcardRegs, pattern);
        pattern = this.pregReplace("(.)", "$1$HARAKAT*", pattern);
        pattern = this.applyRules(this.matchingRules, pattern);
        pattern = this.applyRules(this.wildcards, pattern);
        return pattern;
    },
    handleSpaces: function(pattern) {
        var prev = '';
        if (pattern == '') return pattern;
        pattern = pattern.replace(/\s+/g, ' ');
        while (pattern != prev) {
            prev = pattern;
            pattern = pattern.replace(/^(([^"]*"[^"]*")*)([^"\s]*) /g, '$1$3+');
        }
        pattern = pattern.replace(/_/g, ' ');
        pattern = pattern.replace(/"/g, ' ');
        pattern = pattern.replace(/^[+|]+/g, '').replace(/[+|!]+$/g, '');
        pattern = pattern.replace(/\+*([+|!])\+*/g, '$1');
        return pattern;
    },
    isValidReg: function(pattern) {
        try {
            new RegExp(pattern, 'g');
        } catch (e) {
            return false;
        }
        return true;
    },
    regTrans: function(str) {
        return str.replace(/\$([A-Z_]+)/g, function(s, i, ofs, all) {
            return UGroups[i] || UChars[i] || '';
        });
    },
    pregReplace: function(fromExp, toExp, str) {
        fromExp = new RegExp(this.regTrans(fromExp), 'g');
        toExp = this.regTrans(toExp);
        return str.replace(fromExp, toExp);
    },
    applyRules: function(rules, str) {
        for (var i in rules)
            str = this.pregReplace(rules[i][0], rules[i][1], str);
        return str;
    },
    end: 0
}
var Dialog = {
    defaults: {
        width: 400,
        height: 'auto',
        title: 'Dialog',
        buttons: {
            'Close': function() {
                Dialog.close();
            }
        },
        modal: -1,
        zIndex: 1000,
        onload: function() {}
    },
    options: {},
    init: function(modal) {
        $('.dbox-close').click(function() {
            Dialog.close();
            return false;
        });
    },
    open: function(args) {
        this.options = $.extend({}, this.defaults, args);
        Modal.show(0, this.options.modal);
        this.showLoading();
        this.loadContent();
    },
    close: function() {
        $('.dbox-wrapper').fadeOut(200);
        Modal.hide(200);
    },
    set: function(args) {
        $.extend(this.options, args);
    },
    showLoading: function() {
        this.width(400);
        $('.dbox').hide();
        $('.dbox-loading').show();
        $('.dbox-wrapper').css({
            zIndex: this.options.zIndex
        }).show();
        this.updatePosition();
    },
    loadContent: function() {
        var arg = this.options;
        var currDiv = $('.dbox-content').children()[0];
        $('#dialogs').append(currDiv);
        if ($('#' + arg.id).length)
            this.display(arg);
        else {
            $('#ex-dialog').load(arg.id, function() {
                arg.id = 'ex-dialog';
                Dialog.display();
            });
        }
    },
    display: function(arg) {
        var arg = this.options;
        $('.dbox-content').append($('#' + arg.id));
        $('.dbox-title span').text(arg.title);
        $('.dbox-content').height(arg.height);
        this.width(arg.width);
        this.setButtons();
        $('.dbox-loading').hide();
        $('.dbox').show();
        $('.dbox-content').scrollTop(0);
        arg.onload.apply(this);
        this.updatePosition();
    },
    setButtons: function() {
        var buttons = this.options.buttons;
        $('.dbox-footer').empty();
        for (var button in buttons) {
            var id = 'dialog-button-' + button.toLowerCase().replace(' ', '-');
            $('<span/>').addClass('button').attr('id', id).text(_(button)).click(buttons[button])
                .disableTextSelect()
                .appendTo($('.dbox-footer'));
        }
    },
    width: function(width) {
        width += 42;
        var w = $(document).width();
        $('.dbox-wrapper').width(width).css({
            left: (w - width) / 2
        });
    },
    updatePosition: function() {
        var w = $(window).height();
        var h = $('.dbox-wrapper').height() + 20;
        var top = Math.min(125, (w - h) / 2);
        $('.dbox-wrapper').css({
            top: Math.max(0, top) + $(window).scrollTop()
        });
    },
    refresh: function() {
        $('.dbox-wrapper').hide().show();
    },
    end: 0
};

function openDialog(id, title, width, height) {
    if (/\.php/.test(id))
        id = root + '/php/content/' + id + '?locale=' + locale;
    Dialog.open({
        id: id,
        title: title,
        modal: -1,
        width: width || 400,
        height: height || 'auto'
    });
    return false;
}
var Modal = {
    duration: 200,
    opacity: 0.1,
    zIndex: 900,
    blanket: null,
    init: function() {
        this.blanket = $('<div />')
            .attr('id', 'modal-blanket')
            .css({
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                backgroundColor: '#000',
                opacity: this.opacity,
                zIndex: this.zIndex
            })
            .appendTo(document.body).hide();
        $(window).bind('resize', function() {
            Modal.update();
        });
    },
    show: function(duration, opacity) {
        if (isSet(opacity))
            this.blanket.css({
                opacity: this.opacity = opacity
            });
        if (!isSet(duration))
            duration = this.duration;
        this.update();
        if (this.opacity >= 0)
            this.blanket.fadeIn(duration);
        this.toggleObjects(false);
    },
    hide: function(duration) {
        if (!isSet(duration))
            duration = this.duration;
        this.blanket.fadeOut(duration);
        setTimeout('Modal.toggleObjects(true)', duration);
    },
    update: function() {
        this.blanket.css({
            height: $(document).height()
        });
    },
    toggleObjects: function(show) {
        $('body')[show ? 'removeClass' : 'addClass']('modal');
    },
    end: 0
};
var TransBox = {
    box: null,
    init: function() {
        this.box = $('.tbox');
        this.toggle(opt.showTrans == 'fixed');
        var self = this;
        this.box.find('.tbox-close').click(function() {
            $.Radio.val('showTrans', 'hover');
            updateTransSettings();
            return false;
        });
    },
    toggle: function(show) {
        if (isPageEmbedded || currTab != 'quran')
            return;
        this.box[show ? 'show' : 'hide'](isIE7 || isRTL ? null : 200);
    },
    position: function(obj) {
        var top = obj.offset().top;
        var x = $('#main-content').offset().left + $('#main-content').width() - 65;
        if (isRTL)
            x = $('#main-content').offset().left + 65 - 256;
        this.box.css('left', x).css({
            top: top
        }, 200, 'swing');
    },
    update: function(obj) {
        obj = obj || $('#' + curr.sura + '-' + curr.aya);
        if (obj.length < 1)
            return;
        var trans = getObjTrans(obj);
        if (!trans.text) return;
        var addr = (trans.sura + ':' + trans.aya) + (trans.aya != trans.ayaTo ? '&ndash;' + trans.ayaTo : '');
        var title = '[' + addr + '] <span>' + transList[curr.trans] + '</span>';
        this.box.find('.tbox-title').toggleClass('rtl', getTransDir() == 'rtl');
        this.box.find('.tbox-title>span').html(title);
        this.box.find('.tbox-content').html(trans.text).css({
            direction: getTransDir(),
            fontFamily: transFont,
            fontSize: Math.round(transFontSize * 1.5) + 'px'
        });
        this.position(obj);
    },
    end: 0
};
(function($) {
    $.fn.tip = function(op1, op2) {
        if (op1 == 'update')
            return $.Tip.update(this, op2);
        return $(this).each(function() {
            $.Tip.init(this, op1);
        });
    };
    $.Tip = {
        defaults: {
            delayIn: 400,
            delayOut: 0,
            fadeIn: 200,
            fadeOut: 0,
            opacity: 1,
            offsetX: 0,
            offsetY: 10,
            trigger: 'mouseover',
            triggerOut: 'mouseout',
            above: true,
            align: 'left',
            shadow: 1,
            width: 'auto',
            track: false,
            sticky: false,
            text: '',
            title: '',
            cls: '',
            style: {},
            textStyle: {},
            titleStyle: {},
            api: {}
        },
        tooltip: null,
        target: null,
        options: {},
        pos: {
            x: 0,
            y: 0
        },
        showTimer: 0,
        hideTimer: 0,
        init: function(obj, options) {
            var op = this.options = $.extend({}, this.defaults, options);
            this.setOptions(obj, op);
            var self = $.Tip;
            $(obj).bind(op.trigger, function(e) {
                    self.buildTip(op.sticky);
                    self.tooltip.hide();
                    self.target = $(e.currentTarget);
                    self.options = self.getOptions();
                    self.updateTip();
                    self.position(e);
                    self.show();
                    if (op.track)
                        $(e.currentTarget).mousemove(function(e) {
                            $.Tip.position(e)
                        });
                })
                .bind(op.triggerOut, function(e) {
                    var op = self.options;
                    if (!op.sticky)
                        self.hide();
                    if (op.track)
                        $(e.currentTarget).unbind('mousemove');
                });
        },
        show: function() {
            var op = this.options;
            this.showTimer = this.run(function() {
                if (isIE)
                    $.Tip.tooltip.show();
                else
                    $.Tip.tooltip.stop().fadeIn(op.fadeIn, function() {
                        $(this).css({
                            opacity: 1
                        })
                    });
            }, op.delayIn, [this.hideTimer]);
        },
        hide: function() {
            var op = this.options;
            this.hideTimer = this.run(function() {
                if (isIE)
                    $.Tip.tooltip.hide();
                else
                    $.Tip.tooltip.stop().fadeOut(op.fadeOut);
            }, op.delayOut, [this.showTimer]);
        },
        update: function(obj, options) {
            options = options || {};
            this.options = this.getOptions(obj);
            $.extend(this.options, options);
            if (this.target && this.target[0] == $(obj)[0] && this.tooltip.is(':visible')) {
                this.updateTip();
                this.position();
            }
        },
        run: function(cmd, delay, kill) {
            kill = isSet(kill) ? kill : [];
            $.each(kill, function() {
                if (this)
                    clearTimeout(this);
            });
            return setTimeout(cmd, delay);
        },
        updateTip: function() {
            var op = this.options;
            var tip = this.tooltip;
            var text = $.isFunction(op.text) ? op.text.apply(this) : op.text;
            var title = $.isFunction(op.title) ? op.title.apply(this) : op.title;
            tip.attr('class', 'tip tip-shadow').addClass(op.cls);
            tip.find('.tip-wrapper').css({
                top: -op.shadow,
                left: -op.shadow
            }).css(op.style);
            tip.find('.tip-content').html(text).css(op.textStyle);
            tip.find('.tip-title').css(op.titleStyle).toggle(title != '');
            tip.find('.tip-title>span').html(title);
            this.updateWidth();
        },
        updateWidth: function() {
            var op = this.options;
            this.tooltip.width(op.width);
            op.height = this.tooltip.height();
        },
        position: function(e) {
            if (e)
                this.pos = {
                    x: e.pageX,
                    y: e.pageY
                };
            var op = this.options;
            var tip = this.tooltip;
            var d = op.shadow,
                x = this.pos.x,
                y = this.pos.y,
                w = op.width + d,
                h = op.height + d,
                yt = y - h - op.offsetY,
                yb = y + h + op.offsetY,
                xr = x - w - op.offsetX,
                xl = x + w + op.offsetX,
                sl = $(window).scrollLeft(),
                sr = sl + winDim.x,
                st = $(window).scrollTop(),
                sb = st + winDim.y;
            var yy = (yt >= st && (op.above || yb > sb)) ? yt : y + op.offsetY;
            var xx = {
                'left': x + op.offsetX,
                'right': xr,
                'center': x - w / 2
            }[op.align];
            if (xx + w > sr)
                xx = sr - w;
            xx = Math.max(xx, sl);
            this.tooltip.css({
                left: xx + d,
                top: yy + d
            });
        },
        getOptions: function(obj) {
            obj = obj || this.target;
            return $(obj).data('tip-options');
        },
        setOptions: function(obj, options) {
            $(obj).data('tip-options', options);
        },
        buildTip: function(closeButton) {
            if (!this.tooltip) {
                this.tooltip = $('<div/>').addClass('tip tip-shadow').css({
                    position: 'absolute'
                }).appendTo(document.body).hide();
            }
            this.tooltip.empty().append($('<div/>').addClass('tip-wrapper').css({
                position: 'relative'
            }).append($('<div/>').addClass('tip-title').addClass(getTransDir() == 'rtl' ? 'rtl' : '').append($((closeButton ? '<a class="tip-close" title="' + _('Close') + '" href="#">X</a>' : '') + '<span>Title</span>'))).append($('<div/>').addClass('tip-content')));
            $('.tip-close').click(function(e) {
                $.Tip.hide();
                return false;
            });
        },
        end: 0
    };
})(jQuery);
var Player = {
    player: null,
    buffer: null,
    inspector: false,
    solution: 'html, flash',
    ready: false,
    isPlaying: false,
    prevVolume: 0.8,
    loadedAya: '',
    preloadedAya: '',
    preloadEnabled: !isMSafari,
    playList: [],
    currItem: {},
    delayID: null,
    hasBism: ['ajamy', 'parhizgar', 'fooladvand', 'makarem'],
    init: function() {
        var self = this;
        var swfPath = root + '/js/jquery/jplayer2';
        $('<div/>').attr('id', 'jplayer').appendTo('#jplayer-box').jPlayer({
            ready: function() {
                self.player = $(this);
                self.ready = true;
                $('#player-pad').fadeIn();
                $('#player-loading').hide();
                self.reset();
            },
            preload: 'none',
            volume: 1 * opt.volume,
            ended: function() {
                Player.proceed()
            },
            progress: function(e) {
                Player.progress(e)
            },
            volumechange: function() {
                opt.volume = Player.status('volume')
            },
            cssSelectorAncestor: '#player-pad',
            solution: self.solution,
            swfPath: swfPath
        });
        $('<div/>').attr('id', 'jbuffer').appendTo('#jplayer-box').jPlayer({
            ready: function() {
                self.buffer = $(this);
            },
            cssSelectorAncestor: '#jp_null',
            preload: 'auto',
            solution: self.solution,
            swfPath: swfPath
        });
        if (this.inspector && isTest)
            $.getScript(root + '/js/jquery/jplayer/jquery.jplayer.inspector.js', function() {
                $("#jplayer_inspector").jPlayerInspector({
                    jPlayer: $('#jplayer')
                });
            });
        $('.jp-volume-toggle').click(function() {
            self.prevVolume = self.status('volume');
            self.player.jPlayer('volume', 0);
            $(this).addClass('mute');
            $('.jp-volume-mute-pad').show();
        });
        $('.jp-volume-mute-pad').click(function() {
            self.player.jPlayer('volume', self.prevVolume);
            $('.jp-volume-toggle').removeClass('mute');
            $(this).hide();
        });
        $('.jp-volume-max').click(function() {
            self.player.jPlayer('volume', 1);
        });
    },
    status: function(id) {
        return this.player ? this.player.data('jPlayer').status[id] : null;
    },
    play: function() {
        this.player.jPlayer('play');
    },
    pause: function() {
        this.player.jPlayer('pause');
    },
    togglePlay: function() {
        if (!this.ready)
            return;
        if (!this.status('paused'))
            this.pause();
        else if (this.isPlaying)
            changeAya(+1, true);
        else
            this.play();
    },
    reset: function() {
        this.loadedAya = this.preloadedAya = '';
        this.loadAya();
    },
    loadAya: function() {
        if (!this.ready)
            return;
        if (this.loadedAya == curr.sura + ':' + curr.aya)
            return;
        this.loadedAya = curr.sura + ':' + curr.aya;
        clearTimeout(this.delayID);
        this.resetPlayList();
        this.load();
    },
    load: function() {
        this.currItem = this.playList.shift();
        if (this.buffer && this.preloadEnabled)
            this.buffer.jPlayer('clearMedia');
        var play = this.isPlaying || !this.status('paused');
        this.isPlaying = false;
        this.player.jPlayer('setMedia', {
            mp3: this.getUrl(this.currItem)
        });
        $('.jp-seek-bar').width('100%');
        if (play)
            this.play();
    },
    preload: function(item) {
        if (!this.buffer || !this.preloadEnabled || opt.playScope == 'aya')
            return;
        var certificate = item.sura + ':' + item.aya + ':' + item.reciter
        if (this.preloadedAya != certificate)
            this.buffer.jPlayer('setMedia', {
                mp3: this.getUrl(item)
            }).jPlayer('load');
        this.preloadedAya = certificate;
    },
    progress: function(e) {
        if (e.jPlayer.status.seekPercent == 100) {
            var next = Quran.getNextAya(this.currItem.sura, this.currItem.aya);
            if (next.sura != 115)
                this.preload($.extend(next, {
                    reciter: this.currItem.reciter
                }));
        }
    },
    proceed: function() {
        if (this.playList.length > 0) {
            this.load();
            this.play();
            return;
        }
        if (opt.playScope != 'cont') {
            var next = Quran.addOffset(curr.sura, curr.aya, +1, true);
            var stop = opt.playScope == 'aya' || opt.playScope == 'sura' && next.sura != curr.sura;
            stop = stop || opt.playScope == 'page' && Quran.getPage(next.sura, next.aya) != Quran.getPage(curr.sura, curr.aya);
            stop = stop || opt.playScope == 'juz' && Quran.getJuz(next.sura, next.aya) != Quran.getJuz(curr.sura, curr.aya);
            if (stop)
                return;
        }
        this.isPlaying = true;
        var playDuration = this.status('duration');
        var delay = (opt.playDelay == 'len') ? playDuration : opt.playDelay;
        clearTimeout(this.delayID);
        this.delayID = setTimeout('changeAya(+1, true)', delay * 1000);
    },
    getUrl: function(item) {
        fileName = $.pad(item.sura, 3) + $.pad(item.aya, 3) + '.mp3';
        var base = 'http://tanzil.net/res/audio/' + item.reciter + '/';
        if (reciteList[item.reciter].server == 'everyayah.com')
            base = 'http://www.everyayah.com/data/' + reciteList[item.reciter].base + '/';
        return base + fileName;
    },
    resetPlayList: function() {
        this.playList = [];
        for (var i in opt.reciters) {
            var reciter = opt.reciters[i];
            if (i == 0 && curr.aya == 1 && curr.sura != 1 && curr.sura != 9 && !this.bismIncluded(reciter.id))
                this.playList.push({
                    sura: curr.sura,
                    aya: 0,
                    reciter: reciter.id
                });
            for (var j = 0; j < reciter.num; j++)
                this.playList.push({
                    sura: curr.sura,
                    aya: curr.aya,
                    reciter: reciter.id
                });
        }
    },
    bismIncluded: function(reciter) {
        return $.isInArray(reciter, this.hasBism);
    },
    end: 0
};
