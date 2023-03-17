module.exports = {
  apps: [
    {
      name: 'MMGCApp',
      port: '3000',
      exec_mode: 'cluster',
      instances: 1,
      script: '.output/server/index.mjs',
      min_uptime: '60s', // 应用运行少于时间被认为是异常启动
      max_restarts: 30, // 最大异常重启次数，即小于min_uptime运行时间重启次数；
      autorestart: true, // 默认为true, 发生异常的情况下自动重启
      cron_restart: '', // crontab时间格式重启应用，目前只支持cluster模式;
      restart_delay: 60, // 异常重启情况下，延时重启时间
      env_production: {
        NODE_ENV: 'production' // process.env.REMOTE_ADDR
      },
      env_dev: {
        NODE_ENV: 'development'
      }
    }
  ]
}
