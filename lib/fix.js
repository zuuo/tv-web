if (!String.prototype.repeat) {
    String.prototype.repeat = function(num) {
        var str = this;
        return (new Array(num + 1)).join(str);
    }
}

if (!window.console) {
    window.console = {
        log: function(msg) {
            alert("log:" + msg);
        },
        error: function(msg) {
            // alert("error: " + msg)
        }
    }
}