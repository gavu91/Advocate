const {globalShortcut} = remote;   
globalShortcut.register('CommandOrControl+F', () => {
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

remote.ipcMain.on('find', (event, data) => {  
    // $(".pagecontent").find("div").each(function(i,elem){ 
    // });
});

remote.ipcMain.on('replace', (event, data) => { 
});