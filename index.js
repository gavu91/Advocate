const electron = require('electron');
const path = require('path');
const fs = require('fs');
const url = require('url');
const ipc = require('electron').ipcRenderer;
global.sharedObj = {filePath: ''};

const { app, BrowserWindow, Menu, ipcMain,dialog } = electron;

const resourcesPath = process.resourcesPath;

if (handleSquirrelEvent(app)) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

function handleSquirrelEvent(application) {
  if (process.argv.length === 1) {
      return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
      let spawnedProcess, error;

      try {
          spawnedProcess = ChildProcess.spawn(command, args, {
              detached: true
          });
      } catch (error) {}

      return spawnedProcess;
  };

  const spawnUpdate = function(args) {
      return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
      case '--squirrel-install':
      case '--squirrel-updated':
          // Optionally do things such as:
          // - Add your .exe to the PATH
          // - Write to the registry for things like file associations and
          //   explorer context menus

          // Install desktop and start menu shortcuts
          spawnUpdate(['--createShortcut', exeName]);

          setTimeout(application.quit, 1000);
          return true;

      case '--squirrel-uninstall':
          // Undo anything you did in the --squirrel-install and
          // --squirrel-updated handlers

          // Remove desktop and start menu shortcuts
          spawnUpdate(['--removeShortcut', exeName]);

          setTimeout(application.quit, 1000);
          return true;

      case '--squirrel-obsolete':
          // This is called on the outgoing version of your app before
          // we update to the new version - it's the opposite of
          // --squirrel-updated

          application.quit();
          return true;
  }
};


let mainWindow; 
let mainMenu;
// SET ENV
process.env.NODE_ENV = 'development';
// Listen for app to be ready
app.on('ready', function () {
  mainWindow = new BrowserWindow({  
    // minimizable: false,
    //     maximizable: false,
    //     resizable:false
  });
  mainWindow.maximize();
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
  // Quit app when closed
  mainWindow.on('closed', function () {
    app.quit();
  });
  // Build menu from template
  mainMenu = Menu.buildFromTemplate(loginMenuTemplate);
  // Insert menu
 Menu.setApplicationMenu(mainMenu);  
  mainWindow.setMenu(mainMenu); 
});

ipcMain.on('login', function() { 
  mainMenu = Menu.buildFromTemplate(mainMenuTemplate); 
  Menu.setApplicationMenu(mainMenu);
});

// Create menu template
const mainMenuTemplate = [
  // Each object is a dropdown
  {
    label: 'File',
    submenu: [
      {
        label: 'New  Client'
      },
      {
        label: 'Client Master / Open Client File'
      },
      {
        label: 'Invoice'
      },
      {
        label: 'Exit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Drafts',
    submenu:[
      {
        label: 'New Blank Draft',
        click() {
          mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'Pages/font-converter.html'),
            protocol: 'file:',
            slashes: true
          }));
        }
      },
      {
        label: 'Open Draft',
        click(){ 
          dialog.showOpenDialog({
            properties: ['openFile'],
            defaultPath:resourcesPath + "/Draft",
            filters: [
              {name: "Drafts", extensions: ["adraft"]},
            ]
          }, function (files) {
              if (files !== undefined) {
                global.sharedObj.filePath = files[0]; 
                mainWindow.loadURL(url.format({
                  pathname: path.join(__dirname, 'Pages/font-converter.html'),
                  protocol: 'file:',
                  slashes: true
                }));
              } 
          });
        }
      },
      {
        label: 'Upload Draft'
      }
    ]
  },
  {
    label: 'Backup-Restore',
    submenu:[
      {
        label: 'Backup'
      },
      {
        label: 'Restore'
      }
    ]
  },
  {
    label: 'Convertor',
    submenu:[
      {
        label: 'Font Convertor' 
      },
      {
        label: 'Text - PDF Convertor'
      },
      {
        label: 'PDF - Text Convertor'
      }
    ]
  },
  {
    label: 'View',
    submenu:[
      {
        label: 'To-Do List'
      },
      {
        label: 'Birth Date Reminder'
      }
    ]
  }, 
  {
    label: 'External/Links',
    submenu:[
      {
        label: 'Manage Links'
      },
      {
        label: 'Open Links'
      }
    ]
  },
  {
    label: 'Windows',
    submenu:[
      {
        label: 'Keyboard (Select Keyboard Type)'
      },
      {
        label: 'Font (Select Font)',
        submenu:[
          {
            label: 'English',
            click() {
              mainWindow.webContents.send('fontFamily','Arial');
            } 
          },
          {
            label: 'Gujarati Saral 1',
            click() {  
              mainWindow.webContents.send('fontFamily','gujarati-saral-1');
            } 
          },
          {
            label: 'Gujarati Saral 2',
            click() {
              mainWindow.webContents.send('fontFamily','gujarati-saral-2');
            } 
          }, 
          {
            label: 'BA MART',
            click() {
              mainWindow.webContents.send('fontFamily','bamart');
            } 
          },
          {
            label: 'BA MART B',
            click() {
              mainWindow.webContents.send('fontFamily','bamartb');
            } 
          }
        ]
      }, 
      {
        label: 'Update Software (Optional)'
      }
    ]
  },
  {  
    label: 'Profile',
    submenu:[
      {
        label: 'Profile(View/Update Profile Page)'
      },
      {
        label: 'Messenger'
      },
      {
        label: 'LogOut',
        click(){
          const mainMenu = Menu.buildFromTemplate(loginMenuTemplate);
          Menu.setApplicationMenu(mainMenu);
        }
      }
    ]  
  },
  {
    label: 'Market Place',
    submenu:[
      {
        label: 'Find ADV(Find Advocates who is register with US)'
      },
      {
        label: 'Post Job'
      },
      {
        label: 'View Jobs (View Jobs posted by user or jobs which is taken by user)'
      }
    ]
  }
];

