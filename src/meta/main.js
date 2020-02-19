const electron = require('electron');
const { app , Menu , nativeImage, dialog, shell } = electron;  // Module to control application life.
const { BrowserWindow }  = electron;  
const path = require('path');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';


let  win;
function createWindow()
{
    win = new BrowserWindow( { width:300,minWidth:230,height:350,resizable:true,frame:false,transparent: true, hasShadow: false, alwaysOnTop:true, webPreferences: {
        experimentalFeatures: true,
        nodeIntegration: true,
        webSecurity: false,
        movable:true
      } } );
    //  win.loadURL( `file://${__dirname}/index.html` );
    win.loadURL( ` http://localhost:3000/` );
    //win.webContents.openDevTools()
     win.on( 'close' , (e)=>
    {
       win = null;
        // if(window.confirm( "确定关闭编辑器？" )) win=null;
    }  
    );

    win.webContents.on("new-window", function(event, url) 
    {
        event.preventDefault();
        shell.openExternal(url);
    });
    
}

app.on( 'ready' , ()=>{
    createWindow();
});

// app.commandLine.appendSwitch('js-flags', '--max-old-space-size=40960');
app.on('window-all-closed', () => {
    app.quit()
})