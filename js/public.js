// keyControl
var keyControl = {
    curItem: undefined,
    curItemGroup: undefined,

    lastItem: undefined,

    keyLeft: function() {
        this.setCurItem(this.curItem.prevAll(".item").eq(0))
    },
    keyRight: function() {
        this.setCurItem(this.curItem.nextAll(".item").eq(0))
    },
    keyUp: function() {},
    keyDown: function() {},
    keyEnter: function() {},
    keyBack: function() {},

    setCurItem(target) {
        this.lastItem = this.curItem;
        this.curItem = target || $(".item.focus").eq(0);
        if (!this.curItem.length) {
            this.curItem = this.lastItem;
            return
        }

        if (this.lastItem) {
            this.lastItem.removeClass("focus");
        }
        this.curItem.addClass("focus");

        this.curItem.trigger("changeFocus")
        this.setCurItemGroup()
    },
    setCurItemGroup(target) {
        this.curItemGroup = target || this.curItem.parents(".itemGroup")
    },
}

keyControl.setCurItem($("#menu .item").eq(0));

$(window).on("keyup", function(e) {
    switch (e.keyCode) {
        case 37:
            keyControl.keyLeft()
            break;
        case 38:
            keyControl.keyUp()
            break;
        case 39:
            keyControl.keyRight()
            break;
        case 40:
            keyControl.keyDown()
            break;
        case 13:
            keyControl.keyEnter()
            break;
        case 27:
            keyControl.keyBack()
            break;
        default:
            break;
    }
})

$("#recommend").load("/snippet/recommend1.html", function() {

});

// 绑定事件
$("#menu .item").bind("changeFocus", function(e) {
    $("#menu .item").each(function(item, index) {

    })
});