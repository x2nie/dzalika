(function($) {
    $.fn.isChecked = function() {
        return $(this).is(':checked');
    };
    $.fn.toggleCheck = function(swtch) {
        return $(this).attr('checked', swtch ? 'checked' : '');
    };
    $.isInArray = function(aValue, anArray) {
        return $.inArray(aValue, anArray) >= 0;
    };
    $.pad = function(number, length) {
        var str = '' + number;
        while (str.length < length)
            str = '0' + str;
        return str;
    };
    $.clone = function(object) {
        return $.extend(true, {}, object);
    };
    $.Radio = {
        val: function(name, val) {
            if (isSet(val))
                return $('input[name=' + name + '][value=' + val + ']').attr('checked', 'checked');
            else
                return $('input[name=' + name + ']:checked').val();
        }
    };
    var imagesCache = [];
    $.preloadImages = function() {
        for (var i = arguments.length; i--;) {
            var cacheImage = document.createElement('img');
            cacheImage.src = arguments[i];
            imagesCache.push(cacheImage);
        }
    };
    $.extend($.fn.disableTextSelect = function() {
        return this.each(function() {
            if ($.browser.mozilla) {
                $(this).css('MozUserSelect', 'none');
            } else if ($.browser.msie) {
                $(this).bind('selectstart', function() {
                    return false;
                });
            } else {
                $(this).mousedown(function() {
                    return false;
                });
            }
        });
    });
})(jQuery);