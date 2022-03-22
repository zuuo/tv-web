keyControl.init($("#menu .item").eq(0))

var navSwiper = new Swiper('#menuWrap', {
    initialSlide: 0,
    direction: "horizontal",
    loop: false,
    slidesPerView: 8,
});


// 绑定事件
$("#menu .item")
    .bind("cursorFocus", function(e) {
        var menuIndex = $("#menu .item").index($(this));
        console.log(Math.abs(menuIndex, navSwiper.activeIndex));
        navSwiper.swipeTo(menuIndex)
    })
    .bind("keyEnter", function(e) {
        $("#menu .item").removeClass("active")
        $(this).addClass("active");
        $("#recommend").load("/snippet/recommend" + $(".menu.active").data("recommend") + ".html", function() {
            keyControl.setGroups()
            keyControl.renderRandomImg()
            if (recommendRenderFun) {
                recommendRenderFun()
            }
        });
    });

if ($("#menu .menu.active").length == 0) {
    $("#menu .menu").eq(0).trigger("keyEnter")
}