const loginMenuTemplate = [
  // Each object is a dropdown
  {
    label: 'File',
    submenu: [
      {
        label: 'New  Client'
      },
      {
        label: 'Client Master / Open Client File'
      },
      {
        label: 'Invoice'
      },
      {
        label: 'Exit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Drafts',
    submenu:[
      {
        label: 'New Blank Draft',
        click() { 
          mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'Pages/font-converter.html'),
            protocol: 'file:',
            slashes: true
          }));
        }
      },
      {
        label: 'Open Draft',
        click(){
          dialog.showOpenDialog({
            properties: ['openFile'],
            defaultPath:resourcesPath + "/Draft",
            filters: [
              {name: "Drafts", extensions: ["adraft"]},
            ]
          }, function (files) {
              if (files !== undefined) {
                global.sharedObj.filePath = files[0]; 
                mainWindow.loadURL(url.format({
                  pathname: path.join(__dirname, 'Pages/font-converter.html'),
                  protocol: 'file:',
                  slashes: true
                }));
              }  
          });
        }
      },
      {
        label: 'Upload Draft'
      }
    ]
  },
  {
    label: 'Backup-Restore',
    submenu:[
      {
        label: 'Backup'
      },
      {
        label: 'Restore'
      }
    ]
  },
  {
    label: 'Convertor',
    submenu:[
      {
        label: 'Font Convertor'
      },
      {
        label: 'Text - PDF Convertor'
      },
      {
        label: 'PDF - Text Convertor'
      }
    ]
  },
  {
    label: 'View',
    submenu:[
      {
        label: 'To-Do List'
      },
      {
        label: 'Birth Date Reminder'
      }
    ]
  }, 
  {
    label: 'External/Links',
    submenu:[
      {
        label: 'Manage Links'
      },
      {
        label: 'Open Links'
      }
    ]
  },
  {
    label: 'Windows',
    submenu:[
      {
        label: 'Keyboard (Select Keyboard Type)'
      },
      {
        label: 'Font (Select Font)',
        submenu:[
          {
            label: 'English',
            click() {
              mainWindow.webContents.send('fontFamily','Arial');
            } 
          },
          {
            label: 'Gujarati Saral 1',
            click() {  
              mainWindow.webContents.send('fontFamily','gujarati-saral-1');
            } 
          },
          {
            label: 'Gujarati Saral 2',
            click() {
              mainWindow.webContents.send('fontFamily','gujarati-saral-2');
            } 
          }, 
          {
            label: 'BA MART',
            click() {
              mainWindow.webContents.send('fontFamily','bamart');
            } 
          },
          {
            label: 'BA MART B',
            click() {
              mainWindow.webContents.send('fontFamily','bamartb');
            } 
          }
        ]
      }, 
      {
        label: 'Update Software (Optional)'
      }
    ]
  },
  { 
    label: 'Login',
    click(){
      var popupWindow = new BrowserWindow({
        show:false, 
        parent:mainWindow,
        width: 400,
        height: 295
        ,minimizable: false,
        maximizable: false, 
      }); 
      popupWindow.setMenu(null);
      const filePath = url.format({
        pathname: path.join(__dirname, 'Modal/login.html'),
        protocol: 'file:',
        slashes: true
    })
      popupWindow.loadURL(filePath);
      popupWindow.show(); 
    } 
  },
  {
    label: 'Market Place',
    submenu:[
      {
        label: 'Find ADV(Find Advocates who is register with US)'
      },
      {
        label: 'Post Job'
      },
      {
        label: 'View Jobs (View Jobs posted by user or jobs which is taken by user)'
      }
    ]
  }
];

// If OSX, add empty object to menu
if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
  loginMenuTemplate.unshift({});
}

// Add developer tools option if in dev
if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
  loginMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}


