var pkgId = GetQueryString("pkgId");
pkgId = 22532;
var pkgInfo = {};
var episodeData = [];
var episodePageSize = 10;
var activeGroupIndex = 0;

var episodeGroupSwiper = new Swiper('#episodeGroup', {
    slidesPerView: 5,
});

$("#chargeFlag")
    .attr("disableDown", true)
    .bind("keyEnter", function() {
        if ($(this).hasClass("unpaid")) {
            $("#chargeFlag").removeClass("unpaid").addClass("paid");
        }
    })
    .bind("keyDown", function() {
        var target = $("#episode .item.on")
        keyControl.setCurItem(target)
    })

$("#collect")
    .attr("disableDown", true)
    .bind("keyEnter", function() {
        if ($("#collect").hasClass("collected")) {
            publicGetData({
                ServiceName: "DelBookmark",
                pkg_id: pkgId,
            }, function(res) {
                if (res.retCode == 0) {
                    $("#collect").removeClass("collected");
                } else {
                    TVMain.onShowTips(res.retDesc);
                }
            });
        } else {
            publicGetData({
                ServiceName: "AddBookmark",
                pkg_id: pkgId,
            }, function(res) {
                if (res.retCode == 0) {
                    $("#collect").addClass("collected");
                } else {
                    TVMain.onShowTips(res.retDesc);
                }
            });
        }
    })
    .bind("keyDown", function() {
        var target = $("#episode .item.on")
        keyControl.setCurItem(target)
    })

getVodDetail();

function getVodDetail() {
    publicGetData({
        ServiceName: "GetVodDetail",
        pkg_id: pkgId,
    }, function(res) {
        if (res.retCode == 0) {
            pkgInfo = res;
            console.log(pkgInfo);

            setPkgDetail();
        } else {
            try {
                TVMain.onShowTips(res.retDesc);
            } catch (error) {
                alert(res.retDesc);
            }
        }
    });
}

function setPkgDetail() {
    $("#pkgName").text(pkgInfo.pkg_name);
    $("#score").text(pkgInfo.remark_score);
    if (pkgInfo.bcharging == 0) {
        $("#chargeFlag").addClass("free");
    } else {
        if (userInfo.paid) {
            $("#chargeFlag").addClass("paid");
        } else {
            $("#chargeFlag").addClass("unpaid");
        }
    }

    if (pkgInfo.pkg_bookmark == 1) {
        $("#collect").addClass("collected")
    } else {
        $("#collect").removeClass("collected")
    }

    if (pkgInfo.pkg_type == 3) {
        $("#assetCount").text("已更新至" + pkgInfo.pkg_assetidx_latest + "期");
    } else {
        if (pkgInfo.pkg_serialcount) {
            $("#assetCount").text("全" + pkgInfo.pkg_serialcount + "集");
            $("#lastAsset").text(pkgInfo.pkg_serialcount == pkgInfo.pkg_assetidx_latest ? "已完结" : "已更新" + pkgInfo.pkg_assetidx_latest + "集");
        }
    }

    if (pkgInfo.pkg_director) {
        $("#director").text("导演:" + pkgInfo.pkg_director);
    }

    if (pkgInfo.pkg_leader) {
        $("#leader").text("主演:" + pkgInfo.pkg_leader);
    }

    if (pkgInfo.pkg_introduce) {
        $("#introduce").text(function() {
            var str = '';
            if (pkgInfo.pkg_introduce.length > 85) {
                str = pkgInfo.pkg_introduce.slice(0, 85) + "..."
            } else {
                str = pkgInfo.pkg_introduce
            }

            return str
        }());
    }

    setEpisodeData()
}


function setEpisodeData() {
    episodeData = [];
    if (pkgInfo.pkg_type == 3) {
        episodePageSize = 5;
        $("#episode").addClass("page-5")
    }

    $(pkgInfo.pkg_assets).each(function(index, episode) {
        var group = episodeData[episodeData.length - 1];
        if (!group || group.episodes.length >= episodePageSize) {
            group = {
                text: (index + 1) + " ~ " + (index + episodePageSize),
                episodes: []
            }

            episodeData.push(group)
        }

        group.episodes.push(episode)
    })

    setEpisode()
}

