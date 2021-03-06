var electron=  require('electron');
var path=  require('path');
var remote = require('electron').remote; 
const ipc = electron.ipcRenderer;
const url = require('url'); 
var fs = require('fs');
var pageLayout = "a4";
var waterMarkData = null;
 
function removeBorder(){
    var css=  {
        "outline" : "",
        "outline-offset" : "",
    } 
    $(".sheet").css(css);
} 

function applyBorder(){
    var css=  {
        "outline" : $("#ddlBorderWidth").val() +" " +$("#ddlBorderType").val()+" " + $("#textBorderColor").val(),
        "outline-offset" : "-3em",
    } 
    $(".sheet").css(css);
}

if(remote.getGlobal('sharedObj').filePath != ""){
    fs.readFile(remote.getGlobal('sharedObj').filePath,"utf8", function read(err, data) {
        if (err) {  
        } 
        $("#mainPage").html(data); 
    });
}

var sheetHeight = $(".sheet").outerHeight();
var sheetTop = Number($(".sheet").css('padding-top').replace("px",""));
var sheetBottom = Number($(".sheet").css('padding-bottom').replace("px",""));
var sheetRight = Number($(".sheet").css('padding-right').replace("px",""));
var declaredHeight = sheetHeight - sheetTop - sheetBottom; 

applyPageNumbers();

var margins = {
    left:1,
    right:1,
    top:1,
    bottom:1
}; 

function applyPageNumbers(){ 
    $(".pageNumber").css({"bottom":sheetBottom,"right":sheetRight});
    $(".sheet").each(function(i,elem){
        $(elem).find(".pageNumber").html("Page " + (i+1) + " of " + $(".pagecontent").length);
    });
}

$("#gotopage").keypress(function(e){
    if(event.which != 8 && e.keyCode != 13&& isNaN(String.fromCharCode(event.which))){
        event.preventDefault(); //stop character from entering input
    }
    if(e.keyCode == 13){  
        $(".sheet").removeClass("active");
        $(".sheet").eq(Number($("#gotopage").val()) - 1).addClass("active");
        $(".sheet").eq(Number($("#gotopage").val()) - 1).find(".pagecontent").focus();
    }
});

