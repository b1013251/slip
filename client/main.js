import fs from 'fs'

import {PDFJS,PDFWorker} from 'pdfjs-dist'
var ipc = require('electron').ipcRenderer

var pdfDoc;
var i = 0;
var nowCanvas = document.querySelector("#now")
var nextCanvas = document.querySelector("#next")
var textArray = []
var memo = document.querySelector("#memoContent")

// ReactDOM.render(<Root />, document.querySelector("#root"))

let renderMemo =  (num) => {
    if (textArray.length > num-1)  {
        memo.innerHTML = textArray[num-1]
    } else {
        memo.innerHTML = ""
    }
}

let renderNow = (num) => {
    pdfDoc.getPage(num).then(function(page) {
    
        var now_page = document.getElementById('now_page')
        var viewport = page.getViewport(1.0, 0)
        var rate = now_page.clientWidth/viewport.width
        
        var viewport = page.getViewport(rate, 0)
        var ctx = nowCanvas.getContext('2d')

        nowCanvas.height = viewport.height
        nowCanvas.width = viewport.width

        page.render({
            canvasContext: ctx,
            viewport: viewport
        })
    })
}

let renderNext = (num) => {
    pdfDoc.getPage(num).then(function(page) {
        var next_page = document.getElementById('next_page')
        var viewport = page.getViewport(1.0, 0)
        var rate = next_page.clientWidth/viewport.width
        
        var viewport = page.getViewport(rate, 0)
        var ctx = nextCanvas.getContext('2d')

        nextCanvas.height = viewport.height
        nextCanvas.width = viewport.width

        page.render({
            canvasContext: ctx,
            viewport: viewport
        })
    })
}

var set = document.getElementById("set")
var number = document.getElementById("number")
var clickSetButton = (e) => {
    i = Number(number.value)
    renderNow(i)
    renderNext(i+1)
    renderMemo(i)
    ipc.send('getCanvas', {
       num: i
    });
    e.preventDefault();
}
set.addEventListener("click", clickSetButton, false)


var moveNext = document.getElementById("moveNext")
var clickNextButton = (e) => {
    console.log("rendering")
    i += 1;
    number.value = i
    renderNow(i)
    renderNext(i+1)
    renderMemo(i)
    console.log(pdfDoc)
    ipc.send('getCanvas', {
       num: i
    });
    e.preventDefault();
}
moveNext.addEventListener("click", clickNextButton, false)

var movePrev = document.getElementById("movePrev")
var clickPrevButton = (e) => {
    i -= 1;
    number.value = i
    renderNow(i)
    renderNext(i+1)
    renderMemo(i)
    ipc.send('getCanvas', {
       num: i
    });
    e.preventDefault();
}
movePrev.addEventListener("click", clickPrevButton, false)

document.onkeyup = function (e){
    switch(e.which) {
        case 37:
            clickPrevButton(null)
            break;
        case 39:
            clickNextButton(null)
            break;
    }
};

// ウィンドウ幅変更時
var timer = 0;
window.onresize = function () {
  if (timer > 0) {
    clearTimeout(timer);
  }
 
  timer = setTimeout(function () {
    renderNow(i)
    renderNext(i+1)
  }, 200);
};


ipc.on('openFile', (event, fileName) => {
    i = 0;
    PDFJS.disableWorker = true;
    PDFJS.workerSrc = __dirname + '/pdf.worker.js'
    var f = fs.readFileSync(fileName)

    PDFJS.getDocument({data: f}).then((doc) => {
        console.log("pages:" + doc.numPages)
        pdfDoc = doc
        var canvases = []
        for(var i=1; i<doc.numPages; i++) {
            var canvas = new Canvas()
            canvas.width = 200
            canvas.height = 160
            pdfDoc.getPage(i).then(function(page) {
                var viewport = page.getViewport(1, 0)
                var ctx = canvas.getContext('2d')
                page.render({
                    canvasContext: ctx,
                    viewport: viewport
                })
                canvases.push(canvas)
            })
        }
        console.log("ok")
    })
})

ipc.on('openMemo', (event, fileName) => {
    fs.readFile(fileName, 'utf8', function(err, text) {
        if(err) {
            console.log(err);
            return;
        }
        textArray = text.split("----")
        console.log(textArray);
    });
});


// timer
var timeValue = document.getElementById("watch")
var timerId;


var startStopButton = document.getElementById("start_stop")
var start_stop = (e) => {
    var startTime = Date.now()
    timerId = setInterval(function(){
               var t = Date.now() - startTime;
               timeValue.value = Math.floor(t/60000) + ":" + Math.floor((t/1000))%60;
            },1000);
    e.preventDefault();
}
startStopButton.addEventListener("click", start_stop, false)

var clearButton = document.getElementById("clear")
var clear = (e) => {
    console.log("clear")
    clearInterval(timerId)
    e.preventDefault();
}
clearButton.addEventListener("click", clear, false)
