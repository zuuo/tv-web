var carousel;
var recommendName = "recommend-0";

function recommendRenderFun() {
    if ($("#carousel").length > 0) {
        if (carousel) {
            carousel.destroy();
        }
        carousel = new Swiper('#carousel', {
            centeredSlides: true,
            autoplay: 5000,
            slidesPerView: 3,
            loop: true,
            //Enable 3D Flow
            tdFlow: {
                rotate: 30,
                stretch: 10,
                depth: 150,
                modifier: 1,
                shadows: true
            }
        });
        setTimeout(function() {
            carousel.resizeFix()
        }, 50);

        $("#carousel .item")
            .bind("keyLeft", function() {
                carousel.swipePrev()
            })
            .bind("keyRight", function() {
                carousel.swipeNext()
            })
            .bind("keyUp", function() {
                keyControl.setCurItem($("#menu .menu.active"));
            })
            .bind("keyDown", function() {
                keyControl.setCurItem($("#history .history").eq(0));
            })
            .off("keyEnter")
            .bind("keyEnter", function() {
                locationTo("/html/detail.html?id=1")
            })
            .bind("cursorFocus", function() {
                carousel.stopAutoplay();
            })
            .bind("cursorBlur", function() {
                carousel.startAutoplay();
            })
    }

    if ($("#historyRecord").length > 0) {
        getHistory();

        function getHistory() {
            publicGetData({
                ServiceName: "GetWatchedVods",
                SearchFrom: 1,
                SearchTo: 5
            }, function(res) {
                if (res.Packages.length > 0) {
                    $(res.Packages).each(function(index, pkg) {
                        if (index >= 3) {
                            return
                        }
                        var temp = $("#history .item").eq(index);
                        temp.data({
                            url: "detail.html?pkg_id=" + pkg.pkg_id + "&episodeId=" + pkg.vod_data_id
                        })
                        temp.find("span").eq(0).text(pkg.pkg_name);
                        temp.find("span").eq(1).text(`播放至${pkg.watch_rate}%`);
                    })
                }
            })
        }

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
                if ($("#carousel").length) {
                    keyControl.setCurItem($("#carousel .swiper-wrapper"));
                } else {
                    keyControl.setCurItem($("#menu .menu.active"));
                }
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
                if ($("#carousel").length) {
                    keyControl.setCurItem($("#carousel .swiper-wrapper"));
                } else {
                    keyControl.setCurItem($("#menu .menu.active"));
                }
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
                if ($("#carousel").length) {
                    keyControl.setCurItem($("#carousel .swiper-wrapper"));
                } else {
                    keyControl.setCurItem($("#menu .menu.active"));
                }
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

    $(".row .item").bind("keyEnter", function() {
        var vodId = $(this).data().vodId;
        console.log(vodId);
        if (vodId) {
            locationTo("/html/detail.html?id=" + vodId)
        }
    })

    getRecommendData();

}

function getRecommendData() {
    var recommendData = JSON.parse(window.localStorage.getItem(recommendName));
    var timeDuration = -1;
    if (recommendData) {
        timeDuration = new Date().getTime() - new Date(recommendData.getDataTime);
    }

    if (timeDuration < 1000 * 60 * 3 && timeDuration > 0) {
        setPageData(recommendData, true);
    } else {
        publicGetData({
            ServiceName: "getPageInfo",
            page_type: recommendName
        }, function(res) {
            res.getDataTime = new Date().getTime();
            window.localStorage.setItem(recommendName, JSON.stringify(res));
            setPageData(res, false);
        }, function() {

        });
    }
}

function setPageData(res, cacheData) {
    if (res.retCode == 0) {
        $(res.data).each(function(index, row) {
            if (row.isHidden === true) {
                $(row.element).remove();
                return true
            }
            $(row.element).find(".row_title").text(row.title || "");
            $(row.element).find(".item").has("img").each(function(itemIndex, item) {
                if (row.list[itemIndex]) {
                    $(item).data({
                        url: function() {
                            if (row.list[itemIndex].display_type == 0) {
                                return "detail.html?pkg_id=" + row.list[itemIndex].pkg_id
                            } else if (row.list[itemIndex].display_type == 1) {
                                return "special.html?subject_id=" + row.list[itemIndex].pkg_id
                            } else if (row.list[itemIndex].display_type == 2) {
                                return "special2.html?subject_id=" + row.list[itemIndex].pkg_id
                            } else {
                                return "detail.html?pkg_id=" + row.list[itemIndex].pkg_id
                            }
                        }()
                    })

                    $(item).find(".pkg_name").text(row.list[itemIndex].pkg_name);
                    if (index <= 3 || cacheData) {
                        $(item).find("img").each(function(index, thisImg) {
                            $(thisImg).attr("src", row.list[itemIndex].pkg_logo);
                        })
                    }
                    $(item).find("img").data("src", row.list[itemIndex].pkg_logo);
                }
            })
        })

        if (thisAnchor == "recommend-0") {
            $("#carousel .swiper-slide-duplicate").each(function(index, item) {
                $(item).data("url", $("#carousel .item").not(".swiper-slide-duplicate").eq(index).find("img").data("url"));

                $(item).find("img").data("src", $("#carousel .item").not(".swiper-slide-duplicate").eq(index).find("img").data("src"));
                loadImage($(item).find("img"), $("#carousel .item").not(".swiper-slide-duplicate").eq(index).find("img").data("src"), showImage);

                $(item).data({
                    url: $("#carousel .item").not(".swiper-slide-duplicate").data().url
                })
            })
        } else {
            firstItem = $(".item:first");
        }

        $(".item").not(".swiper-slide").css("transition", "200ms");

    } else {
        TVMain.onShowTips(res.retDesc);
    }
    setItemHeight();
}