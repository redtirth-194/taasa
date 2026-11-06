import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import app from '../SERVER/src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

// Verify CMS dist is ready
const cmsDistPath = path.resolve(__dirname, '../CMS/dist');
if (!fs.existsSync(path.join(cmsDistPath, 'index.html'))) {
  console.error('❌ CMS/dist is missing! Please run "npm run build" first.');
  process.exit(1);
}

const server = app.listen(PORT, async () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🌸 TAASA LUXURY COUTURE - LIVE FULLSTACK SERVER ONLINE`);
  console.log(`🏠 Local URL:   http://localhost:${PORT}`);
  console.log(`⚡ API Health:  http://localhost:${PORT}/api/health`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🌐 Establishing secure public live URL for client testing...');

  let publicUrl = null;

  // Attempt 1: Cloudflare Quick Tunnel (via untun)
  try {
    const { startTunnel } = await import('untun');
    const tunnel = await startTunnel({ port: PORT });
    if (tunnel) {
      publicUrl = await tunnel.getURL();
      console.log('✨ Cloudflare Tunnel connected successfully!');
    }
  } catch (cfErr) {
    console.warn('⚠️ Cloudflare quick tunnel note:', cfErr.message || cfErr);
  }

  // Attempt 2: LocalTunnel Fallback
  if (!publicUrl) {
    try {
      console.log('🔄 Connecting via fallback secure public tunnel...');
      const localtunnel = (await import('localtunnel')).default;
      const sub = `taasa-couture-${Math.floor(1000 + Math.random() * 9000)}`;
      const tunnel = await localtunnel({ port: PORT, subdomain: sub });
      publicUrl = tunnel.url;
      console.log('✨ LocalTunnel connected successfully!');
    } catch (ltErr) {
      console.error('❌ Tunnel connection error:', ltErr.message || ltErr);
    }
  }

  if (publicUrl) {
    console.log('\n=============================================================');
    console.log(`🚀 CLIENT DEMO LIVE URL (SHARE THIS LINK WITH YOUR CLIENT):`);
    console.log(`👉 ${publicUrl}`);
    console.log(`🔑 Admin Studio: ${publicUrl}/admin (Zero login friction)`);
    console.log(`🛍️ Catalog:      ${publicUrl}/collections/kurtis`);
    console.log('=============================================================\n');
    console.log('✨ The live server is ready! Client can add products, update');
    console.log('   orders, test categories & subcategories in real time.');
  } else {
    console.log(`\n⚠️ Public tunnel could not be initialized automatically.`);
    console.log(`   Local server is running perfectly at http://localhost:${PORT}`);
  }
});

process.on('SIGINT', () => {
  console.log('\n🌸 Shutting down Taasa live server...');
  server.close(() => process.exit(0));
});
