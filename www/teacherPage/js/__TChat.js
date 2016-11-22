/**
 * Created by asus on 2016/10/13.
 */
app.controller('myCtrl1', function ($scope) {
    $.get('/api/openChat', function (res) {
        if(res.length==0){$('#none').show();}
        else{$('#none').hide()}
        var  result=res;
        var arry = ['background-color:rgba(0, 255, 78, 0.2)', 'background-color:rgba(255, 206, 114, 0.2)',
            'background-color:rgba(0,210,209, 0.2)', 'background-color:rgba(102,203,164, 0.2)',
            'background-color:rgba(249,89,177, 0.3)', 'background-color:rgba(144,200,65, 0.2)'];
        for (attr in result) {
            var index = Math.floor((Math.random() * arry.length));
            result[attr].bg = arry[index];
        }
        $scope.obj=[];
        var counter = 0;
      // 每页展示4个
        var num = 12;
        var pageStart = 0,
            pageEnd = 0;

        function timbsColor(e){
            for(var k=0;k<e.length;k++){
                var str=e[k].timbstr;
                var indexNum=str.indexOf(15+',');
                if(indexNum!=(-1)){
                    $('.'+e[k].chatid).addClass('blue');
                }
            }
        }
        $('#gotop').click(function(){
            $("html,body").animate({
                scrollTop: 0
            }, 500);
        });

        window.onscroll = function () {
            var t = document.documentElement.scrollTop || document.body.scrollTop;
            if (t == 0) {
                $("#gotop").fadeOut();
            } else {
                $("#gotop").fadeIn();
            }
        };
        // dropload
        $('#wrapper').dropload({
            scrollArea: window,
            loadUpFn: function (me) {
                $.ajax({
                    type: 'GET',
                    url: '/api/openChat',
                    dataType: 'json',
                    success: function (data) {
                        var newlength=data.length-result.length;
                        var temp=[];
                        if(result.length<=num){
                            var lang=data.length;
                          counter=-3;
                        }
                        else{lang=newlength+num;counter =1;}
                        for (var i = 0; i <lang; i++) {
                            var index = Math.floor((Math.random() * arry.length));
                            data[i].bg = arry[index];
                            temp.push(data[i]);
                        }
                        // 为了测试，延迟1秒加载
                        setTimeout(function () {
                            $scope.$apply(function(){
                                $scope.obj=temp;
                            });
                            //  每次数据加载完，必须重置
                            me.resetload();
                            // 重置索引值，重新拼接more.json数据
                            timbsColor($scope.obj);

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
            loadDownFn: function (me) {//加载
                        counter++;
                        pageEnd = num * counter;
                        pageStart = pageEnd - num;
                        var temp=[];
                       if(counter<0||result.length==0){
                          me.lock();
                           // 无数据
                         // me.noData();

                           $('.dropload-noData,.loading,.dropload-load').css({'display':'none'});

                       }
                        else{
                           for (var i = pageStart; i < pageEnd; i++) {
                               var index = Math.floor((Math.random() * arry.length));
                               result[i].bg = arry[index];
                               temp.push(result[i]);
                               if ((i + 1) >= result.length) {
                                   // 锁定
                                   me.lock();
                                   // 无数据
                                   me.noData();
                                   break;
                               }
                           }
                       }
                        console.log('1++++++'+i+'2++++++'+result.length);
                        // 为了测试，延迟1秒加载
                        setTimeout(function () {
                            $scope.$apply(function(){
                               Array.prototype.push.apply($scope.obj,temp);
                            });
                            // 每次数据加载完，必须重置
                            me.resetload();
                           timbsColor($scope.obj);
                        },1000);



            }
        });


















        $scope.timbs=function(){
            var numId=this.val.chatid;
          if(!numId){

          }
            else{
              var num={
                  userid:15,
                  number:1,//点赞
                  chatId:numId,
              };
              var num1={
                  userid:15,
                  number:0,//取消赞
                  chatId:numId,
              };
              var num2={
                  userid:15,
                  number:2,//获取timbstr
                  chatId:numId,
              };
              var number1=this.val.timbs;
              $.ajaxSetup({
                  async : false
              });
              $.post('/api/updateTimbs',num2,function(res){
                  var string= res[0].timbstr;
                  var indexId=string.indexOf(15+',');
                  if(indexId<0){
                      number1+=1;
                      $('.'+numId).addClass('blue');
                      $.post('/api/updateTimbs',num,function(res){

                      })

                   }
                  else{
                      number1-=1;
                      $('.'+numId).removeClass('blue');
                      $.post('/api/updateTimbs',num1)
                  }
              });
          }

            this.val.timbs=number1;
        }








 });

    $('#input').bind({
        focus: function () {
            $(this).val('');
        }, blur: function () {
            if ($(this).val() == '') {
                $(this).val('写评论');
            }
        }
    });
    $scope.fabu = function () {
        var content = $('#input').val();
        var da=new Date();

        dat1 = {
            content: content
        };
        if (content == '写评论') {
            alert('请输入内容！')
        }
        else {
            $.ajaxSetup({
                async : true
            });
            $.post('/api/ChatContent', dat1, function (res) {
                var arry = ['background-color:rgba(0, 255, 78, 0.2)', 'background-color:rgba(255, 206, 114, 0.2)',
                    'background-color:rgba(0,210,209, 0.2)', 'background-color:rgba(102,203,164, 0.2)',
                    'background-color:rgba(249,89,177, 0.3)', 'background-color:rgba(144,200,65, 0.2)'];
                var index = Math.floor((Math.random() * arry.length));
                if (res == 1) {
                    window.parent.boxshow('发布成功！');//调用父窗口的方法
                    $('#input').val('写评论');
                    datt = {
                        content: content,
                        userid:'',
                        timbs:0,
                        creatdate:da,
                        name:'沉吟莫沉吟',
                        timbstr:'0,',
                        bg:arry[index]
                    };
                    //Array.prototype.unshift.apply($scope.obj,datt);
                    $scope.$apply(function(){
                        $scope.obj.splice(0,0,datt)
                    });
                    $('#none').hide();
                }
                else {
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
        $('#myDiv2').css({display: 'block'});
    };
    $scope.back = function () {
        $('#myDiv').slideUp();
        $('#myDiv2').css({display: 'none'});
    };








});


