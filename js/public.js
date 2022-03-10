// keyControl
var keyControl = {
    curItem: undefined,
    itemIndex: 0,
    lastItem: undefined,

    curItemGroup: undefined,
    groups: $(".itemGroup"),
    groupIndex: 0,

    keyLeft: function() {
        this.setCurItem(this.curItem.prevAll(".item").eq(0))
    },
    keyRight: function() {
        this.setCurItem(this.curItem.nextAll(".item").eq(0))
    },
    keyUp: function() {},
    keyDown: function() {
        var targetSize = this.groupIndex < this.groups.length ? this.groupIndex + 1 : this.groupIndex;
        var originIndex = this.itemIndex;
        var targetIndex = this.skipGroup(this.curItemGroup.length, targetSize, originIndex);
        console.log(targetIndex);
        this.setCurItem(this)
    },
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

        this.itemIndex = this.curItemGroup.find(".item").index(this.curItem);
        console.log(this.itemIndex);
    },
    setCurItemGroup(target) {
        this.curItemGroup = target || this.curItem.parents(".itemGroup")
    },
    setGroups() {
        this.groups = $(".itemGroup");
    },
    skipGroup(originSize, targetSize, originIndex) {
        console.log(originSize, targetSize, originIndex);
        let targetIndex = 0;
        let originSizeMid = originSize / 2;

        targetIndex = (targetSize / originSize) * originIndex;
        if (originSizeMid <= originIndex) {
            targetIndex = Math.ceil(targetIndex);
        } else {
            targetIndex = Math.floor(targetIndex);
        }

        if (targetIndex < 0) {
            targetIndex = 0;
        } else if (targetIndex > targetSize - 1) {
            targetIndex = targetSize - 1;
        }

        return targetIndex;
    },
    init() {
        this.setGroups();
        if (!this.curItem) {
            this.setCurItem(this.groups.eq(0).find(".item").eq(0));
        }
    },
}

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
    keyControl.init()
    console.log(keyControl);
});

// 绑定事件
$("#menu .item").bind("changeFocus", function(e) {
    $("#menu .item").each(function(item, index) {

    })
});