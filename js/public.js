var deviceInfo = {
    userID: "13966651582yst001",
    userToken: "9BbnVxJ5VWFnEp8YJY9caOl142967693",
    mac: "2C:18:75:D3:0C:8E",
};

var baseData = getBaseData();

var userInfo;
login()

function getBaseData() {
    var baseData = {
        MsgId: "1",
        main_account: deviceInfo.userAccount,
        sub_account: deviceInfo.account,
        mac: deviceInfo.mac,
        version_code: "1"
    }

    return baseData
}

if (!window.TVMain) {
    TVMain = {
        onshowTips: function(msg) {
            alert(msg);
        },
        onToast: function(msg) {
            console.log(msg);
        },
    }
}

// keyControl

/** 
// ! curItem 当前光标
// ! customJump attr 自定义跳转,屏蔽公共跳转事件
// ! disableShake attr 禁用抖动
**/
var keyControl = {
    curItem: undefined,
    itemIndex: 0,
    lastItem: undefined,

    curItemGroup: undefined,
    groups: $(".itemGroup"),
    groupIndex: 0,

    init: function(firstItem) {
        this.setGroups();
        if (firstItem && firstItem.length) {
            this.setCurItem(firstItem)
        } else if (!this.curItem) {
            this.setCurItem(this.groups.eq(this.groupIndex).find(".item").eq(this.itemIndex));
        }
    },

    keyLeft: function() {
        if (this.curItem.attr("customJump")) {
            this.curItem.trigger("keyLeft")
            return
        }
        if (this.curItem.attr("disableLeft")) {
            this.curItem.trigger("keyLeft");
            return
        }
        this.curItem.trigger("keyLeft");
        var targetItem = this.curItem.prevAll(".item").eq(0);
        if (!targetItem.length) {
            this.beforeShakeItem("horizontal");
            return
        }
        this.setCurItem(targetItem)
    },
    keyRight: function() {
        if (this.curItem.attr("customJump")) {
            this.curItem.trigger("keyRight")
            return
        }
        if (this.curItem.attr("disableRight")) {
            this.curItem.trigger("keyRight");
            return
        }
        this.curItem.trigger("keyRight");
        var targetItem = this.curItem.nextAll(".item").eq(0);
        if (!targetItem.length) {
            this.beforeShakeItem("horizontal");
            return
        }
        this.setCurItem(targetItem)
    },
    keyUp: function() {
        if (this.curItem.attr("customJump")) {
            this.curItem.trigger("keyUp")
            return
        }
        if (this.curItem.attr("disableUp")) {
            this.curItem.trigger("keyUp");
            return
        }
        this.curItem.trigger("keyUp");
        var originSize = this.curItemGroup.find(".item").length;
        this.groupIndex = this.groupIndex - 1;
        if (this.groupIndex < 0) {
            this.groupIndex = 0;
            this.beforeShakeItem("vertical");
            return
        }
        var targetGroup = this.groups.eq(this.groupIndex);
        var targetSize = targetGroup.find(".item").length;
        var originIndex = this.itemIndex;
        var targetIndex = this.jumpGroup(originSize, targetSize, originIndex);
        var targetItem = targetGroup.find(".item").eq(targetIndex);
        if (targetItem.hasClass("menu") && $("#menu .menu.active").length) {
            targetItem = $("#menu .menu.active")
        }
        this.setCurItem(targetItem);

    },
    keyDown: function() {
        if (this.curItem.attr("customJump")) {
            this.curItem.trigger("keyDown")
            return
        }
        if (this.curItem.attr("disableDown")) {
            this.curItem.trigger("keyDown");
            return
        }
        this.curItem.trigger("keyDown");
        var originSize = this.curItemGroup.find(".item").length;
        this.groupIndex = this.groupIndex + 1;
        if (this.groupIndex >= this.groups.length) {
            this.groupIndex = this.groups.length - 1;
            this.beforeShakeItem("vertical");
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
        if (this.curItem.data("url")) {
            window.location.href = this.curItem.data("url")
        }
    },
    keyBack: function() {
        var target = $(".menu.active");
        if (target.length) {
            this.setCurItem(target);
            $("#recommend").scrollTop(0)
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
        // 不同group之间跳转
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
        // 滚动到中间

        // 只有.wrapper中的元素才滚动
        var wrapper = this.curItem.parents(".wrapper");
        if (wrapper.length == 0) return
        var scrollAnchor = this.curItem.parents(".scrollAnchor");
        if (scrollAnchor.length == 0) {
            scrollAnchor = this.curItem.parents(".itemGroup")
        }
        // console.log(scrollAnchor);
        // scrollAnchor.scrollintoview({
        //     duration: 2500,
        //     direction: "vertical",
        //     complete: function() {
        //         console.log("scroll");
        //     }
        // });
        if (scrollAnchor.get(0).scrollIntoView) {
            scrollAnchor.get(0).scrollIntoView({
                behavior: "smooth",
                block: "center"
            })
        } else {
            // var anchorTop = scrollAnchor.offset().top;
            // var anchorHeight = scrollAnchor.outerHeight();
            // var topDistance = anchorTop + anchorHeight / 2;
            // wrapper.scrollTop(anchorTop);
        }
    },

    beforeShakeItem: function(direction) {
        // 抖动前置条件
        if (this.curItem.hasClass("menu") || this.curItem.attr("disableShake")) {
            return
        } else {
            this.shakeItem(direction)
        }
    },
    shakeItem: function(direction) {
        // 抖动
        var direction = direction || "horizontal";

        this.curItem.removeClass("horizontalShake verticalShake");
        requestAnimationFrame(function() {
            keyControl.curItem.addClass(direction + "Shake")
        });
    },

    renderRandomImg: function() {
        // 给随机图片
        $("#carousel .swiper-slide").each(function(index, item) {
            var imgUrl = "/images/380x180/" + (index + 1) + ".jpg"
            $(item).html('<img src="' + imgUrl + '">');
            $(item).data("vodId", index + 1)
        })

        $(".row-2 .item").each(function(index, item) {
            var imgUrl = "/images/280x150/" + (index + 1) + ".jpg"
            $(item).html('<img src="' + imgUrl + '">');
            $(item).data("vodId", index + 1)
        })

        $(".row-3 .item").each(function(index, item) {
            var imgUrl = "/images/380x180/" + (index + 1) + ".jpg"
            $(item).html('<img src="' + imgUrl + '">');
            $(item).data("vodId", index + 1)
        })

        $(".row-4 .item").each(function(index, item) {
            var imgUrl = "/images/380x180/" + (index + 1) + ".jpg"
            $(item).html('<img src="' + imgUrl + '">');
            $(item).data("vodId", index + 1)
        })

        $(".row-5 .item").each(function(index, item) {
            var imgUrl = "/images/280x150/" + (index + 1) + ".jpg"
            $(item).html('<img src="' + imgUrl + '">');
            $(item).data("vodId", index + 1)
        })

        $(".row-6 .item").each(function(index, item) {
            var imgUrl = "/images/175x240/" + (index + 1) + ".jpg"
            $(item).html('<img src="' + imgUrl + '">');
            $(item).data("vodId", index + 1)
        })

        $(".row-first .item").each(function(index, item) {
            var imgUrl = "/images/175x240/" + (index + 1) + ".jpg"
            $(item).html('<img src="' + imgUrl + '">');
            $(item).data("vodId", index + 1)
        })
    }
}


$(document).on("keyup", function(e) {
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

function locationTo(url) {
    window.location.href = url;
}

function publicGetData(params, successFun, errorFun) {
    if (!params.ServiceName) {
        TVMain.onshowTips("未知查询方法");
        return
    }

    var successFun = successFun || function(res) {
        console.log(res);
    }

    var errorFunction = function(XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.readyState == 4) {
            try {
                TVMain.onToast(params.ServiceName + "查询失败");
            } catch (error) {
                alert(params.ServiceName + "查询失败");
            }
        }
        if (errorFun) {
            errorFun();
        }
    }

    for (key in baseData) {
        params[key] = baseData[key]
    }

    $.ajax({
        type: "post",
        url: "http://112.30.214.140:9004/epg/apk/forapk.json",
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        success: function(res) {
            successFun(res);
        },

        error: errorFunction,
    });
}

function login() {
    // 首次进入时登录
    userInfo = window.sessionStorage.getItem("userInfo")
    if (userInfo) {
        userInfo = JSON.parse(userInfo)
        return
    } else {
        // 调登录接口
        userInfo = {
            paid: true,
        }
        window.sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
}

function GetQueryString(name, url) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}