function setEpisode() {
    episodeGroupSwiper.removeAllSlides()
    $(episodeData).each(function(groupIndex, group) {
        episodeGroupSwiper.appendSlide("<span>" + group.text + "</span>", "item swiper-slide ");

        var groupDom = $('<div class="group"></div>')
        $("#episode").append(groupDom)
        $(group.episodes).each(function(index, episode) {
            var episodeDom = $('<div class="item">' + episode.pkg_asset_idx + '</div>')
            episodeDom.appendTo(groupDom);
            episodeDom.data(episode);
            episodeDom.data("groupIndex", groupIndex);
        })
    })

    $("#episodeGroup .item")
        .attr("customJump", true)
        .bind("cursorFocus", function() {
            $("#episodeGroup .item.on").removeClass("on");
            $(this).addClass("on")
            var groupIndex = $("#episodeGroup .item").index($(this))
            $("#episode .group").hide().eq(groupIndex).show()
            episodeGroupSwiper.swipeTo(groupIndex)
        })
        .bind("keyUp", function() {
            var groupIndex = $("#episodeGroup .item").index($(this))
            var group = $("#episode .group").eq(groupIndex);
            var target = group.find(".item.on")
            if (target.length == 0) {
                target = group.find(".item").eq(0)
            }
            keyControl.setCurItem(target)
        })
        .bind("keyRight", function() {
            var target = keyControl.curItem.next();
            if (target.length > 0) {
                keyControl.setCurItem(target)
            } else(
                keyControl.shakeItem()
            )
        })
        .bind("keyLeft", function() {
            var target = keyControl.curItem.prev();
            if (target.length > 0) {
                keyControl.setCurItem(target)
            } else(
                keyControl.shakeItem()
            )
        })
        .bind("keyDown", function() {
            keyControl.setCurItem($("#relative .item"))
        })
        .eq(0).trigger("cursorFocus")

    $("#episode .item")
        .attr("customJump", true)
        .bind("cursorFocus", function() {
            $("#episode .item").removeClass("on")
            $(this).addClass("on")
        })
        .bind("keyDown", function() {
            keyControl.setCurItem($("#episodeGroup .item.on"))
        })
        .bind("keyUp", function() {
            keyControl.setCurItem($("#collect"))
        })
        .bind("keyRight", function() {
            var target = keyControl.curItem.next();
            if (target.length > 0) {
                keyControl.setCurItem(target)
            } else {
                var nextGroup = $("#episodeGroup .item.on").next()
                if (nextGroup.length > 0) {
                    nextGroup.trigger("cursorFocus");
                    keyControl.setCurItem($("#episode .group:visible .item").first())
                } else(
                    keyControl.shakeItem()
                )
            }
        })
        .bind("keyLeft", function() {
            var target = keyControl.curItem.prev();
            if (target.length > 0) {
                keyControl.setCurItem(target)
            } else {
                var nextGroup = $("#episodeGroup .item.on").prev()
                if (nextGroup.length > 0) {
                    nextGroup.trigger("cursorFocus");
                    keyControl.setCurItem($("#episode .group:visible .item").last())
                } else(
                    keyControl.shakeItem()
                )
            }
        })
        .bind("keyEnter", function() {
            // var contentID = $(this).data("program_code");
            var contentID = $(this).data("pkg_asset_id");
            var returnUrl = window.location.href;
            var playerUrl = EPGHost + "/MediaService/FullScreen?ContentID=" + contentID + "&ReturnURL=" + returnUrl;
            console.log(playerUrl);
        })

    setRelativePackages()
}

function setRelativePackages() {
    var relativeList = pkgInfo.RelativePackages
    console.log(relativeList);
    if (relativeList.length == 0) {
        $("#relative").hide()
    } else {
        $(relativeList).each(function(index, item) {
            if (index >= 5) {
                return false
            }
            var vod = $('<div class="item"><img src=""><span class="name"></span></div>');
            vod.find("img").attr("src", item.pkg_logo);
            vod.find(".name").text(item.pkg_name);
            vod.data({
                url: "detail.html?pkg_id=" + item.pkg_id,
            })

            vod.appendTo("#relative .itemGroup");
        })
    }

    $("#relative .item")
        .attr("disableUp", true)
        .bind("keyUp", function() {
            keyControl.setCurItem($("#episodeGroup .item.on"))
        })

    keyControl.init($("#episode .item").first())
}