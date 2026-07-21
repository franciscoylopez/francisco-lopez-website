const path = require('path');
const fs = require('fs');
const { processLogo } = require('./process_logo');

// Carpeta de origen de los .webp. Sobreescribible: LOGOS_SRC=... node batch_process.js
const SRC = process.env.LOGOS_SRC || "C:/Users/franc/Desktop/Logos Web";
const OUT = path.join(__dirname, '..', '..', 'public', 'logos');

const jobs = [
  // Tools
  { src: `${SRC}/Tools/Amplitude.webp`, out: 'tools', name: 'amplitude' },
  { src: `${SRC}/Tools/Claude desing.webp`, out: 'tools', name: 'claude-design' },
  { src: `${SRC}/Tools/claudecode.webp`, out: 'tools', name: 'claude-code' },
  { src: `${SRC}/Tools/Figma.webp`, out: 'tools', name: 'figma' },
  { src: `${SRC}/Tools/GitHub.webp`, out: 'tools', name: 'github' },
  { src: `${SRC}/Tools/Google Analytics.webp`, out: 'tools', name: 'google-analytics' },
  { src: `${SRC}/Tools/Jira Logo.webp`, out: 'tools', name: 'jira' },
  { src: `${SRC}/Tools/mermaid.webp`, out: 'tools', name: 'mermaid' },
  { src: `${SRC}/Tools/Microsoft-Clarity.webp`, out: 'tools', name: 'microsoft-clarity' },
  { src: `${SRC}/Tools/Miro.webp`, out: 'tools', name: 'miro' },
  { src: `${SRC}/Tools/notion.webp`, out: 'tools', name: 'notion' },
  { src: `${SRC}/Tools/Typeform.webp`, out: 'tools', name: 'typeform' },
  { src: `${SRC}/Tools/V0-Logo.webp`, out: 'tools', name: 'v0' },
  { src: `${SRC}/Tools/vercel.webp`, out: 'tools', name: 'vercel' },
  { src: `${SRC}/Tools/VS Code.webp`, out: 'tools', name: 'vscode' },
  // Empresas (Trayectoria) - havas/increnta skipped, that row keeps generic icon
  { src: `${SRC}/Empresas/emendu_logo.webp`, out: 'companies', name: 'emendu' },
  { src: `${SRC}/Empresas/Freepick.webp`, out: 'companies', name: 'freepik' },
  { src: `${SRC}/Empresas/indya.webp`, out: 'companies', name: 'indya' },
  { src: `${SRC}/Empresas/Kuotip.webp`, out: 'companies', name: 'kuotip' },
  { src: `${SRC}/Empresas/Ontecnia.webp`, out: 'companies', name: 'ontecnia' },
  { src: `${SRC}/Empresas/PickASO.webp`, out: 'companies', name: 'pickaso' },
  { src: `${SRC}/Empresas/TheTool.webp`, out: 'companies', name: 'thetool' },
  // Formacion
  { src: `${SRC}/Formacion/Esic Logo.webp`, out: 'education', name: 'esic' },
  { src: `${SRC}/Formacion/OleaEuropea.webp`, out: 'education', name: 'olea-europea' },
  { src: `${SRC}/Formacion/TheHeroCamp.webp`, out: 'education', name: 'the-hero-camp' },
  { src: `${SRC}/Formacion/theUncoding.webp`, out: 'education', name: 'the-uncoding' },
];

(async () => {
  for (const dir of ['tools', 'companies', 'education']) {
    fs.mkdirSync(path.join(OUT, dir), { recursive: true });
  }
  const failures = [];
  for (const job of jobs) {
    const outDir = path.join(OUT, job.out);
    try {
      await processLogo(job.src, outDir, job.name);
    } catch (e) {
      console.error('FAILED', job.src, e.message);
      failures.push(job.name);
    }
  }
  console.log('---');
  console.log(failures.length ? `Failures: ${failures.join(', ')}` : 'All processed OK');
})();
