// keyControl
var keyControl = {
    curItem: undefined,
    itemIndex: 0,
    lastItem: undefined,

    curItemGroup: undefined,
    groups: $(".itemGroup"),
    groupIndex: 0,

    init() {
        this.setGroups();
        if (!this.curItem) {
            this.setCurItem(this.groups.eq(0).find(".item").eq(0));
        }

        if ($("#menu .menu.active").length == 0) {
            $("#menu .menu").eq(0).trigger("keyEnter")
        }
    },

    keyLeft: function() {
        var targetItem = this.curItem.prevAll(".item").eq(0);
        if (!targetItem.length) {
            this.shakeItem("horizontal");
            return
        }
        this.setCurItem(targetItem)
    },
    keyRight: function() {
        var targetItem = this.curItem.nextAll(".item").eq(0);
        if (!targetItem.length) {
            this.shakeItem("horizontal");
            return
        }
        this.setCurItem(targetItem)
    },
    keyUp: function() {
        var originSize = this.curItemGroup.find(".item").length;
        this.groupIndex = this.groupIndex - 1;
        if (this.groupIndex < 0) {
            this.groupIndex = 0;
            this.shakeItem("vertical");
            return
        }
        var targetGroup = this.groups.eq(this.groupIndex);
        var targetSize = targetGroup.find(".item").length;
        var originIndex = this.itemIndex;
        var targetIndex = this.skipGroup(originSize, targetSize, originIndex);
        var targetItem = targetGroup.find(".item").eq(targetIndex);
        if (targetItem.hasClass("menu")) {
            targetItem = $("#menu .menu.active")
        }
        this.setCurItem(targetItem);
    },
    keyDown: function() {
        var originSize = this.curItemGroup.find(".item").length;
        this.groupIndex = this.groupIndex + 1;
        if (this.groupIndex >= this.groups.length) {
            this.groupIndex = this.groups.length - 1;
            this.shakeItem("vertical");
            return
        }

        var targetGroup = this.groups.eq(this.groupIndex);
        var targetSize = targetGroup.find(".item").length;
        var originIndex = this.itemIndex;
        var targetIndex = this.skipGroup(originSize, targetSize, originIndex);
        var targetItem = targetGroup.find(".item").eq(targetIndex);
        if (this.curItem.hasClass("menu")) {
            targetIndex = 0;
        }
        this.setCurItem(targetItem);
    },
    keyEnter: function() {
        this.curItem.trigger("keyEnter")
    },
    keyBack: function() {
        var target = $(".menu.active")
        this.setCurItem(target)
    },

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
        this.scrollWrapper()
    },
    setCurItemGroup(target) {
        this.curItemGroup = target || this.curItem.parents(".itemGroup")
        this.groupIndex = $(".itemGroup").index(this.curItemGroup)
    },
    setGroups() {
        this.groups = $(".itemGroup");
    },
    skipGroup(originSize, targetSize, originIndex) {
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

    scrollWrapper() {
        var wrapper = this.curItem.parents(".wrapper");
        if (wrapper.length == 0) return
        var curItemDom = this.curItem.get(0);
        var itemTop = this.curItem.offset()
        console.log(itemTop);
    },

    shakeItem(direction) {
        var direction = direction || "horizontal";
        if (!this.curItem.hasClass("menu")) {
            this.curItem.removeClass("horizontalShake");
            this.curItem.removeClass("verticalShake");
            setTimeout(function() {
                keyControl.curItem.addClass(direction + "Shake")
            });
        }
    },
    renderRandomImg() {
        $("#carousel .item").each(function(index, item) {
            var imgUrl = "/images/380x180/" + (index + 1) + ".jpg"
            $(item).html('<img src="' + imgUrl + '">');
        })

        $(".row-2 .item").each(function(index, item) {
            var imgUrl = "/images/280x150/" + (index + 1) + ".jpg"
            $(item).html('<img src="' + imgUrl + '">');
        })

        $(".row-3 .item").each(function(index, item) {
            var imgUrl = "/images/380x180/" + (index + 1) + ".jpg"
            $(item).html('<img src="' + imgUrl + '">');
        })

        $(".row-4 .item").each(function(index, item) {
            var imgUrl = "/images/380x180/" + (index + 1) + ".jpg"
            $(item).html('<img src="' + imgUrl + '">');
        })

        $(".row-5 .item").each(function(index, item) {
            var imgUrl = "/images/280x150/" + (index + 1) + ".jpg"
            $(item).html('<img src="' + imgUrl + '">');
        })

        $(".row-6 .item").each(function(index, item) {
            var imgUrl = "/images/175x240/" + (index + 1) + ".jpg"
            $(item).html('<img src="' + imgUrl + '">');
        })
    }
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
        case 8:
            console.log("back");
            keyControl.keyBack()
            break;
        default:
            break;
    }
})


// 绑定事件
$("#menu .item")
    .bind("changeFocus", function(e) {
        var menuWidth = $("#menu .item").width();
        var menuIndex = $("#menu .item").index($(this));
        $("#menuWrap").scrollLeft(menuWidth * menuIndex);
    })
    .bind("keyEnter", function(e) {
        $("#menu .item").removeClass("active")
        $(this).addClass("active");
        $("#recommend").load("/snippet/recommend" + $(".menu.active").data("recommend") + ".html", function() {
            keyControl.setGroups()
            keyControl.renderRandomImg()

            if ($("#carousel").length > 0) {
                carousel = new Swiper('#carousel', {
                    autoplay: {
                        delay: 5000,
                    },
                    speed: 300,
                    initialSlide: 0,
                    direction: "horizontal",
                    loop: true,
                    loopAdditionalSlides: 2,
                    loopedSlides: 5,
                    parallax: true,
                    effect: 'coverflow',
                    centeredSlides: true,
                    slidesPerView: 3,
                    updateOnImagesReady: true,
                    coverflowEffect: {
                        rotate: 20,
                        stretch: 18,
                        depth: 150,
                        modifier: 2,
                        slideShadows: true
                    },
                });
            }
        });
    });








keyControl.init()