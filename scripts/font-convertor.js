var electron=  require('electron');
var path=  require('path');
var remote = require('electron').remote;
const ipc = electron.ipcRenderer;
const url = require('url'); 
var fs = require('fs');

var pageLayout = "a4";

if(remote.getGlobal('sharedObj').filePath != ""){
    fs.readFile(remote.getGlobal('sharedObj').filePath,"utf8", function read(err, data) {
        if (err) {  
        }
        console.log(data);
        $("#mainPage").html(data); 
    });
}

var sheetHeight = $(".sheet").outerHeight();
var sheetTop = Number($(".sheet").css('padding-top').replace("px",""));
var sheetBottom = Number($(".sheet").css('padding-bottom').replace("px",""));
var declaredHeight = sheetHeight - sheetTop - sheetBottom;

var margins = {
    left:1,
    right:1,
    top:1,
    bottom:1
};

$("body").on("click",".sheet",function(e){ 
    if(document.getSelection().isCollapsed)
    {
        if(e.target.className.indexOf("shape") >= 0)
        return false;

        if($(this).find(".shape").length > 0){
            if($(this).find(".shape").length != $(this).find(".divAfterShape").length){
                var blankDiv = $('<div class="divAfterShape"> <br></div>');
                blankDiv.insertAfter($(this).find(".pagecontent .shape:last")[0]); 
                placeCaretAtEnd($(this).find(".pagecontent")[0]);
            }
        }  
    } 
    if(e.target.className.indexOf("sheet") >= 0)
        placeCaretAtEnd($(this).find(".pagecontent")[0]); 
});

function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
} 

function insertShape(shape){
    var sheetDiv = '<div class="shape '+shape.toString().toLowerCase()+'"></div>';
    document.execCommand("insertHTML", false, sheetDiv );
 }

function saveFileAsDraft(){ 
    var rootDraftfolder = process.resourcesPath + "/Draft";
    if (!fs.existsSync(rootDraftfolder)) fs.mkdir(rootDraftfolder,function(err){
        if (err) {
            return console.error(err);
        }
        console.log("Directory created successfully!");
     });
    swal({
        title: "Save as Draft",
        text: "File name",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false, 
        inputPlaceholder: "Write file name"
    }, function (inputValue) {
        if (inputValue === false) return false;
        if (inputValue === "") {
            swal.showInputError("File name is required"); return false
        }
        var filename = rootDraftfolder + "/" + inputValue +".adraft";
        fs.writeFile(filename, $("#mainPage").html(), function(err) {
            if(err) {
                return console.log(err);
            }
            swal("File Saved!", "File saved as draft", "success");
        }); 
    });
}

function createNewSheet(){
    var sheetDiv = $('<div class="sheet"></div>'); 
    var pageContentDiv = $('<div class="pagecontent" contenteditable="true"></div>');
    pageContentDiv.appendTo(sheetDiv);
    sheetDiv.appendTo($("#printDoc"));  
    pageContentDiv.focus();
} 

$("body").on("keydown","[contenteditable=true]",function(e){ 
    // if(e.keyCode == 9 && e.shiftKey) { 
    //     document.execCommand('outdent',true,null)
    //     return false;
    // } else 
    if(e.keyCode == 9) { 
        document.execCommand('insertHtml',false,' &nbsp; &nbsp; &nbsp;')
        return false;
    }
    if (e.which == 13 && e.shiftKey == false) { 
        console.log($(this.lastElementChild).hasClass("divAfterShape"));
        if($(this.lastElementChild).hasClass("divAfterShape"))
        {
            var blankDiv = $('<div> <br></div>');
            blankDiv.insertAfter($(this).find(".divAfterShape:last")[0]);
            placeCaretAtEnd(this);
            return false;
        } 
    }
    // if(this.className.indexOf("shape") <= 0)
    // {
        var key = event.keyCode || event.charCode;
        if($(".sheet").length != 1){ 
            var currentPos = getPos(this);
            var parentDiv =$(this).parent(); 
            if(($(this).find("div").length == 0) && currentPos == 0 && (key == 8 || key == 46)){
                parentDiv.remove();
                placeCaretAtEnd($(".sheet:last-child .pagecontent")[0]);
                return false;
            }
        } 
        if(!(key == 8 || key == 46)){
            var contentHeight = this.scrollHeight;
            if (contentHeight >= declaredHeight){
                if(e.which == 13) $(this.lastElementChild).remove();
                if(!$(this).parent().next().hasClass("sheet")){ 
                    e.preventDefault();
                    createNewSheet();
                    // return false;
                }
                else{
                    $(this).parent().next().find(".pagecontent").focus();
                    return false; 
                }
            }
        }
       
        // else{
            
        // }
    // } 
});

