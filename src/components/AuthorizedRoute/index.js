import React, { PureComponent } from 'react';
import Cookie from 'js-cookie';
import { Route, Redirect } from 'dva/router';
import { connect } from 'dva';

@connect(({ global }) => ({
  pollutanttype: global.pollutanttype,
}))

export default class extends PureComponent {
  render() {
    const { component: Component, pollutanttype, ...rest } = this.props;
    const usertoken = Cookie.get('token');
    return (
      <Route
        {...rest}
        render={
                (props) => {
                    if (usertoken && usertoken != null && usertoken !== '' && pollutanttype.length !== 0) {
                        return <Component {...props} />;
                    } else {
                        return <Redirect to="/user/login" />;
                    }
                }
            }
      />
    );
  }
}
