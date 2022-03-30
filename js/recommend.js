var carousel;
var recommendName = "recommend-0";

function recommendRenderFun() {
    if ($("#carousel").length > 0) {
        $("#carousel").hide();
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

        requestAnimationFrame(function() {
            $("#carousel").show();
            carousel.resizeFix()
        })

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
        getHotList()

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
                    })
                }
            })
        }

        function getHotList() {
            publicGetData({
                ServiceName: "getHotDegs",
            }, function(res) {
                if (res.retCode == 0) {

                } else {
                    TVMain.onShowTips(res.retDesc)
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
}