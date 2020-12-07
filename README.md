# web-monitor-sdk

前端监控系统 JS SDK.

```
import { init } from '@senntyou/web-monitor-sdk';

init({server, maxReports, checkInterval});
```

- `server`: `String` `default: ''` 服务器域名配置
- `maxReports`: `Number` `default: 50` 最大上报错误个数
- `checkInterval`: `Number` `default: 10000` 每隔多久检查一次是否有错误需要上报（毫秒）

```
import { reportError } from '@senntyou/web-monitor-sdk';

// 手动上报错误
new Promise(resolve => {
  console.log(lala.lele);
  resolve(1);
}).catch(error => {
  console.error(error);
  reportError(error);
});
```
