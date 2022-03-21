var limit = 40;
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
                    vod_num: 0,
                    vod_count: 40,
                    vod_max_num: 1,
                    secondClass_name: '全部'
                })
                $(second_class).each(function(index, classEd) {
                    classEd.vod_num = 0;
                    classEd.vod_count = 40;
                    classEd.vod_max_num = 1;
                })
                item.data("classData", {
                    class_id: cla.class_id,
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
            secondClassSwiper.swipeTo(0);
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
        $(newSlide).find("span").data(cla)
        newSlide.append();
    })

    $("#secondClass .item")
        .attr("disableShake", true)
        .bind("cursorFocus", function() {
            if ($(this).hasClass("on")) {
                return
            }
            $("#secondClass .item").removeClass("on")
            $(this).addClass("on");
            $(this).find("span").data("vod_num", 0)
            $("#vodList").empty();
            loadItemsPage($(this).find("span").data(), $(this).find("span"))
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
        .trigger("cursorFocus")
}

function loadItemsPage(classData, el) {
    var data = {};
    if (classData.vod_num >= classData.vod_max_num) {
        return
    }
    if (classData.level == 1) {
        data = {
            ServiceName: "GetVodFromFLClass",
            BInclueSLClass: 1, // 是否包括二级分类下的vod,0-不包括,1-包括
            BAllowPkgRepeat: 1, // 是否允许包组id重复,0-允许,1-不允许
            Class_id: classData.class_id,
            QueryFrom: classData.vod_num + 1,
            QueryTo: classData.vod_num + limit,
        }
    } else {
        data = {
            ServiceName: "GetVodFromSLClass",
            SecondClass_id: classData.secondClass_id,
            QueryFrom: classData.vod_num + 1,
            QueryTo: classData.vod_num + limit
        }
    }

    publicGetData(data, function(res) {
        if (res.retCode == 0) {
            setVod(res.Packages)
            el.data("vod_num", classData.vod_num + limit)
            el.data("vod_max_num", res.ResultCount)
        } else {}
    })
}

function setVod(packages) {
    $(packages).each(function(index, pkg) {
        var group = $("#vodList").find(".itemGroup").last();
        group.find(".placeholder").remove();
        if (group.length <= 0 || group.find(".item").length >= 4) {
            group = $('<div class="itemGroup"></div>');
            group.appendTo("#vodList");
        }
        var itemDom = $('<div class="item"><img src=""><span class="name"></span></div>');
        itemDom.find("img").attr("src", pkg.pkg_logo);
        itemDom.find(".name").text(pkg.pkg_name);
        itemDom.appendTo(group);
        $(itemDom)
            .bind("cursorFocus", function() {
                // console.log(pkg);
            });
    })
    keyControl.init();
    $("#vodList .itemGroup").eq(0).find(".item")
        .bind("keyUp", function() {
            keyControl.setCurItem($("#secondClass .item.on"))
        });

    $("#vodList .itemGroup")
        .find(".item:first")
        .off("keyLeft")
        .bind("keyLeft", function() {
            keyControl.setCurItem($("#left .item.on"))
        });

    $("#vodList .item")
        .bind("keyDown", function() {
            if (keyControl.groupIndex > keyControl.groups.length - 1 - 2) {
                loadItemsPage($("#secondClass .item.on span").data(), $("#secondClass .item.on span"))
            }
        })
}