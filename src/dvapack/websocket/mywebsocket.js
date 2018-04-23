// import config from '../../config';
// import Cookie from 'js-cookie';

// //cg add 2018.4.1
// const ws = new WebSocket('ws://' + config.webSocketPushURL + '/');

// export function listen(cb) {
//   ws.onopen = event => {
//     console.log('connected');
//     const response = Cookie.get('token');
//     if (response) {        
//         const user = JSON.parse(response);
//         if(user)
//           ws.send(user.User_Account);          
//     }
//   };

//   ws.onclose = event => {
//     console.log('disconnected');
//   };

//   ws.onerror = event => {
//     console.log(event.data);
//   };

//   ws.onmessage = event => {
//     console.log(`Roundtrip time: ${Date.now() - event.data} ms`);

    // setTimeout(() => {
    //     const response = Cookie.get('token');
    //     if (response) {        
    //         const user = JSON.parse(response);
    //         if(user)
    //           ws.send(user.User_Account);
    //     }
    // }, 30000);

//     cb(event.data);
//   };
// }
