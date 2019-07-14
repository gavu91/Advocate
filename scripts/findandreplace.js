var electron=  require('electron');
var remote = require('electron').remote; 
const ipc = electron.ipcRenderer; 
function find(){
    ipc.send('find', {
        findtext:$("#findtext").val(),
        replacetext:$("#replacetext").val(), 
        isall:false
    }); 
}
function findall(){
    ipc.send('find', {
        findtext:$("#findtext").val(),
        replacetext:$("#replacetext").val(), 
        isall:true
    }); 
}
function replace(){
    ipc.send('replace', {
        findtext:$("#findtext").val(),
        replacetext:$("#replacetext").val(), 
        isall:false
    });
}
function replaceall(){
    ipc.send('replace', {
        findtext:$("#findtext").val(),
        replacetext:$("#replacetext").val(), 
        isall:true
    }); 
}
