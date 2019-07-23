function openWaterMark(){
    var currentWindow = remote.getCurrentWindow();
    var promptWindow = new  remote.BrowserWindow({
        parent:currentWindow, 
        width: 400,
        height: 270, 
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
        pathname: path.join(rootfolder, 'Modal/waternark.html'),
        protocol: 'file:',
        slashes: true
    })
    promptWindow.loadURL(filePath);
    promptWindow.show();
}

function applyWaterMark(){
    var waterMarkDiv = $(".watermark");
    waterMarkDiv.empty().removeClass("watermark-diagonal").removeAttr("style");
    if(waterMarkData != null){
        if(waterMarkData.isApply){
            if(waterMarkData.layout == "Diagonal")
                waterMarkDiv.addClass("watermark-diagonal");
            
            waterMarkDiv.html(waterMarkData.watermarktext);
            var styles ={
                "font-size" :waterMarkData.watermarktextsize + "px",
                "color" :waterMarkData.textColor
            }
            waterMarkDiv.css(styles);
        } 
    } 
}

remote.ipcMain.on('watermark', (event, data) => {    
    var waterMarkDiv = $(".watermark");
    if(!data.isApply){
        waterMarkDiv.empty().removeClass("watermark-diagonal").removeAttr("style");
        waterMarkData = null;
    }
    else{
        waterMarkData = data;
        applyWaterMark();
    }
});