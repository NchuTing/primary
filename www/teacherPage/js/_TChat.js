/**
 * Created by asus on 2016/10/13.
 */
/**
 * Created by asus on 2016/9/26.
 */
function checked(time) {
    if (time < 10) {
        time = '0' + time;
    }
    return time;
}

function newtime(dd) {
    var date = new Date(dd);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = checked(month);
    var day = date.getDate();
    day = checked(day);
    var hour = date.getHours();
    hour = checked(hour);
    var minute = date.getMinutes();
    minute = checked(minute);
    var second = date.getSeconds();
    second = checked(second);
    console.log(date);
    console.log(dd);
    dt = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    return dt;
}







app.controller('myCtrl1', function ($scope) {
    $.get('/api/openChat', function (res) {
        for (attr in res) {
            var dd = res[attr].creatdate;
            dt = newtime(dd);
            res[attr].creatdate = dt;
            var arry = ['background-color:rgba(0, 255, 78, 0.2)', 'background-color:rgba(255, 206, 114, 0.2)',
                'background-color:rgba(0,210,209, 0.2)', 'background-color:rgba(102,203,164, 0.2)',
                'background-color:rgba(249,89,177, 0.3)', 'background-color:rgba(144,200,65, 0.2)'];
            var index = Math.floor((Math.random() * arry.length));
            res[attr].bg = arry[index];
        }
        $(function () {
            var counter = 0; /*计数器*/
            var pageStart = 0; /*offset*/
            var pageSize = 12; /*size*/
            var isEnd = false; /*结束标志*/
            /*首次加载*/
            getData(pageStart, pageSize);


            function getData(offset, size) {
                var data = res;
                var sum = res.length;
                var result = '';
                if (sum - offset < size) {
                    size = sum - offset;
                }
                var temp = [];
                for (var i = 0; i < (offset + size); i++) {
                    temp.push(res[i]);
                }
                $scope.$apply(function () {
                    $scope.obj = temp;
                });
            }
            refresher.init({
                id: "wrapper",
                pullDownAction: Refresh,
                pullUpAction: Load
            });

            function Refresh() { //上拉要执行的代码
                setTimeout(function () {
                    counter = 0;
                    getData(0, pageSize);
                    $('.pullUpLabel').html('上拉加载更多')
                    wrapper.refresh();
                }, 1000)
            }

            function Load() { //下拉要加载的代码
                setTimeout(function () { // <-- Simulate network congestion, remove setTimeout from production!
                    counter++;
                    pageStart = counter * pageSize;
                    getData(pageStart, pageSize);
                    wrapper.refresh();
                    if ((pageStart + pageSize) >= res.length) {
                        $('.pullUpLabel').html('已经到底了')
                    }
                }, 1000);
            }
        });
    });

    $('#input').bind({
        focus: function () {
            $(this).val('');
        },
        blur: function () {
            if ($(this).val() == '') {
                $(this).val('写评论');
            }
        }
    });
    $scope.fabu = function () {
        var content = $('#input').val();
        var da = new Date();
        var day = newtime(da);
        dat1 = {
            content: content
        };
        if (content == '写评论') {
            alert('请输入内容！')
        } else {
            $.post('/api/ChatContent', dat1, function (res) {
                var arry = ['background-color:rgba(0, 255, 78, 0.2)', 'background-color:rgba(255, 206, 114, 0.2)',
                    'background-color:rgba(0,210,209, 0.2)', 'background-color:rgba(102,203,164, 0.2)',
                    'background-color:rgba(249,89,177, 0.3)', 'background-color:rgba(144,200,65, 0.2)'];
                var index = Math.floor((Math.random() * arry.length));
                if (res == 1) {
                    window.parent.boxshow('发布成功！'); //调用父窗口的方法
                    $('#input').val('写评论');
                    datt = {
                        content: content,
                        userid: '',
                        timbs: 0,
                        creatdate: day,
                        name: '沉吟莫沉吟',
                        bg: arry[index]
                    };
                    $scope.$apply(function () {
                        $scope.obj.splice(0, 0, datt);
                    })
                } else {
                    window.parent.boxshow('发布失败，请检查格式！');
                }
            })
        }
    };
    $scope.select = function () {
        var num = this.val.name;
        $('#myModal').attr('myAttr', num);
    };
    $scope.answer = function () {
        var modal1 = $("#myModal");
        modal1.modal('hide');
        var nick = modal1.attr('myAttr');
        $('#input').focus().val("@" + nick + ' ');
    };
    $scope.share = function () {
        var modal1 = $("#myModal");
        modal1.modal('hide');
        $('#myDiv').slideDown();
        $('#myDiv2').css({
            display: 'block'
        });
    };
    $scope.back = function () {
        $('#myDiv').slideUp();
        $('#myDiv2').css({
            display: 'none'
        });
    };



});