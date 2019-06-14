var electron=  require('electron');
var path=  require('path');
var remote = require('electron').remote;
const ipc = electron.ipcRenderer;
const url = require('url');
//receive margins data from popupWindow
remote.ipcMain.on('margins', (event, data) => { 
    $("#transliterateTextarea").css({
        "padding-left":data.left + "in",
        "padding-top":data.top + "in",
        "padding-bottom":data.bottom + "in",
        "padding-right":data.right + "in"
    });
});

ipc.on('fontFamily', (event, data) => { 
    $("#transliterateTextarea").focus();
    document.execCommand( "fontName", false, data ); 
})

function openMarginDialog(){
    var currentWindow = remote.getCurrentWindow();
    var popupWindow = new remote.BrowserWindow({
        parent:currentWindow
        ,show:false, 
        width: 400 
        ,minimizable: false,
        maximizable: false, 
        height: 282
    });
    popupWindow.setMenu(null);
    var rootfolder = __dirname.replace("\Pages","");
    const filePath = url.format({
        pathname: path.join(rootfolder, 'Modal/page-layout.html'),
        protocol: 'file:',
        slashes: true
    })
    popupWindow.loadURL(filePath);
    popupWindow.show(); 
}

function saveFile(){ 
    remote.dialog.showSaveDialog((fileName) => {
        if (fileName === undefined){
            console.log("You didn't save the file");
            return;
        }
        var pdf = require('html-pdf');
        var options = { format: 'A4' };
        pdf.create($("#transliterateTextarea").html(), options).toFile(fileName, function(err, res) {
            if (err) return console.log(err);
            const msgoptions = {
                                type: 'info',
                                buttons: ['Ok'],
                                defaultId: 2,
                                title: 'Success',
                                message: 'The file has been succesfully saved'
                            }; 
            remote.dialog.showMessageBox(null, msgoptions, (response, checkboxChecked) => {
                console.log(response);
                console.log(checkboxChecked);
            });
        });
    });
} 

function changeFontSize(obj){
    $("#transliterateTextarea").focus();
    document.execCommand("fontSize", false, "7");
    var fontElements = document.getElementsByTagName("font");
    for (var i = 0, len = fontElements.length; i < len; ++i) {
        if (fontElements[i].size == "7") {
            fontElements[i].removeAttribute("size");
            fontElements[i].style.fontSize =$(obj).val();
        }
    }
}