const electron = require('electron');
const path = require('path');
const url = require('url');
const ipc = require('electron').ipcRenderer;
const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow; 
// SET ENV
process.env.NODE_ENV = 'development';
// Listen for app to be ready
app.on('ready', function () {
  mainWindow = new BrowserWindow({});
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
  const mainMenu = Menu.buildFromTemplate(loginMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu); 
});

ipcMain.on('login', function() { 
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate); 
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
        label: 'New Blank Draft'
      },
      {
        label: 'Open Draft'
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
        label: 'Font Convertor',
        click() {
          mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'Pages/font-converter.html'),
            protocol: 'file:',
            slashes: true
          }));
        }
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
        label: 'New Blank Draft'
      },
      {
        label: 'Open Draft'
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
        label: 'Font Convertor',
        click() {
          mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'Pages/font-converter.html'),
            protocol: 'file:',
            slashes: true
          }));
        }
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
      const filePath = path.join(
                              'file://', 
                              process.cwd(), 
                              'Modal/login.html'
                          );
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


