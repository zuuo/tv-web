// keyControl
var carousel;
var keyControl = {
    curItem: undefined,
    itemIndex: 0,
    lastItem: undefined,

    curItemGroup: undefined,
    groups: $(".itemGroup"),
    groupIndex: 0,

    init: function() {
        this.setGroups();
        if (!this.curItem) {
            this.setCurItem(this.groups.eq(this.groupIndex).find(".item").eq(this.itemIndex));
        }

        if ($("#menu .menu.active").length == 0) {
            $("#menu .menu").eq(0).trigger("keyEnter")
        }
    },

    keyLeft: function() {
        if (this.curItem.attr("customJump")) {
            this.curItem.trigger("keyLeft")
            return
        }
        this.curItem.trigger("keyLeft")
        var targetItem = this.curItem.prevAll(".item").eq(0);
        if (!targetItem.length) {
            this.shakeItem("horizontal");
            return
        }
        this.setCurItem(targetItem)
    },
    keyRight: function() {
        if (this.curItem.attr("customJump")) {
            this.curItem.trigger("keyRight")
            return
        }
        this.curItem.trigger("keyRight")
        var targetItem = this.curItem.nextAll(".item").eq(0);
        if (!targetItem.length) {
            this.shakeItem("horizontal");
            return
        }
        this.setCurItem(targetItem)
    },
    keyUp: function() {
        if (this.curItem.attr("customJump")) {
            this.curItem.trigger("keyUp")
            return
        }
        this.curItem.trigger("keyUp")
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
        var targetIndex = this.jumpGroup(originSize, targetSize, originIndex);
        var targetItem = targetGroup.find(".item").eq(targetIndex);
        if (targetItem.hasClass("menu")) {
            targetItem = $("#menu .menu.active")
        }
        this.setCurItem(targetItem);

    },
    keyDown: function() {
        if (this.curItem.attr("customJump")) {
            this.curItem.trigger("keyDown")
            return
        }
        this.curItem.trigger("keyDown")
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
        var targetIndex = this.jumpGroup(originSize, targetSize, originIndex);
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
        var target = $(".menu.active");
        if (target.length) {
            this.setCurItem(target)
        } else {
            window.history.back()
        }
    },

    setCurItem: function(target) {
        this.lastItem = this.curItem;
        this.curItem = target.eq(0) || $(".item.focus").eq(0);
        if (!this.curItem.length) {
            this.curItem = this.lastItem;
            return
        }

        if (this.lastItem) {
            this.lastItem.removeClass("focus");
            this.lastItem.trigger("cursorBlur")
        }
        this.curItem.addClass("focus");

        this.curItem.trigger("cursorFocus")
        this.setCurItemGroup()

        this.itemIndex = this.curItemGroup.find(".item").index(this.curItem);
        this.scrollWrapper()
    },
    setCurItemGroup: function(target) {
        this.curItemGroup = target || this.curItem.parents(".itemGroup")
        this.groupIndex = $(".itemGroup").index(this.curItemGroup)
    },
    setGroups: function() {
        this.groups = $(".itemGroup");
    },
    jumpGroup: function(originSize, targetSize, originIndex) {
        var targetIndex = 0;
        var originSizeMid = originSize / 2;

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

    scrollWrapper: function() {
        var wrapper = this.curItem.parents(".wrapper");
        if (wrapper.length == 0) return
        var scrollAnchor = this.curItem.parents(".scrollAnchor");
        if (scrollAnchor.length == 0) {
            scrollAnchor = this.curItem.parents(".itemGroup")
        }
        if (scrollAnchor.get(0).scrollIntoView) {
            scrollAnchor.get(0).scrollIntoView({
                behavior: "smooth",
                block: "center",
            })
        } else {
            console.log(scrollAnchor);
            var anchorTop = scrollAnchor.offset().top;
            console.log(anchorTop);
            var anchorHeight = scrollAnchor.outerHeight();
            var topDistance = anchorTop + anchorHeight / 2;
            wrapper.scrollTop(anchorTop);
            console.log(scrollAnchor.offset().top);
        }
    },

    shakeItem: function(direction) {
        var direction = direction || "horizontal";
        console.log(this.curItem.attr("disableShake"));
        if (this.curItem.hasClass("menu") || this.curItem.attr("disableShake")) {
            return
        }
        this.curItem.removeClass("horizontalShake verticalShake");
        setTimeout(function() {
            keyControl.curItem.addClass(direction + "Shake")
        });
    },
    renderRandomImg: function() {
        $("#carousel .swiper-slide").each(function(index, item) {
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

        $(".row-first .item").each(function(index, item) {
            var imgUrl = "/images/175x240/" + (index + 1) + ".jpg"
            $(item).html('<img src="' + imgUrl + '">');
        })
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
        case 8:
            keyControl.keyBack()
            break;
        default:
            break;
    }
})


// 绑定事件
$("#menu .item")
    .bind("cursorFocus", function(e) {
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
                if (carousel) {
                    carousel.destroy();
                }
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
                setTimeout(function() {
                    carousel.update()
                });

                $("#carousel .item")
                    .bind("keyLeft", function() {
                        carousel.slidePrev()
                    })
                    .bind("keyRight", function() {
                        carousel.slideNext()
                    })
                    .bind("keyUp", function() {
                        keyControl.setCurItem($("#menu .menu.active"));
                    })
                    .bind("keyDown", function() {
                        keyControl.setCurItem($("#history .history").eq(0));
                    })
                    .bind("keyEnter", function() {
                        locationTo("/html/detail.html?id=1")
                    })
                    .bind("cursorFocus", function() {
                        carousel.autoplay.stop();
                    })
                    .bind("cursorBlur", function() {
                        carousel.autoplay.start();
                    })
            }

            if ($("#historyRecord").length > 0) {
                $("#history .history")
                    .bind("keyRight", function() {
                        keyControl.setCurItem($("#search").eq(0));
                    })
                    .bind("keyDown", function() {
                        keyControl.setCurItem($(this).next(".history"));
                    })
                    .bind("keyUp", function() {
                        keyControl.setCurItem($(this).prev(".history"));
                    });

                $("#history .history").first().off("keyUp")
                    .bind("keyUp", function() {
                        keyControl.setCurItem($("#carousel .swiper-wrapper"));
                    })
                $("#history .history.all").off("keyDown")
                    .bind("keyDown", function() {
                        keyControl.setCurItem($("#item2-1"));
                    })

                $("#search").add("#list")
                    .bind("keyLeft", function() {
                        keyControl.setCurItem($("#history .history").first());
                    })
                    .bind("keyRight", function() {
                        keyControl.setCurItem($("#item1-1"));
                    });
                $("#search")
                    .bind("keyUp", function() {
                        keyControl.setCurItem($("#carousel .swiper-wrapper"));
                    })
                    .bind("keyDown", function() {
                        keyControl.setCurItem($("#list"));
                    })
                $("#list")
                    .bind("keyUp", function() {
                        keyControl.setCurItem($("#search"));
                    })
                    .bind("keyDown", function() {
                        keyControl.setCurItem($("#item2-1"));
                    })

                $("#item1-1")
                    .bind("keyUp", function() {
                        keyControl.setCurItem($("#carousel .swiper-wrapper"));
                    })
                    .bind("keyLeft", function() {
                        keyControl.setCurItem($("#search"));
                    })
                    .bind("keyRight", function() {
                        keyControl.setCurItem($(this).next(".item"));
                    })
                    .bind("keyDown", function() {
                        keyControl.setCurItem($("#item2-1"));
                    })
            }
        });
    });


function locationTo(url) {
    window.location.href = url;
}





keyControl.init()