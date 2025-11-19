// This script configures Node.js to accept self-signed certificates for development
// It then starts the Next.js dev server

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.log('⚠️  SSL certificate validation disabled for development');
  console.log('⚠️  This is for development only - never use in production!');
  console.log('');
}

// Start Next.js dev server
const { spawn } = require('child_process');
const next = spawn('next', ['dev'], { stdio: 'inherit', shell: true });

next.on('close', (code) => {
  process.exit(code);
});

