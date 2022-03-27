keyControl.init()

$("#keyboard .item")
    .attr("disableShake", true);

var searchData = {
    chars: "",
    queryPage: 0,
    pageLimit: 18,
    list: [],
    maxCount: 1,
    showPage: 0,
    showLimit: 9,
}

var hotList = [];

bindKeyboardEvent()
getHotList()

function bindKeyboardEvent() {
    $("#keyboard .itemGroup").find(".item:last")
        .attr("disableRIght", true)
        .bind("keyRight", function() {
            keyControl.setCurItem($("#searchContent .item").first())
        })

    $("#chars").bind("keyEnter", function() {
        searchData.chars = searchData.chars.slice(0, -1);
        $("#chars").text(searchData.chars);

        if (searchData.chars.length == 0) {
            $("#charsPlaceholder").show()
            showHotList();
        } else {
            $("#charsPlaceholder").hide()
            newSearch();
        }
    })

    $("#keys .key").bind("keyEnter", function() {
        searchData.chars += $(this).text()
        $("#chars").text(searchData.chars);
        $("#charsPlaceholder").hide()
        newSearch();
    })

    $("#clear").bind("keyEnter", function() {
        searchData.chars = "";
        $("#chars").text(searchData.chars);
        $("#charsPlaceholder").show()
        showHotList();
    })

    $("#submit").bind("keyEnter", function() {
        newSearch();
    })
}

function bindSearchListEvent() {
    $("#searchContent .itemGroup").find(".item:first")
        .attr("disableLeft", true)
        .bind("keyLeft", function() {
            keyControl.setCurItem($("#chars.item"))
        })

    $("#searchContent .itemGroup:first .item").attr("disableUp", true)
}

function getHotList() {
    publicGetData({
        ServiceName: "getHotDegs",
    }, function(res) {
        if (res.retCode == 0) {
            hotList = res.Packages;
            showHotList()
        } else {
            TVMain.onShowTips(res.retDesc)
        }
    })
}

function showHotList() {
    $("#searchContent .item").remove();
    $(hotList).each(function(index, pkg) {
        var group = $("#searchContent .itemGroup").eq(Math.floor(index / 3))

        var item = $('<div class="item"><img src=""><span class="name"></span></div>');
        item.find("img").attr("src", pkg.pkg_logo);
        item.find(".name").text(pkg.pkg_name);
        item.data({
            url: "detail.html?pkg_id=" + pkg.pkg_id,
        })

        item.appendTo(group);
    })

    bindSearchListEvent()
}

function newSearch() {
    searchData.list = [];
    searchData.queryPage = 0;
    searchData.showPage = 0;
    searchData.maxCount = 1;
    getSearchDataInPage(true)
}

function getSearchDataInPage(isNewSearch) {
    if (searchData.list.length >= searchData.maxCount) {
        return
    }
    publicGetData({
        ServiceName: "SearchVods",
        chars: searchData.chars || "",
        SearchFrom: searchData.pageLimit * searchData.queryPage + 1,
        SearchTo: searchData.pageLimit * (searchData.queryPage + 1),
    }, function(res) {
        if (res.retCode == 0) {
            searchData.list = searchData.list.concat(res.Packages);
            console.log(searchData.list.length);
            searchData.queryPage++;
            // searchData.maxCount = res.ResultCount;
            searchData.maxCount = 36;

            if (isNewSearch) {
                showSearchInPage()
            }
        } else {
            TVMain.onShowTips(res.retDesc)
        }
    })
}

function showSearchInPage() {
    var showList = searchData.list.slice(searchData.showPage * searchData.showLimit, (searchData.showPage + 1) * searchData.showLimit)
    if (showList.length) {
        $("#searchContent .item").remove();
    } else {
        keyControl.shakeItem()
        return false
    }
    $(showList).each(function(index, item) {
        var group = $("#searchContent .itemGroup").eq(Math.floor(index / 3))

        var vod = $('<div class="item"><img src=""><span class="name"></span></div>');
        vod.find("img").attr("src", item.pkg_logo);
        vod.find(".name").text(item.pkg_name);
        vod.data({
            url: "detail.html?pkg_id=" + item.pkg_id,
        })

        vod.appendTo(group);
    })
    bindSearchListEvent()
    $("#searchContent .itemGroup:last .item")
        .attr("disableDown", true)
        .bind("keyDown", function() {
            getSearchDataInPage()
            if (searchData.showPage * searchData.showLimit < searchData.list.length) {
                var columnIndex = $(this).parent().find(".item").index($(this));
                searchData.showPage++;
                var hsaNextPage = showSearchInPage();
                if (hsaNextPage) {
                    var target = $("#searchContent .itemGroup:first .item").eq(columnIndex);
                    if (target.length == 0) {
                        target = $("#searchContent .itemGroup:first .item").last();
                    }
                    keyControl.setCurItem(target);
                } else {
                    searchData.showPage--;
                }
            } else {
                keyControl.shakeItem()
            }
        })
    $("#searchContent .itemGroup:first .item")
        .attr("disableUP", true)
        .bind("keyUp", function() {
            if (searchData.showPage > 0) {
                var columnIndex = $(this).parent().find(".item").index($(this));
                searchData.showPage--;
                var hsaNextPage = showSearchInPage()
                if (hsaNextPage) {
                    var target = $("#searchContent .itemGroup:last .item").eq(columnIndex);
                    if (target.length == 0) {
                        target = $("#searchContent .itemGroup:last .item").last();
                    }
                    keyControl.setCurItem(target);
                }
            } else {
                keyControl.shakeItem()
            }
        })
    return true
}