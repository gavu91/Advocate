var remote = require('electron').remote; 
const localShortcut = require('electron-localshortcut'); 
localShortcut.register(remote.getCurrentWindow(),'Ctrl+F', () => {
    var currentWindow = remote.getCurrentWindow();
    var promptWindow = new  remote.BrowserWindow({
        parent:currentWindow, 
        width: 400,
        height: 245,
        show: false, 
        resizable: false,
        movable: true, 
        closable: true,
        minimizable: false,
        maximizable: false
    }) 
    promptWindow.setMenu(null);   
    var rootfolder = __dirname.replace("\Pages","");
    const filePath = url.format({
        pathname: path.join(rootfolder, 'Modal/findandreplace.html'),
        protocol: 'file:',
        slashes: true
    })
    promptWindow.loadURL(filePath);
    promptWindow.show();
})

var TRange=null;

function findString (str) {
 if (parseInt(navigator.appVersion)<4) return;
 var strFound;
 if (window.find) { 
  strFound=self.find(str);
  if (!strFound) {
   strFound=self.find(str,0,1); 
   while (self.find(str,0,1)) continue;
  }
 }
 else if (navigator.appName.indexOf("Microsoft")!=-1) { 
  if (TRange!=null) {
   TRange.collapse(false);
   strFound=TRange.findText(str);
   if (strFound) TRange.select();
  }
  if (TRange==null || strFound==0) {
   TRange=self.document.body.createTextRange();
   strFound=TRange.findText(str);
   if (strFound) TRange.select();
  }
 }
 else if (navigator.appName=="Opera") {
  alert ("Opera browsers not supported, sorry...")
  return;
 }
 if (!strFound) alert ("String '"+str+"' not found!")
 return;
}

remote.ipcMain.on('find', (event, data) => {  
    if(!data.isall)
        findString(data.findtext); 
});

remote.ipcMain.on('replace', (event, data) => { 
});