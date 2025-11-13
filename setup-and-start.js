const { exec, spawn } = require('child_process');
const os = require('os');
const path = require('path');

console.log("🚀 Setup & Start Angular + NestJS");

function installDependencies(folder) {
    const pkgPath = path.join(__dirname, folder, 'package.json');
    const fs = require('fs');
    if (fs.existsSync(pkgPath)) {
        console.log(`📦 Installation des packages dans ${folder}...`);
        exec('npm install', { cwd: path.join(__dirname, folder) }, (err, stdout, stderr) => {
            if (err) console.error(err);
            else console.log(stdout);
        });
    } else {
        console.log(`⚠️ Aucun package.json trouvé dans ${folder}`);
    }
}

installDependencies('backend');
installDependencies('frontend');

function startServer(folder, command) {
    const cwd = path.join(__dirname, folder);
    const isWindows = os.platform() === 'win32';
    console.log(`🚀 Démarrage de ${folder}...`);

    if (isWindows) {
        spawn(command, { cwd, shell: true, stdio: 'inherit' });
    } else {
        spawn(command, { cwd, shell: true, stdio: 'inherit' });
    }
}

startServer('backend', 'npm run start:dev');

startServer('frontend', 'ng serve');

console.log("✅ Backend et Frontend en cours d'exécution !");
