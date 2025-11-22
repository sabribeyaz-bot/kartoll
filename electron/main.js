const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  // Tarayıcı penceresini oluştur
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'icon.png'), // Varsa ikon yolu
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true, // Üst menüyü gizle (daha temiz görünüm)
    backgroundColor: '#0f172a' // Uygulama açılana kadar görünecek renk
  });

  // Uygulama production modunda ise build edilmiş dosyayı yükle
  // Development modunda ise localhost'u yükle (Bunu package.json scriptleri ile yönetebilirsin)
  // Varsayılan olarak dist/index.html'i yükleyecek şekilde ayarlıyoruz.
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});