import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';

const CONFIG = {
  sshHost: 'root@168.181.184.103',
  sshPort: '5932',
  remotePath: '/home/datamaq/public_html/wp-content/themes/blocksy-child-datamaq/assets/css/',
  inputCss: 'src/styles/tailwind.css',
  outputCss: 'dist/tailwind-dist.css'
};

function main() {
  console.log('🚀 Iniciando sincronización de estilos Tailwind v4...');

  try {
    // 1. Asegurar directorio dist local
    if (!existsSync('dist')) {
      mkdirSync('dist');
    }

    // 2. Compilar Tailwind v4
    console.log('📦 Compilando Tailwind v4...');
    execSync(`npx @tailwindcss/cli -i ${CONFIG.inputCss} -o ${CONFIG.outputCss}`, { stdio: 'inherit' });

    // 3. Subir al VPS
    console.log('☁️ Subiendo al VPS...');
    execSync(`scp -P ${CONFIG.sshPort} ${CONFIG.outputCss} ${CONFIG.sshHost}:${CONFIG.remotePath}`, { stdio: 'inherit' });

    console.log('✅ Sincronización completada con éxito.');
  } catch (error) {
    console.error('❌ Error durante la sincronización:', error.message);
    process.exit(1);
  }
}

main();
