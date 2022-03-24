var pageLimit = 40;
var showLimit = 10;
var collectData = {
    queryPage: 0,
    list: [],
    maxCount: 1,
    showPage: 0,
};

var watchHistoryData = {
    queryPage: 0,
    list: [],
    maxCount: 1,
    showPage: 0,
};

// 初始默认读取一页
getCollect(true)
getWatchHistory()

function getCollect(isFirstLoad) {
    if (collectData.list.length >= collectData.maxCount) {
        return
    }
    publicGetData({
        // ServiceName: "GetBookmarkVods",
        // SearchFrom: pageLimit * collectData.queryPage + 1,
        // SearchTo: pageLimit * (collectData.queryPage + 1),

        ServiceName: "GetVodFromSLClass",
        SecondClass_id: 1,
        QueryFrom: pageLimit * collectData.queryPage + 1,
        QueryTo: pageLimit * (collectData.queryPage + 1),

    }, function(res) {
        if (res.retCode == 0) {
            collectData.queryPage++;
            collectData.list = collectData.list.concat(res.Packages);
            collectData.maxCount = res.ResultCount;

            if (isFirstLoad) {
                showCollectInPage()
            }
        } else {
            TVMain.onShowTips(res.retDesc)
        }
    })
}

function getWatchHistory() {
    publicGetData({
        // ServiceName: "GetWatchedVods",
        // SearchFrom: pageLimit * watchHistoryData.queryPage + 1,
        // SearchTo: pageLimit * (watchHistoryData.queryPage + 1),

        ServiceName: "GetVodFromSLClass",
        SecondClass_id: 2,
        QueryFrom: pageLimit * collectData.queryPage + 1,
        QueryTo: pageLimit * (collectData.queryPage + 1),
    }, function(res) {
        if (res.retCode == 0) {
            watchHistoryData.queryPage++;
            watchHistoryData.list = watchHistoryData.list.concat(res.Packages);
            watchHistoryData.maxCount = res.ResultCount;
        } else {
            TVMain.onShowTips(res.retDesc)
        }
    })
}

function showCollectInPage() {
    $("#tabContent .item").remove();
    var showList = collectData.list.slice(collectData.showPage * showLimit, (collectData.showPage + 1) * showLimit)
    $(showList).each(function(index, item) {
        var group = $("#tabContent .itemGroup").eq(Math.floor(index / 5))

        var vod = $('<div class="item"><img src=""><span class="name"></span></div>');
        vod.find("img").attr("src", item.pkg_logo);
        vod.find(".name").text(item.pkg_name);
        vod.data({
            url: "detail.html?pkg_id=" + item.pkg_id,
        })

        vod.appendTo(group);
    })

    $("#tabContent .itemGroup .item")
        .bind("cursorFocus", function() {

        })
    $("#tabContent .itemGroup:last .item")
        .attr("disableDown", true)
        .bind("keyDown", function() {
            getCollect()
            if (collectData.showPage * showLimit < collectData.list.length) {
                var columnIndex = $(this).parent().find(".item").index($(this));
                collectData.showPage++;
                showCollectInPage()
                var target = $("#tabContent .itemGroup:first .item").eq(columnIndex);
                if (target.length == 0) {
                    target = $("#tabContent .itemGroup:first .item").last();
                }
                keyControl.setCurItem(target);
            } else {
                keyControl.shakeItem()
            }
        })
    $("#tabContent .itemGroup:first .item")
        .attr("disableUP", true)
        .bind("keyUp", function() {
            if (collectData.showPage > 0) {
                var columnIndex = $(this).parent().find(".item").index($(this));
                collectData.showPage--;
                showCollectInPage()
                var target = $("#tabContent .itemGroup:last .item").eq(columnIndex);
                if (target.length == 0) {
                    target = $("#tabContent .itemGroup:last .item").last();
                }
                keyControl.setCurItem(target);
            } else {
                keyControl.setCurItem($(".tab.on"))
            }
        })
}

function showHistoryInPage() {
    $("#tabContent .item").remove();
    var showList = watchHistoryData.list.slice(watchHistoryData.showPage * showLimit, (watchHistoryData.showPage + 1) * showLimit)
    $(showList).each(function(index, item) {
        var group = $("#tabContent .itemGroup").eq(Math.floor(index / 5))

        var vod = $('<div class="item"><img src=""><span class="name"></span></div>');
        vod.find("img").attr("src", item.pkg_logo);
        vod.find(".name").text(item.pkg_name);
        vod.data({
            url: "detail.html?pkg_id=" + item.pkg_id,
        })

        vod.appendTo(group);
    })

    $("#tabContent .itemGroup .item")
        .bind("cursorFocus", function() {

        })
    $("#tabContent .itemGroup:last .item")
        .attr("disableDown", true)
        .bind("keyDown", function() {
            getWatchHistory()
            if (watchHistoryData.showPage * showLimit < watchHistoryData.list.length) {
                var columnIndex = $(this).parent().find(".item").index($(this));
                watchHistoryData.showPage++;
                showHistoryInPage()
                var target = $("#tabContent .itemGroup:first .item").eq(columnIndex);
                if (target.length == 0) {
                    target = $("#tabContent .itemGroup:first .item").last();
                }
                keyControl.setCurItem(target);
            } else {
                keyControl.shakeItem()
            }
        })
    $("#tabContent .itemGroup:first .item")
        .attr("disableUP", true)
        .bind("keyUp", function() {
            if (watchHistoryData.showPage > 0) {
                var columnIndex = $(this).parent().find(".item").index($(this));
                watchHistoryData.showPage--;
                showHistoryInPage()
                var target = $("#tabContent .itemGroup:last .item").eq(columnIndex);
                if (target.length == 0) {
                    target = $("#tabContent .itemGroup:last .item").last();
                }
                keyControl.setCurItem(target);
            } else {
                keyControl.setCurItem($(".tab.on"))
            }
        })
}

$("#collect")
    .attr("disableShake", true)
    .bind("cursorFocus", function() {
        collectData.showPage = 0
        showCollectInPage()
        $(".tab.on").removeClass("on")
        $(this).addClass("on");
    })

$("#history")
    .attr("disableShake", true)
    .bind("cursorFocus", function() {
        watchHistoryData.showPage = 0
        showHistoryInPage()
        $(".tab.on").removeClass("on")
        $(this).addClass("on");
    })
    .attr("disableDown", true)
    .bind("keyDown", function() {
        keyControl.setCurItem($("#tabContent .item:first"))
    })


keyControl.keyBack = function() {
    if (!$(".tab.on").hasClass("focus")) {
        keyControl.setCurItem($(".tab.on"))
    } else {
        window.history.back()
    }
}

keyControl.init($("#collect"))