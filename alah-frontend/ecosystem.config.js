module.exports = {
  apps: [
    {
      name: 'alah-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: '/home/user/webapp/alah-frontend',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        HOSTNAME: '0.0.0.0'
      },
      watch: false,
      ignore_watch: ['node_modules', '.next', '.git'],
      max_memory_restart: '1G',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};