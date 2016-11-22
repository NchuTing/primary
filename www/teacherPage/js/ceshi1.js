//响应事件
window.addEventListener('message', function (event) {
    //    if (event.origin !== 'http://davidwalsh.name') return;
    console.log('message received:  ' + event.data, event);
    event.source.postMessage('holla back youngin!', event.origin);
}, false);