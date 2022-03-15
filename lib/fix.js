if (!String.prototype.repeat) {
    String.prototype.repeat = function(num) {
        var str = this;
        return (new Array(num + 1)).join(str);
    }
}