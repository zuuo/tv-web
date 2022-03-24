keyControl.init()

$("#keyboard .item")
    .attr("disableShake", true);

var searchData = {
    char: "",
    queryPage: 0,
    list: [],
    maxCount: 1,
    showPage: 0,
}

var hotList = [];

getHotList()

function getHotList() {
    publicGetData({
        ServiceName: "getHotDegs",
    }, function(res) {
        if (res.retCode == 0) {
            hotList = res.Packages;
        } else {
            TVMain.onShowTips(res.retDesc)
        }
    })
}

function setHotList() {

}