var pkgId = GetQueryString("pkgId");
pkgId = 22366;
var pkgInfo = {};
var episodeData = [];
var episodePageSize = 10;
var activeGroupIndex = 0;

var episodeGroupSwiper = new Swiper('#episodeGroup', {
    slidesPerView: 5,
});

$("#chargeFlag")
    .bind("keyEnter", function() {
        if ($(this).hasClass("unpaid")) {
            $("#chargeFlag").removeClass("unpaid").addClass("paid");
        }
    })

$("#collect")
    .bind("keyEnter", function() {
        $("#collect").toggleClass("collected");
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

    if (pkgInfo.pkg_assetcount) {
        $("#assetCount").text("全" + pkgInfo.pkg_assetcount + "集");
        $("#lastAsset").text(pkgInfo.pkg_assetcount == pkgInfo.pkg_assetidx_latest ? "已完结" : "已更新" + pkgInfo.pkg_assetidx_latest + "集");
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
            $("#episodeGroup .item").removeClass("on")
            $(this).addClass("on")
            var groupIndex = $("#episodeGroup .item").index($(this))
            $("#episode .group").hide().eq(groupIndex).show()
            episodeGroupSwiper.swipeTo(groupIndex)
            keyControl.setCurItem($("#episodeGroup .item").eq(episodeGroupSwiper.activeIndex))
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
        .bind("keyLeft", function() {

        })
        .bind("keyRight", function() {})

    keyControl.init($("#chargeFlag"))
}