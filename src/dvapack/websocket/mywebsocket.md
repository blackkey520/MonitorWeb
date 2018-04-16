## mywebsocket 工具类

对`websocket`使用的封装

##说明

  - config.webSocketPushURL：联网程序配置的websocket地址
  - user.User_Account：当前登录人的账号


## 使用

全局监听websocket消息

- data：监听到的socket包信息
- saveFeed：接收到消息后续的effect操作

默认配置如下:

```javascript
import * as service from '../dvapack/websocket/mywebsocket';

subscriptions: {
    feedSubscriber({dispatch}) {
      return service.listen((data) => {
        dispatch({type: 'saveFeed', payload: {
            data
          }});
      });
    }
}

```
