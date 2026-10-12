const {app,BrowserWindow,Menu}=require('electron');
const path=require('node:path');
let win;
if(!app.requestSingleInstanceLock())app.quit();
else {
 app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.focus();}});
 app.whenReady().then(()=>{
  Menu.setApplicationMenu(null);
  win=new BrowserWindow({width:1360,height:900,minWidth:390,minHeight:600,title:'末日纵深 · Doomsday Depths',backgroundColor:'#ecece4',webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true}});
  win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
  win.webContents.on('will-navigate',(event,url)=>{if(url!==win.webContents.getURL())event.preventDefault();});
  win.webContents.session.on('will-download',(_event,item)=>{item.setSaveDialogOptions({title:'导出末日纵深存档',defaultPath:'Doomsday-Depths-save.json'});});
  win.loadFile(path.join(__dirname,'../dist/index.html'));
 });
 app.on('window-all-closed',()=>app.quit());
}
