import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.resolve(__dirname, '../prisma/schema.prisma');

const dbUrl = process.env.DATABASE_URL || '';

if (fs.existsSync(schemaPath)) {
  let content = fs.readFileSync(schemaPath, 'utf8');
  const isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://');
  const targetProvider = isPostgres ? 'postgresql' : 'sqlite';

  const providerRegex = /provider\s*=\s*"(sqlite|postgresql)"/;
  const match = content.match(providerRegex);

  if (match && match[1] !== targetProvider) {
    console.log(`🔄 [Taasha DB Prep] Switching Prisma provider from '${match[1]}' to '${targetProvider}' for deployment...`);
    content = content.replace(providerRegex, `provider = "${targetProvider}"`);
    fs.writeFileSync(schemaPath, content, 'utf8');
    console.log(`✅ [Taasha DB Prep] schema.prisma configured with provider = "${targetProvider}".`);
  } else {
    console.log(`✅ [Taasha DB Prep] schema.prisma provider is already '${targetProvider}'.`);
  }
}
