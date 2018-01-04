import React, { Component } from 'react';
import { Route, Redirect } from 'dva/router';
import { connect } from 'dva';

@connect(({ global }) => ({
  pollutanttype: global.pollutanttype,
}))

export default class extends Component {
  render() {
    const { component: Component, pollutanttype, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={
                (props) => {
                    if (true)
                    {
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
