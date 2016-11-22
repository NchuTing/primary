console.log(">>>>>>>>>>>I am working")
app.run(function ($rootScope) {
    $rootScope.navurl = 'controller/nav.html';
    $rootScope.alerturl = 'controller/alert.html';
    $.post('/../../start/api/getMyInfo', function (res) {
        if (res.text == '没找到您的登录信息，请重新登陆或注册.') {
            alert("没找到您的登录信息，请重新登陆或注册.");
            window.location.href = 'http://m.xmgc360.com/start/web/account/'
        }
    })

});
app.controller("kzq", function ($scope) {
    $.get("/homework/api/getNotice", function (res) {
        console.log(">>>>>>Res", res);
        $scope.$apply(function () {
            $scope.filteredNotes = [], $scope.currentPage = 1, $scope.numPerPage = 20, $scope.maxSize = 3;
            $scope.notice = res.data;
            $scope.length = Math.ceil(res.data.length / $scope.numPerPage) + "0";
            console.log($scope.length);
            $scope.$watch('currentPage + numPerPage', function () {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage),
                    end = begin + $scope.numPerPage;
                $scope.filteredNotes = $scope.notice.slice(begin, end);

            });
            $scope.delete = function (nid) {
                var dat = {
                    nid: nid
                }
                console.log('>>>>>', dat)
                var a = confirm("您确定要删除吗？");

                if (a) {
                    var a = $scope.filteredNotes.splice(0, 1);
                    $.post("/homework/api/delete", dat, function (res) {
                        console.log(res)
                    });
                };
            }

        })
    })
})