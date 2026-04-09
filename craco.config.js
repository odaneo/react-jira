/* eslint-disable @typescript-eslint/no-var-requires */
const CracoLessPlugin = require('craco-less')

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#2563EB',
              '@link-color': '#2563EB',
              '@success-color': '#22C55E',
              '@warning-color': '#F59E0B',
              '@error-color': '#EF4444',
              '@border-color-base': '#E2E8F0',
              '@component-background': '#FFFFFF',
              '@body-background': '#F8FAFC',
              '@text-color': '#1E293B',
              '@text-color-secondary': '#475569',
              '@font-family':
                "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans CJK SC', 'Source Han Sans SC', 'WenQuanYi Micro Hei', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              '@font-size-base': '16px'
            },
            javascriptEnabled: true
          }
        }
      }
    }
  ]
}
