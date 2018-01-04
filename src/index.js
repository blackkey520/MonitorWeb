import { message } from 'antd';
import dva from 'dva';
import createLoading from 'dva-loading';
import { persistStore, autoRehydrate } from 'redux-persist';
import createHistory from 'history/createBrowserHistory';
import { createLogger } from 'redux-logger';

import 'babel-polyfill';
import 'moment/locale/zh-cn';
import './g2';
import './rollbar';

import './index.less';

// 1. Initialize
const app = dva({
  extraEnhancers: [autoRehydrate()],
  ...createLoading({ effects: true }),
  history: createHistory(),
  onAction: createLogger(),
  onError(error) {
    message.error(error.message);
  },
});

// 2. Plugins
// app.use({});

// 3. Register global model
app.model(require('./models/global'));
// 4. Router
app.router(require('./router'));
// 5. Start
app.start('#root');
persistStore(app._store);
