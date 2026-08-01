import { rm, mkdir, cp } from 'fs/promises';

const outDir = 'dist';

try {
  await rm(outDir, { recursive: true, force: true });
} catch {
  // ignore
}

await mkdir(outDir, { recursive: true });
await cp('src', `${outDir}/src`, { recursive: true });
await cp('package.json', `${outDir}/package.json`);
await cp('prisma', `${outDir}/prisma`, { recursive: true });

console.log(`Built app to ./${outDir}`);
