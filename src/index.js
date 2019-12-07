/* eslint-disable import/prefer-default-export */
import request from 'reqwest';
import { now, refreshNow } from '@senntyou/utils';

const defaultOptions = {
  // 服务器域名配置
  server: '',
  // 最大上报错误个数
  maxReports: 50,
  // 每隔多久检查一次是否有错误需要上报（毫秒）
  checkInterval: 10000,
};

let realOptions = { ...defaultOptions };

// 已上报错误个数
let reportedCount = 0;
// 上报记录
const logs = [];

let interval;
let errorOccurred = !1;

const report = () => {
  if (reportedCount >= realOptions.maxReports) {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    return;
  }
  if (!logs.length) return;

  const logsToReport = [];
  while (logs.length) {
    logsToReport.push(logs.shift());
    reportedCount += 1;
    if (reportedCount >= realOptions.maxReports) {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      break;
    }
  }

  request({
    url: `${realOptions.server}/api/sdk/jsError/createMulti`,
    method: 'post',
    type: 'json',
    contentType: 'application/json',
    data: JSON.stringify(logsToReport),
    success() {},
    error() {
      console.log('@senntyou/web-monitor-sdk: 上报 JS 报错信息失败');
    },
  });
};

export const init = (options = {}) => {
  realOptions = { ...defaultOptions, ...options };

  window.onerror = (message, source, line, column, error) => {
    refreshNow();

    logs.push({
      href: window.location.href,
      userAgent: window.navigator.userAgent,
      cookie: window.document.cookie,
      message,
      source,
      line,
      column,
      error: error ? error.message : '',
      stack: error ? error.stack : '',
      time: now.dateTime,
    });

    if (!errorOccurred) {
      errorOccurred = !0;
      // 每隔10秒检查一次
      interval = setInterval(report, realOptions.checkInterval);
      report();
    }
  };
};
