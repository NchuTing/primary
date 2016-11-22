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


function gotop() {
    $("html,body").animate({
        scrollTop: 0
    }, 500);
}

window.onscroll = function () {
    var t = document.documentElement.scrollTop || document.body.scrollTop;
    //        console.log(">>>>juli", t)
    if (t == 0) {
        $("#gotop").css({
            display: 'none'
        });
    } else {
        $("#gotop").css({
            display: 'block'
        });
    }
}

app.controller('notecontroller', function ($scope) {
    var counter = 0;
    // 每页展示4个
    var num = 8;
    var pageStart = 0,
        pageEnd = 0;
    var result = [];
    var result1 = [];
    $scope.note = result;
    $scope.note1 = result1;

    // dropload
    $('.content').dropload({
        scrollArea: window,
        loadUpFn: function (me) {

            var nid = $(".nid:first").html();
            console.log(">>>>nid", nid);
            $.ajax({
                type: 'GET',
                url: '/homework/api/getNotice',
                data: {
                    nid: nid
                },
                dataType: 'json',
                success: function (data) {
                    var style = "images/bj3.jpg";
                    for (var i = 0; i < data.data.length; i++) {
                        result1[i] = data.data[i];
                    }
                    // 为了测试，延迟1秒加载
                    setTimeout(function () {
                        $scope.$apply();
                        //                        $(result).insertBefore(".panel:first");
                        // 每次数据加载完，必须重置
                        me.resetload();
                        // 重置索引值，重新拼接more.json数据
                        // 解锁
                        me.unlock();
                        me.noData(false);
                    }, 1000);
                },
                error: function (xhr, type) {
                    alert('Ajax error!');
                    // 即使加载出错，也得重置
                    me.resetload();
                }
            });
        },

        loadDownFn: function (me) {
            $.ajax({
                type: 'GET',
                url: '/homework/api/getNotice',
                dataType: 'json',
                success: function (data) {
                    counter++;
                    pageEnd = num * counter;
                    pageStart = pageEnd - num;
                    if (data.data.length == 0) {
                        $("#none").css({
                            display: "block"
                        });
                    } else {
                        $("#none").css({
                            display: "none"
                        });
                    }
                    if (counter <= Math.ceil((data.data.length) / num)) {

                        for (var i = pageStart; i < pageEnd; i++) {
                            result[i] = data.data[i];

                            if ((i + 1) >= data.data.length) {
                                // 锁定
                                me.lock();
                                // 无数据
                                me.noData();
                                break;
                            }
                        }
                        console.log(">>>>>>$scope.note", $scope.note);

                    } else {
                        // 锁定
                        me.lock();
                        // 无数据
                        me.noData();
                    }
                    // 为了测试，延迟1秒加载
                    setTimeout(function () {
                        $scope.$apply();
                        // 每次数据加载完，必须重置
                        me.resetload();

                    }, 500);
                },
                error: function (xhr, type) {
                        alert('Ajax error!');
                        // 即使加载出错，也得重置
                        me.resetload();
                    }
                    //           
            });
        }
    });
});