/**
 * Created by asus on 2016/10/26.
 */
var userid;

var content, content1;
$("input").focus(function () {
	content = $(this).val();
	$(this).val("");
}).blur(function () {
	content1 = $(this).val();
	if (content1 == "") {
		$(this).val(content);
	} else {
		$(this).val(content1);
	}
});
var userid;
var nick;



var app = angular.module("app", []);
app.config(function ($controllerProvider) {
	app.controller = $controllerProvider.register;
});
app.controller("info", function ($rootScope, $scope) {
	$rootScope.navurl = 'controller/nav.html';
	$rootScope.alerturl = 'controller/alert.html';
	$.post('/../../start/api/getMyInfo', function (res) {
		if (res.text == '没找到您的登录信息，请重新登陆或注册.') {
			alert("没找到您的登录信息，请重新登陆或注册.");
			window.location.href = 'http://m.xmgc360.com/start/web/account/'
		}
		userid = res.data['id'];
		$scope.userid = res.data['id'];
		$scope.nick = res.data['nick'];
		var dat = {
			userid: $scope.userid,
			nick: $scope.nick
		}
		$.post("/homework/api/setInfo", dat, function (res) {
			console.log("sex", res.data);
			if (res.data.user.sex == "women") {
				$("input[value='women']").attr("checked", "checked");
			}
			console.log(">>>>>Res", res.data.user);
			$scope.$apply(function () {
				$scope.info = res.data.user;

			});
			userid = res.data.user.userid;
		});

		$scope.save = function () {
			var dat = {
				userid: $scope.userid,
				sex: $("input:checked").val(),
				job: $("input:eq(2)").val(),
				autograph: $("input:eq(3)").val(),
				self: $("input:eq(4)").val(),
				company: $("input:eq(5)").val(),
				email: $("input:eq(6)").val()
			}
			console.log(">>>>dat", dat);
			var Reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			console.log("?>>>>", Reg.test(dat.email));
			if (!Reg.test(dat.email)) {
				$scope.text = "邮箱格式错误";
				boxshow();
			} else {

				$.post("/homework/api/userInfo", dat, function (res) {
					console.log("?>>>>", res);
					if (res.data.affectedRows == 1) {
						$scope.text = "保存成功！";
						$.post("/homework/api/setInfo", dat, function (res) {
							console.log("sex", res.data.user.sex);
							if (res.data.user.sex == "women") {
								$("input[value='women']").attr("checked", "checked");
							}
							console.log(">>>>>Res", res.data.user);
							$scope.$apply(function () {
								$scope.info = res.data.user;

							});
						});

						$scope.$apply();
						boxshow();
					} else {
						$scope.text = res.text
							//				});
						$scope.$apply();
						boxshow();
					}
				});
			}
		};
		$scope.reset = function () {
			$("input:gt(1)").val("");
			$("input:eq(0),input:eq(1)").removeAttr("checked");
			$("input:eq(0)").attr("checked", "checked");
		}
	});
});

function uploadpic() {
	_fns.uploadFile2(2, $('#myImg'), function (f) {
		console.log('>>>>before:', f);
	}, function (f) {

	}, function (f) {
		console.log('>>>>successXXXX:', f);
		var dat = {
			userid: userid,
			src: f.url
		}
		console.log(">>>>>>", dat);
		$.get('/homework/api/upUserimg', dat, function (res) {
			console.log("?????", res);
			$('#myImg').attr('src', dat.src);
		})
	});

}