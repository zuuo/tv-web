var pkgId = GetQueryString("pkgId");
pkgId = 21700;
var pkgInfo = {};


getVodDetail();

function getVodDetail() {
    publicGetData({
        ServiceName: "GetVodDetail",
        pkg_id: pkgId,
    }, function(res) {
        if (res.retCode == 0) {
            pkgInfo = res;
            console.log(pkgInfo);


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

}