function  getPos(elem) {
    elem.focus()
    let _range = document.getSelection().getRangeAt(0)
    let range = _range.cloneRange()
    range.selectNodeContents(elem)
    range.setEnd(_range.endContainer, _range.endOffset)
    return range.toString().length;  
}

placeCaretAtEnd($(".sheet:last-child .pagecontent")[0]);
 
remote.ipcMain.on('margins', (event, data) => { 
    margins = data;
    placeCaretAtEnd($(".sheet:last-child .pagecontent")[0]);
    $(".sheet").css({
        "padding-left":data.left + "in",
        "padding-top":data.top + "in",
        "padding-bottom":data.bottom + "in",
        "padding-right":data.right + "in"
    });
});

ipc.on('fontFamily', (event, data) => { 
    placeCaretAtEnd($(".sheet:last-child .pagecontent")[0]);
    document.execCommand("fontName", false, data ); 
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

function changeLayout(className){
    pageLayout= className;
    $("#editor").removeAttr("class");
    $("#editor").addClass(className + " editor");
}

function saveFile(){   
    var element =document.createElement("DIV");
    $(".pagecontent").each(function(i,elem){
        element.innerHTML += $(elem).html(); 
         if((i+1) != $(".pagecontent").length)
             element.innerHTML += '<div class="html2pdf__page-break"></div>';
    });
    var opt = {
      margin:       [margins.top,margins.left,margins.bottom,margins.right],
      filename:     'myfile.pdf',
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: pageLayout.toLowerCase(), orientation: 'portrait' }
    }; 
    html2pdf().from(element).set(opt).save(); 
} 

function changeFontSize(obj){ 
    if(!document.getSelection().isCollapsed)
    {
        document.execCommand("fontSize", false, "7");
        var fontElements = document.getElementsByTagName("font");
        for (var i = 0, len = fontElements.length; i < len; ++i) {
            if (fontElements[i].size == "7") {
                fontElements[i].removeAttribute("size");
                fontElements[i].style.fontSize =$(obj).val();
            }
        }
    }
    else{  
        // placeCaretAtEnd($(".sheet:last-child .pagecontent")[0]);
        var sheetDiv = '<span style="font-size:'+$(obj).val()+'">&#8203;</span>';
        document.execCommand("insertHTML", false, sheetDiv);
    }
} 

function insertTable(){
    swal.withForm({
        title: '',
        text: '',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Add Table',
        closeOnConfirm: true,
        formFields: [
          { id: 'row', placeholder: 'No. of Rows', required: true },
          { id: 'column', placeholder: 'No. of Columns', required: true }
        ]
    }, function (isConfirm) {
        var row =this.swalForm.row;
        var column =this.swalForm.column;
        var div = $("<div></div>");
        var table = $("<table style='width:100%'></table>");
        table.appendTo(div);
        for (let index = 0; index < Number(row); index++) {
            var tr = $("<tr></tr>"); 
            var tdWidth =100/ Number(column);
            for (let index = 0; index < Number(column); index++) { 
                var td = $("<td style='width:"+tdWidth+"%'><br></td>"); 
                td.appendTo(tr); 
            }
            tr.appendTo(table);
        } 
        placeCaretAtEnd($(".sheet:last-child .pagecontent")[0]);
        document.execCommand("insertHTML", false, div.html());
        console.log($(".sheet:last-child .pagecontent table tr:first-child td:first-child"));
        $(".sheet:last-child .pagecontent table tr:first-child td:first-child")[0].focus();
    })
}