var dateTimer = undefined;
var noticeTimer = undefined;

var noticeSwiper = undefined;
setCurTime();
getNotice();

function getCurTime() {
    return new Date(+new Date() + 8 * 3600 * 1000).toJSON().substr(0, 19).replace("T", " ");
}

function setCurTime() {
    $("#top .time").text(getCurTime())
    clearTimeout(dateTimer);
    dateTimer = setTimeout(function() {
        setCurTime()
    }, 1000);
}

function getNotice() {
    var notice = {
        text: "系统通知：芒果TV将在2022年3月19日24:00进行系统升级,届时可能出现访问失败,敬请谅解!",
        type: "text"
    }

    // var notice = {
    //     text: "推荐好剧 XXXX最新更新至地15集,点击查看",
    //     type: "vod",
    //     vodId: 1,
    // }

    var noticeText = $('<span class="noticeText"></span>');
    noticeText.text(notice.text)
    $("#notice").html(noticeText);
    $("#notice").append(noticeText.clone(true));

    scrollNotice()
}

function scrollNotice() {
    var wrapper = $("#notification");
    var content = $("#notice");
    var step = 500;
    var stepWidth = wrapper.width() / step;
    var curLeft = 0;
    content.css("left", curLeft)

    noticeTimer = setInterval(function() {
        curLeft += stepWidth;
        if (curLeft > content.width() / 2) {
            curLeft = 0;
            content.css("left", curLeft)
            content.find(".noticeText").eq(0).appendTo(content)
        } else {
            content.css("left", -curLeft)
        }
    }, 20)
}