$("body").on("mousedown",".pagecontent",function(e){ 
    if(e.target.tagName == "TD"){
        $(e.target).parent().attr("contenteditable","false");
        $(e.target).parent().find("td").attr("contenteditable","true");
    } 
    if(e.target.tagName == "DIV" && $(e.target).hasClass("shape")  && e.which == 3){
        const menuItems = [
            {   
                title:'No Fill' ,
                onclick: function(){
                    $(e.target).addClass("nofill");
                }
            },
            {   
                title:'Select Background Color' ,
                onclick: function(){ 
                    var $this =  $(e.target); 
                    var options = {
                        center: true,
                        fixed: false,
                        skinClass: "jg_popup_black",
                        overlay: true,
                        overlayColor: "#000",
                        fadeIn: 300,
                        draggable: true,
                        resizable: false,
                        scrolling: "no",
                        parentScrolling: false,
                        history:10,
                        color: $this.css('backgroundColor'),
                        onPick: function (color) {
                            $(e.target).removeClass("nofill");
                            $this.css('backgroundColor', '#' + color);
                        }
                    };
                    $.jeegoocolor(options);
                }
            },
            {   
                title:'Select Border Color' ,
                onclick: function(){  
                    var $this =  $(e.target); 
                    var options = {
                        center: true,
                        fixed: false,
                        skinClass: "jg_popup_black",
                        overlay: true,
                        overlayColor: "#000",
                        fadeIn: 300,
                        draggable: true,
                        resizable: false,
                        scrolling: "no",
                        parentScrolling: false,
                        history:10,
                        color: $this.css('borderColor'),
                        onPick: function (color) {
                            $this.css('border','1px solid ' + '#' + color);
                        }
                    };
                    $.jeegoocolor(options);
                }
            }
        ];
        new contextualMenu({ 
            items: menuItems 
        }); 
    }
    if(e.target.tagName == "TD" && e.which == 3){
        var table = $(e.target).parents("table")[0]; 
        const menuItems = [
                {title:'Insert Row Above' ,onclick: function(){
                   var row= table.insertRow($(e.target).parent().index());
                    for (i = 0; i < table.rows[0].cells.length; i++) {
                       var cell = row.insertCell(i);
                       var br = document.createElement('br');
                       cell.appendChild(br);   
                    }
                    $(row).attr("contenteditable","false");
                    $(row).find("td").attr("contenteditable","true");
                    $(row).find("td").attr("class","tableContent");
                }}, 
                {title:'Insert Row Below' ,onclick: function(){
                    var row= table.insertRow(($(e.target).parent().index() + 1));
                    for (i = 0; i < table.rows[0].cells.length; i++) {
                        var cell = row.insertCell(i);
                        var br = document.createElement('br');
                        cell.appendChild(br);   
                    } 
                    $(row).attr("contenteditable","false");
                    $(row).find("td").attr("contenteditable","true");
                    $(row).find("td").attr("class","tableContent");
                }},
                {title:'Delete Row' ,onclick: function(){
                    table.deleteRow($(e.target).parent().index()); 
                 }},
                {title:'Insert Column Before' ,onclick: function(){ 
                    $(table).find("tr").each(function(i,elem){
                        var cell = elem.insertCell($(e.target).index());
                        var br = document.createElement('br');
                        cell.appendChild(br);  
                        $(cell).attr("contenteditable","true");
                        $(cell).attr("class","tableContent");
                    });
                    var tdWidth =100/ Number(table.rows[0].cells.length);
                    $(table).find("td").css("width",tdWidth +"%");
                }},
                {title:'Insert Column After' ,onclick: function(){ 
                    $(table).find("tr").each(function(i,elem){
                        var cell = elem.insertCell(($(e.target).index() + 1));
                        var br = document.createElement('br');
                        cell.appendChild(br);  
                        $(cell).attr("contenteditable","true");
                        $(cell).attr("class","tableContent");
                    });
                    var tdWidth =100/ Number(table.rows[0].cells.length);
                    $(table).find("td").css("width",tdWidth +"%");
                }},
                {title:'Delete Column' ,onclick: function(){ 
                    $(table).find("tr").each(function(i,elem){
                        elem.deleteCell($(e.target).index());
                    });
                    var tdWidth =100/ Number(table.rows[0].cells.length);
                    $(table).find("td").css("width",tdWidth +"%");
                }},
            ] 
        new contextualMenu({ 
                items: menuItems 
            }); 
    }
}); 

