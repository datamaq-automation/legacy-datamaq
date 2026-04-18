import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';

const CONFIG = {
  sshHost: 'root@168.181.184.103',
  sshPort: '5932',
  remoteThemePath: '/home/datamaq/public_html/wp-content/themes/blocksy-child-datamaq/',
  localThemePath: 'wordpress-theme/',
  inputCss: 'src/styles/tailwind.css',
  outputCss: 'dist/tailwind-dist.css',
  phpFiles: ['functions.php', 'header.php', 'footer.php', 'front-page.php', 'style.css', 'learnpress-overrides.css']
};

function main() {
  const timestamp = new Date().toLocaleString();
  console.log(`🚀 Iniciando sincronización integral: ${timestamp}`);

  try {
    // 1. Asegurar directorio dist local
    if (!existsSync('dist')) {
      mkdirSync('dist');
    }

    // 2. Compilar Tailwind v4
    console.log('📦 Compilando Tailwind v4...');
    execSync(`npx @tailwindcss/cli -i ${CONFIG.inputCss} -o ${CONFIG.outputCss}`, { stdio: 'inherit' });

    // 3. Subir archivos al VPS
    console.log('☁️ Subiendo archivos al VPS...');
    
    // Subir CSS
    execSync(`scp -P ${CONFIG.sshPort} ${CONFIG.outputCss} ${CONFIG.sshHost}:${CONFIG.remoteThemePath}assets/css/`, { stdio: 'inherit' });
    
    // Subir PHPs Raíz
    for (const file of CONFIG.phpFiles) {
      if (existsSync(CONFIG.localThemePath + file)) {
        execSync(`scp -P ${CONFIG.sshPort} ${CONFIG.localThemePath}${file} ${CONFIG.sshHost}:${CONFIG.remoteThemePath}`, { stdio: 'inherit' });
      }
    }

    // Subir Directorios Modulares (Certeza SOLID)
    console.log('📁 Sincronizando directorios modulares (inc, template-parts)...');
    execSync(`ssh -p ${CONFIG.sshPort} ${CONFIG.sshHost} "mkdir -p ${CONFIG.remoteThemePath}inc ${CONFIG.remoteThemePath}template-parts"`, { stdio: 'inherit' });
    execSync(`scp -P ${CONFIG.sshPort} -r ${CONFIG.localThemePath}inc/*.php ${CONFIG.sshHost}:${CONFIG.remoteThemePath}inc/`, { stdio: 'inherit' });
    execSync(`scp -P ${CONFIG.sshPort} -r ${CONFIG.localThemePath}template-parts/*.php ${CONFIG.sshHost}:${CONFIG.remoteThemePath}template-parts/`, { stdio: 'inherit' });

    // 4. Operaciones Remotas (Purga + Git Commit)
    console.log('🔧 Ejecutando operaciones remotas (Purga + Git Commit)...');
    const remoteCommands = [
      `rm -rf /home/datamaq/public_html/wp-content/cache/supercache/*`,
      `cd /home/datamaq/public_html && git add wp-content/themes/blocksy-child-datamaq/ && (git diff-index --quiet HEAD || git commit -m 'Auto-sync from local: ${timestamp}') && git push origin main`
    ];

    execSync(`ssh -p ${CONFIG.sshPort} ${CONFIG.sshHost} "${remoteCommands.join(' && ')}"`, { stdio: 'inherit' });

    console.log('✅ Sincronización y Commit en VPS completados con éxito.');
  } catch (error) {
    console.error('❌ Error durante la sincronización:', error.message);
    process.exit(1);
  }
}

main();
