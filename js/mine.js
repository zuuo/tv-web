var pageLimit = 40;
var showLimit = 10;
var searchData = {
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
    if (searchData.list.length >= searchData.maxCount) {
        return
    }
    publicGetData({
        // ServiceName: "GetBookmarkVods",
        // SearchFrom: pageLimit * collectData.queryPage + 1,
        // SearchTo: pageLimit * (collectData.queryPage + 1),

        ServiceName: "GetVodFromSLClass",
        SecondClass_id: 1,
        QueryFrom: pageLimit * searchData.queryPage + 1,
        QueryTo: pageLimit * (searchData.queryPage + 1),

    }, function(res) {
        if (res.retCode == 0) {
            searchData.queryPage++;
            searchData.list = searchData.list.concat(res.Packages);
            searchData.maxCount = res.ResultCount;

            if (isFirstLoad) {
                showSearchInPage()
            }
        } else {
            TVMain.onShowTips(res.retDesc)
        }
    })
}

function getWatchHistory() {
    if (watchHistoryData.list.length >= watchHistoryData.maxCount) {
        return
    }
    publicGetData({
        // ServiceName: "GetWatchedVods",
        // SearchFrom: pageLimit * watchHistoryData.queryPage + 1,
        // SearchTo: pageLimit * (watchHistoryData.queryPage + 1),

        ServiceName: "GetVodFromSLClass",
        SecondClass_id: 2,
        QueryFrom: pageLimit * watchHistoryData.queryPage + 1,
        QueryTo: pageLimit * (watchHistoryData.queryPage + 1),
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

function showSearchInPage() {
    var showList = searchData.list.slice(searchData.showPage * showLimit, (searchData.showPage + 1) * showLimit)
    if (showList.length) {
        $("#tabContent .item").remove();
    } else {
        return false
    }
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

    $("#tabContent .itemGroup:last .item")
        .attr("disableDown", true)
        .bind("keyDown", function() {
            getCollect()
            if (searchData.showPage * showLimit < searchData.list.length) {
                var columnIndex = $(this).parent().find(".item").index($(this));
                searchData.showPage++;
                var hsaNextPage = showSearchInPage()
                if (hsaNextPage) {
                    var target = $("#tabContent .itemGroup:first .item").eq(columnIndex);
                    if (target.length == 0) {
                        target = $("#tabContent .itemGroup:first .item").last();
                    }
                    keyControl.setCurItem(target);
                } else {
                    searchData.showPage--;
                }
            } else {
                keyControl.shakeItem()
            }
        })
    $("#tabContent .itemGroup:first .item")
        .attr("disableUP", true)
        .bind("keyUp", function() {
            if (searchData.showPage > 0) {
                var columnIndex = $(this).parent().find(".item").index($(this));
                searchData.showPage--;
                showSearchInPage()
                var target = $("#tabContent .itemGroup:last .item").eq(columnIndex);
                if (target.length == 0) {
                    target = $("#tabContent .itemGroup:last .item").last();
                }
                keyControl.setCurItem(target);
            } else {
                keyControl.setCurItem($(".tab.on"))
            }
        })
    return true
}

function showHistoryInPage() {
    var showList = watchHistoryData.list.slice(watchHistoryData.showPage * showLimit, (watchHistoryData.showPage + 1) * showLimit)
    if (showList.length) {
        $("#tabContent .item").remove();
    } else {
        keyControl.shakeItem()
        return false
    }
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

    $("#tabContent .itemGroup:last .item")
        .attr("disableDown", true)
        .bind("keyDown", function() {
            getWatchHistory()
            if (watchHistoryData.showPage * showLimit < watchHistoryData.list.length) {
                var columnIndex = $(this).parent().find(".item").index($(this));
                watchHistoryData.showPage++;
                var hsaNextPage = showHistoryInPage()
                if (hsaNextPage) {
                    var target = $("#tabContent .itemGroup:first .item").eq(columnIndex);
                    if (target.length == 0) {
                        target = $("#tabContent .itemGroup:first .item").last();
                    }
                    keyControl.setCurItem(target);
                } else {
                    watchHistoryData.showPage--;
                }
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
    return true
}

$("#collect")
    .attr("disableShake", true)
    .bind("cursorFocus", function() {
        searchData.showPage = 0
        showSearchInPage()
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