$("body").on("click",".sheet",function(e){  
    $("#gotopage").val(($(this).index() + 1)); 
    if(document.getSelection().isCollapsed)
    {
        if(e.target.className.indexOf("shape") >= 0)
        return false;

        if($(this).find(".shape").length > 0){
            if($(this).find(".shape").length != $(this).find(".divAfterShape").length){
                var blankDiv = $('<div class="divAfterShape"> <br></div>');
                blankDiv.insertAfter($(this).find(".pagecontent .shape:last")[0]); 
                $(".sheet").removeClass("active");
                $(this).addClass("active");
                placeCaretAtEnd($(this).find(".pagecontent")[0]);
            }
        }  
    } 
    if(e.target.className.indexOf("sheet") >= 0){
        $(".sheet").removeClass("active");
        $(this).addClass("active");
        placeCaretAtEnd($(this).find(".pagecontent")[0]);  
    }
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
    $(".sheet").removeClass("active");
    var sheetDiv = $('<div class="sheet active"></div>'); 
    var watermarkDiv = $('<div class="watermark"></div>'); 
    var pageNumberDiv = $('<div class="pageNumber"></div>'); 
    var pageContentDiv = $('<div class="pagecontent" spellcheck="true" contenteditable="true"></div>');
    watermarkDiv.appendTo(sheetDiv);
    pageContentDiv.appendTo(sheetDiv);
    pageNumberDiv.appendTo(sheetDiv);
    $(sheetDiv).css({
        "padding-left":margins.left + "in",
        "padding-top":margins.top + "in",
        "padding-bottom":margins.bottom + "in",
        "padding-right":margins.right + "in"
    });
    sheetDiv.appendTo($("#printDoc"));  
    pageContentDiv.focus();
    applyWaterMark();
    applyPageNumbers();
}   

function pageContentKeyDown(e){ 
    if(e.keyCode == 9) { 
        document.execCommand('insertHtml',false,' &nbsp; &nbsp; &nbsp;')
        return false;
    }
    if (e.which == 13 && e.shiftKey == false) {  
        if($(this.lastElementChild).hasClass("divAfterShape"))
        {
            var blankDiv = $('<div> <br></div>');
            blankDiv.insertAfter($(this).find(".divAfterShape:last")[0]);
            placeCaretAtEnd(this);
            return false;
        } 
    } 
    var key = event.keyCode || event.charCode;
    if($(".sheet").length > 1){ 
        var currentPos = getPos(this); 
        var parentDiv =$(this).parent(); 
        if(($(this).find("div").length == 0) && currentPos == 0 && (key == 8 || key == 46)){
            $(".sheet").removeClass("active");
            $(this).parent().prev().addClass("active");
            parentDiv.remove();
            placeCaretAtEnd($(".sheet.active .pagecontent")[0]);
            $("#gotopage").val($(".sheet").length);
            $("#totalPage").html($(".sheet").length); 
            applyPageNumbers();
            return false;
        }
    } 
    
    if(!(key == 8 || key == 46)){
        var contentHeight = this.scrollHeight;
        if (contentHeight >= declaredHeight){
            if(e.which == 13) $(this.lastElementChild).remove();
            if(!$(this).parent().next().hasClass("sheet")){  
                createNewSheet(); 
                $("#gotopage").val($(".sheet").length);
                $("#totalPage").html($(".sheet").length); 
                return false; 
            }
            else{
                $(".sheet").removeClass("active");
                $(this).parent().next().addClass("active");
                $(this).parent().next().find(".pagecontent").focus();
                $("#gotopage").val(($(this).parent().index() + 1));
                return false; 
            }
        }
    } 
}
 
$(document).on("keydown",".pagecontent",pageContentKeyDown);

function  getPos(elem) {
    elem.focus()
    let _range = document.getSelection().getRangeAt(0)
    let range = _range.cloneRange()
    range.selectNodeContents(elem)
    range.setEnd(_range.endContainer, _range.endOffset)
    return range.toString().length;  
}

placeCaretAtEnd($(".sheet.active .pagecontent")[0]);
 
remote.ipcMain.on('margins', (event, data) => { 
    margins = data;
    $(".sheet").css({
        "padding-left":data.left + "in",
        "padding-top":data.top + "in",
        "padding-bottom":data.bottom + "in",
        "padding-right":data.right + "in"
    });
    sheetHeight = $(".sheet").outerHeight();
    sheetTop = Number($(".sheet").css('padding-top').replace("px",""));
    sheetBottom = Number($(".sheet").css('padding-bottom').replace("px",""));
    sheetRight = Number($(".sheet").css('padding-right').replace("px",""));
    declaredHeight = sheetHeight - sheetTop - sheetBottom; 
    placeCaretAtEnd($(".sheet.ative .pagecontent")[0]); 
});

var fontFamily = "";

ipc.on('fontFamily', (event, data) => { 
    placeCaretAtEnd($(".sheet.active .pagecontent")[0]);
    fontFamily =data;
    document.execCommand("fontName", false, data ); 
});

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
    placeCaretAtEnd($(".sheet.active .pagecontent")[0]);
    applyPageNumbers();
}

