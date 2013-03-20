define(function() {

    if (!Function.prototype.bind) {
        Function.prototype.bind = function(thisObj) {
            var fn = this,
                argsToBind = Array.prototype.slice.call(arguments, 1);
            return function() {
                var fnArgs = Array.prototype.concat.call(argsToBind,
                    Array.prototype.slice.call(arguments, 0));
                fn.apply(thisObj, fnArgs);
            };
        };
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj) {
            for (var i = 0; i < this.length; ++i)
                if (this[i] == obj)
                    return i;
            return -1;
        };
    }

    if (!window.console) {
        window.console = {
            error: function() { },
            log: function() { }
        };
    }

    var browserPrefix = null;
    var mappedBrowserProperties = ((function checkBrowserSupportedProperties(properties) {
        var style = window.getComputedStyle(document.body),
            pattern = /^-(webkit|moz|ms|o)-(.*)$/,
            result = {}, i, name;
        for (i = 0; i < style.length; ++i) {
            name = style[i];
            if (pattern.test(name)) {
                var match = name.match(pattern);
                result[match[2]] = name;
                if (!browserPrefix)
                    browserPrefix = match[1];
            }
        }
        if (browserPrefix) {
            for (i = 0; i < properties.length; ++i) {
                name = properties[i];
                result[name] = "-" + browserPrefix + "-" + name;
            }
        }
        return result;
    })(["transition"]));

    var UpperCasePrefixMap = {
        "webkit": "WebKit",
        "moz": "Moz",
        "ms": "Ms"
    };

    return {
        lookupPrefix: function(obj, name) {
            return obj[name] || obj[browserPrefix + _.string.capitalize(name)];
        },

        lookupUpperCasePrefix: function(obj, name) {
            return obj[name] || obj[UpperCasePrefixMap[browserPrefix] + name];
        },

        prefixValue: function(value) {
            return browserPrefix ? "-" + browserPrefix + "-" + value : value;
        },

        prefixOne: function(property) {
            var name = mappedBrowserProperties[property];
            return name ? name : property;
        },

        prefix: function(obj) {
            var newObj = {};
            $.each(obj, function(name, value) {
                newObj[Global.Utils.prefixOne(name)] = value;
            });
            return newObj;
        }
    };
});