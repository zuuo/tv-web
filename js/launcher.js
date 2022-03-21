keyControl.init($("#menu .item").eq(0))

// 绑定事件
$("#menu .item")
    .bind("cursorFocus", function(e) {
        var menuWidth = $("#menu .item").width();
        var menuIndex = $("#menu .item").index($(this));
        $("#menuWrap").scrollLeft(menuWidth * menuIndex);
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