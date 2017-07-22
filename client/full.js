
import {PDFJS,PDFWorker} from 'pdfjs-dist'
import fs from 'fs'

var ipc = require('electron').ipcRenderer

var wrapper = document.getElementById("full")
var canvas  = document.getElementById("now")
var ctx = canvas.getContext('2d')
var pdfDoc


ipc.on('canvas', (event,data) => {
    var i = data.num

    pdfDoc.getPage(i).then(function(page) {
    
        var now_page = document.getElementById('now_page')
        var viewport = page.getViewport(1.0, 0)
        var rate = wrapper.clientHeight/viewport.height
        
        var viewport = page.getViewport(rate, 0)
        var ctx = canvas.getContext('2d')

        canvas.height = viewport.height
        canvas.width = viewport.width

        page.render({
            canvasContext: ctx,
            viewport: viewport
        })
    })
})

ipc.on('openFile', (event, fileName) => {
    PDFJS.workerSrc = __dirname + '/pdf.worker.js'
    var f = fs.readFileSync(fileName)
    PDFJS.disableWorker = true;

    var canvases = []
    PDFJS.getDocument({data: f}).then((doc) => {
        console.log("pages:" + doc.numPages)
        pdfDoc = doc
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
    })
})