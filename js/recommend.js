var carousel;

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

}