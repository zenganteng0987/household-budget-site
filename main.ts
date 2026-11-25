// DompetKeluarga — entry for best-household-budget-site-20261126-1457 (Node 22, stdlib only).
// The site is plain static files in app/ (index.html + modules, no build step, no network).
// This program hands it in: copy app/ and screenshots/ beside this file into /output
// (or MAKEFUN_OUTPUT_DIR outside the grader) and write /output/dossier.json with the
// vendored make.fun library. Leave vendor/makefun-frontend.ts untouched: the scorer
// rebuilds the dossier with its own copy and compares byte for byte.
//
// Serve locally with a static server over app/, e.g. `npx serve app`, then open it.
// Grader-style check: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Same caps the scorer enforces: at most 4 screenshots, 256 KiB each; app/ at most
// 993 files and directories and 16 MiB; dossier text capped at 160 KiB.
// The output is deterministic: no timestamps, no random values, so two runs write
// byte-identical files.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
