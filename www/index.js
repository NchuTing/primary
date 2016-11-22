var mySwiper = new Swiper('.swiper-container', {
	autoplay: 3000,
	speed: 1000,
	observer: true,
	autoplayDisableOnInteraction: false,
})

function work($scope, res) {
	console.log(">>>", res.data)
	var shuzu = [];
	for (var key in res.data) {
		shuzu.push(res.data[key]);
	}
	var suiji = [];
	var return_array = [];
	var first = Math.floor(Math.random() * shuzu.length);//得到一个0-shuzu.length的随机整数
	suiji.push(first);
	return_array[0] = shuzu[first];
	if (shuzu.length > 4) {
		for (var i = 1; i < 4; i++) {
			if (shuzu.length > 3) {
				var arrIndex = Math.floor(Math.random() * shuzu.length);//再得到一个0-shuzu.length的随机整数
				for (var j = 0; j < suiji.length; j++) {
					while (suiji[j] == arrIndex) {//遍历suiji数组里面的数，如果得到的随机数与其有一样的，则重新获取一个新的随机数
						arrIndex = Math.floor(Math.random() * shuzu.length);
						console.log("suiji", arrIndex)
						j = 0;//重新遍历suiji数组，并一一与重新获取的新的随机数进行比较
					}
				}
				suiji.push(arrIndex);
				return_array[i] = shuzu[arrIndex];
			} else {
				break;
			}
		}
	} else {

		return_array = shuzu;

	}
	console.log(">>>>>return_array", return_array);
	if (shuzu.length > 0) {
		var count;
		for (key in return_array) {
			if (return_array[key]["number"] == null) {
				return_array[key]["number"] = 0;
			}
		}
		console.log(return_array);
		$scope.indexWork1 = return_array;
	}
	return $scope.indexWork1;
}
var app = angular.module("app", []);
app.config(function ($controllerProvider) {
	app.controller = $controllerProvider.register;
});
app.run(function ($rootScope) {
	$rootScope.navurl = 'teacherPage/controller/nav.html';
	$rootScope.alerturl = 'teacherPage/controller/alert.html';

});
app.controller("kzq1", function ($scope, $rootScope) {
	$.get('/homework/api/getImg', function (res) {
		console.log('.....轮播', res);
		$scope.bgImg = res.data;
		$scope.$apply();
	})
	$.post("/homework/api/indexGetWork", function (res) {
		$scope.indexWork = work($scope, res);
		$scope.$apply();
		$scope.refrash = function () {
			if (res.data.length > 4) {
				$scope.indexWork = work($scope, res);
			} else {

				$rootScope.text = '仓库作业较少，暂不提供此功能'
					//				$scope.$apply();
				boxshow();
			}
		};
	});
});

app.controller("rolecontroller", function ($scope) {
	$.post('/../../start/api/getMyInfo', function (res) {
		console.log('>>>', res.data);
		if (res.text == '没找到您的登录信息，请重新登陆或注册.') {
			alert("没找到您的登录信息，请重新登陆或注册.");
			window.location.href = 'http://m.xmgc360.com/start/web/account/'
		}
		userid = res.data['id'];
		nick = res.data['nick'];
		dat = {
			userid: res.data['id'],
			nick: res.data['nick']
		}
		$scope.$apply(function () {
			$scope.name = nick;
		})
		console.log(">>>", dat);
		$.post('/homework/api/adduser', dat, function (res) {
			console.log(">>>>adduser", res);
			$.post('/homework/api/role', dat, function (res) {
				console.log(">>>>", res.data['name']);
				var role = res.data['name'];
				if (role) {
					if (role == '学生') {
						$('.tea').css({
							display: 'none'
						});
					} else if (role == '教师') {
						$('.stu').css({
							display: 'none'
						});
					} else if (role == "管理员" || role == "超级管理员") {} else {
						$('.tea,.stu').css({
							display: 'none'
						});
					}
				} else {
					$('.tea,.stu').css({
						display: 'none'
					});
				}
			});
		})

	});
	$scope.get = function () {
		var dat = {
			wid: $('#wid').val()
		}
		console.log(">>>>wid", dat);
		$.post('/homework/api/kuWorkDetail', dat, function (res) {
			console.log(">>>>>", res)
			if (res.code == 1) {
				setTimeout(function () {
					window.location.href = 'teacherPage/CWorkResDetail.html?wid=' + dat.wid;
				}, 300);
			}
			//	发布失败，显示错误信息
			else {
				$scope.$apply(function () {
					$scope.text = res.text
				});
				boxshow();
			}
		})

	}


});

$(function () {
	$("#giveUp").click(function () {
		$('#mainPage').fadeIn(100, function () {
			$("#searchPage").animate({
				left: "100%"
			}, function () {
				$('#searchPage').css({
					display: 'none',
					left: 0
				})
			});
		})
	});
	$('#search').click(function () {
		console.log("gaodu", window.screen.availHeight)
		$('#searchPage').fadeIn(function () {
			$('#mainPage').css({
				display: 'none'
			})
		})
	})
	$('#searchPage').css({
		minHeight: window.screen.availHeight
	})
})

app.controller("searchPageController", function ($scope) {
	$scope.search = function () {
		var text = $("#searchInput").val();
		//		setTimeout(console.log("sousuo:", text), 2000);
		var dat = {
			value: $("#searchInput").val()
		};
		$.get('/homework/api/search', dat, function (res) {
			console.log("返回值：", res.data.chat);
			var work = res.data.work;
			var chat = res.data.chat;
			if (work.length == 0 && chat.length == 0) {
				$("#noresult").show();
				$("#result").hide();
			} else if (work.length == 0) {
				$("#noresult").hide();
				$("#result").show();
				$("#work").hide();
				$("#chat").show();
				$scope.chatResult = chat;
			} else if (chat.length == 0) {
				$("#noresult").hide();
				$("#result").show();
				$("#work").show();
				$("#chat").hide();
				$scope.workResult = work;
			} else {
				$("#noresult").hide();
				$("#result").show();
				$("#work").show();
				$("#chat").show();
				$scope.workResult = work;
				$scope.chatResult = chat;
			}
			$scope.$apply();
		})
	}
})