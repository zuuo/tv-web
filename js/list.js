var firstClassId = 0;
var secondClassSwiper = new Swiper("#secondClass", {
    autoplay: false,
    direction: "horizontal",
    loop: false,
    slidesPerView: 6,
})

getClassList();

function getClassList() {
    publicGetData({
        ServiceName: "GetVodClass",
        epg_id: 20,
    }, function(res) {
        if (res.retCode == 0) {
            $("#left .list").not(":first").remove();
            $(res.classes).each(function(index, cla) {
                var temp = $('<div class="list"><div class="item">' + cla.class_name + '</div></div>');
                temp.appendTo("#left");
                var item = temp.find(".item");
                var second_class = cla.children || [];
                second_class.unshift({
                    level: 1,
                    class_id: cla.class_id,
                    vod_num: 1,
                    vod_count: 40,
                    secondClass_name: '全部'
                })
                item.data("classData", {
                    class_id: cla.class_id,
                    vod_num: 1,
                    vod_count: 40,
                    second_class: second_class,
                })
            })

            bindClassListEvent()
        } else {
            TVMain.onToast("查询失败")
        }
    })
}

function bindClassListEvent() {
    $("#left .list .item")
        .attr("customJump", true)
        .attr("disableShake", true)
        .bind("cursorFocus", function() {
            if (!$(this).hasClass("toSearch")) {
                $("#left .item").removeClass("on")
                $(this).addClass("on")
                setSecondClass()
            }
        })
        .bind("keyRight", function() {
            keyControl.setCurItem($("#secondClass .item").eq(0))
        })
        .bind("keyUp", function() {
            keyControl.setCurItem($(this).parent().prev().find(".item"))
        })
        .bind("keyDown", function() {
            keyControl.setCurItem($(this).parent().next().find(".item"))
        })

    keyControl.init()
    keyControl.setCurItem($("#left .list .item").eq(1));
}

function setSecondClass() {
    var firstClassData = $("#left .item.on").data("classData");
    if (firstClassId == firstClassData.class_id) {
        return
    }
    firstClassId = firstClassData.class_id;
    secondClassSwiper.removeAllSlides()
    $(firstClassData.second_class).each(function(index, cla) {
        var slideContent = "<span>" + cla.secondClass_name + "</span>";
        var newSlide = secondClassSwiper.createSlide(slideContent, 'swiper-slide item', 'div');
        newSlide.append();
    })

    $("#secondClass .item")
        .attr("disableShake", true)
        .bind("cursorFocus", function() {
            $("#secondClass .item").removeClass("on")
            $(this).addClass("on")
        })
        .bind("keyLeft", function() {
            secondClassSwiper.swipePrev()
        })
        .bind("keyRight", function() {
            secondClassSwiper.swipeNext()
        })

    $("#secondClass .item").eq(0)
        .off("keyLeft")
        .bind("keyLeft", function() {
            keyControl.setCurItem($("#left .item.on"))
        })
}