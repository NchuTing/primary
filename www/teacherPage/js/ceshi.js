//创建弹出窗口
var domain = 'http://m.xmgc360.com/homework/web/teacherPage';
var myPopup = window.open(domain + '/ceshi1.html', 'myWindow');
//发送消息
setTimeout(function () {
    var message = 'Hello!  The time is: ' + (new Date().getTime());
    console.log('blog.local:  sending message:  ' + message);
    myPopup.postMessage(message, domain); //send the message and target URI
}, 1000);

//监听回复
window.addEventListener('message', function (event) {
    //    if (event.origin !== 'http://hzhuti.com') return;
    console.log('received response:  ', event.data);
}, false);