function saveFile(){   
    var element =document.createElement("DIV");
    $(".pagecontent").each(function(i,elem){
        var element1 =document.createElement("DIV");
        var element2 =document.createElement("DIV");
        var pageNumberDiv =document.createElement("DIV");
        var contentElement = $(elem).clone();  
        $(pageNumberDiv).addClass("pageNumber");
        $(pageNumberDiv).css({"bottom":sheetBottom,"right":sheetRight});
        $(pageNumberDiv).html("Page " + (i+1) + " of " + $(".pagecontent").length);
        var waterMarkDiv =$($(".watermark:first-child")[0]).clone();
        $(waterMarkDiv).css("bottom","0 !important");
        $(element1).append(waterMarkDiv);
        $(element1).append(contentElement);
        $(element1).append(pageNumberDiv);
        $(element1).appendTo(element2);
        $(element1).css({
            "padding-left":margins.left + "in",
            "padding-top":margins.top + "in",
            "padding-bottom":margins.bottom + "in",
            "padding-right":margins.right + "in",
            "position":"relative",
        });
        $(contentElement).css({"height":declaredHeight - 10 + "px",
                                "position":"relative"
                            });
        element.innerHTML += $(element2).html();  
        if((i+1) < $(".pagecontent").length)
            element.innerHTML += '<div class="html2pdf__page-break"></div>';
    });  
    console.log(element);
    var opt = {
      margin:       0,
      filename:     'myfile.pdf',
      image:        { type: 'png', quality: 1 },
      html2canvas: {dpi: 100, letterRendering: true},
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
        var sheetDiv = '<span style="font-family:'+fontFamily+';font-size:'+$(obj).val()+'">&#8203;</span>';
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
        placeCaretAtEnd($(".sheet.active .pagecontent")[0]);
        if(isConfirm){
            var row =this.swalForm.row;
            var column =this.swalForm.column;
            var div = $("<div contenteditable='false'></div>");
            var table = $("<table style='width:100%'  contenteditable='false'></table>"); 
            table.appendTo(div);
            for (let index = 0; index < Number(row); index++) {
                var tr = $("<tr></tr>"); 
                var tdWidth =100/ Number(column);
                for (let index = 0; index < Number(column); index++) { 
                    var td = $("<td class='tableContent' style='width:"+tdWidth+"%'><br></td>"); 
                    td.appendTo(tr);   
                }
                tr.appendTo(table);
            }  
            table.find("tr").each(function(index,elem){
                $(elem).attr("contenteditable","false");
            });
            table.find("td").each(function(index,elem){
                $(elem).attr("contenteditable","true");
            }); 
            document.execCommand("insertHTML", false, div.html());  
            var tableLength =$(".sheet.active .pagecontent table").length;
            var insertedtable;
            
            if(tableLength != 0)
                tableLength -= 1;

            insertedtable=  $(".sheet.active .pagecontent table").eq(tableLength)[0];
            var range = document.createRange();
            var sel = window.getSelection();
            range.setStart(insertedtable.firstChild.firstChild.firstChild, 0);
            range.setEnd(insertedtable.firstChild.firstChild.firstChild, 1);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            insertedtable.firstChild.firstChild.firstChild.focus();  
        }  
    })
} 

$(document).on("keydown",".tableContent",tableKeyDown);

function addRow(e){
    var table = $(e.target).parent().parent()[0];
    var row= table.insertRow(($(e.target).parent().index() + 1));
    for (i = 0; i < table.rows[0].cells.length; i++) {
        var cell = row.insertCell(i);
        var br = document.createElement('br');
        cell.appendChild(br);   
    } 
    $(row).attr("contenteditable","false");
    $(row).find("td").attr("contenteditable","true");
    $(row).find("td").attr("class","tableContent");
    return row;
}

function insertImage(){
    var currentWindow = remote.getCurrentWindow();
    var promptWindow = new  remote.BrowserWindow({
        parent:currentWindow,
        width: 300,
        height: 150,
        show: false,
        resizable: false,
        movable: true, 
        closable: true,
        minimizable: false,
        maximizable: false
    }) 
    promptWindow.setMenu(null);
    const promptHtml = '<label for="val">Enter image url</label>\
    <input id="val" value="" autofocus />\
    <button onclick="require(\'electron\').ipcRenderer.send(\'prompt-response\', document.getElementById(\'val\').value);window.close()">Ok</button>\
    <button onclick="window.close()">Cancel</button>\
    <style>body {font-family: sans-serif;} button {float:right; margin-left: 10px;} label,input {margin-bottom: 10px; width: 100%; display:block;}</style>'
    promptWindow.loadURL('data:text/html,' + promptHtml)
    promptWindow.show()
    promptWindow.on('closed', function() { 
        promptWindow = null
    }) 
}

remote.ipcMain.on('prompt-response', function(event, arg) {
    if (arg === ''){ arg = null } 
    document.execCommand("insertImage", false, arg);
})

function tableKeyDown(e){
    e.stopPropagation();
    if(e.keyCode == 9) { 
        var parentTr =$(e.currentTarget).parent();
        var nextTr =$(e.currentTarget).parent().next();
        var totalTd = parentTr.find("td").length;
        var currentIndex =$(e.currentTarget).index() + 1; 
        if(totalTd == currentIndex){  
            if(nextTr.length == 0)
                nextTr = $(addRow(e));
 
            nextTr.attr("contenteditable","false");
            nextTr.find("td").attr("contenteditable","true");
            var range = document.createRange();
            var sel = window.getSelection();
            range.setStart(nextTr[0].firstChild, 0);
            range.setEnd(nextTr[0].firstChild, 1);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            nextTr[0].firstChild.focus();
            return false;
        }
    } 
} 
