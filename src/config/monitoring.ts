export const monitoringConfig = {
  metrics: {
    collection: {
      interval: 60000, // Collect metrics every minute
      retention: 7 * 24 * 60 * 60 * 1000 // Keep 7 days of metrics
    },
    
    thresholds: {
      error: {
        rate: 0.05, // Alert if error rate exceeds 5%
        count: 100  // Alert if more than 100 errors in interval
      },
      latency: {
        p95: 1000,  // 95th percentile should be under 1s
        p99: 2000   // 99th percentile should be under 2s
      },
      memory: {
        usage: 0.85 // Alert if memory usage exceeds 85%
      }
    }
  },

  alerts: {
    channels: {
      email: ['admin@raidrally.xyz'],
      discord: import.meta.env.VITE_DISCORD_WEBHOOK_URL,
      slack: import.meta.env.VITE_SLACK_WEBHOOK_URL
    },
    
    cooldown: {
      similar: 300000,  // 5 minutes between similar alerts
      general: 60000    // 1 minute between any alerts
    },
    
    levels: {
      info: {
        color: '#3498db',
        notify: false
      },
      warning: {
        color: '#f1c40f',
        notify: true
      },
      error: {
        color: '#e74c3c',
        notify: true
      },
      critical: {
        color: '#c0392b',
        notify: true,
        escalate: true
      }
    }
  },

  logging: {
    level: import.meta.env.PROD ? 'info' : 'debug',
    format: 'json',
    
    retention: {
      error: 30,  // Keep error logs for 30 days
      info: 7,    // Keep info logs for 7 days
      debug: 1    // Keep debug logs for 1 day
    },
    
    sensitive: {
      fields: ['password', 'token', 'key', 'secret'],
      replacement: '[REDACTED]'
    }
  }
};