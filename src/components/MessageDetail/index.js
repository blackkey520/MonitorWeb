// import liraries
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Tabs, DatePicker, Select, Table } from 'antd';
import { List, Avatar, Button, Spin } from 'antd';
import { routerRedux } from 'dva/router';
import reqwest from 'reqwest';
import { post,get,geturl } from '../../dvapack/request';
import Cookie from 'js-cookie';
import * as common from '../../utils/utils';
import styles from './index.less';


const fakeDataUrl = '/api/rest/AlarmDealInfoApi/GetAllExceptionInfo';
const SCREEN_HEIGHT = document.querySelector('body').offsetHeight;
const SCREEN_WIDTH = document.querySelector('body').offsetWidth;


class MessageDetail extends PureComponent {  
constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loadingMore: false,
      showLoadingMore: false,
      data: [],
      modalHeight:SCREEN_HEIGHT*0.5,
      pageindex: 1, 
      pagesize:5
    }
  }
  componentDidMount() {
    this.getData((res) => {
      this.setState({
        loading: false,
        data: res.data,
      });
      this.setState({        
        showLoadingMore:res.total>this.state.data.length?true:false,
      });
    });
  }
  getData = (callback) => {
    
    let account = "";
    const response = Cookie.get('token');
    if (response) {        
      const user=JSON.parse(response);
      account=user.User_ID;
    }
    let starttime=this.props.datenow;
    let endtime=common.getTimeDistance("today");
    

    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      data: { authorCode: account, dgimn: this.props.DGIMN, pageindex: this.state.pageindex, pagesize: this.state.pagesize, starttime: starttime, endtime: endtime },
      contentType: 'application/json',
      crossOrigin: true,
      success: (res) => {
        callback(res);
      },
    });
  }
  onLoadMore = () => {
    this.setState({
      loadingMore: true,
      pageindex:this.state.pageindex+1
    });
    this.getData((res) => {
      const data = this.state.data.concat(res.data);
      this.setState({
        data,
        loadingMore: false,
      }, () => {
        // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
        // In real scene, you can using public method of react-virtualized:
        // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
        window.dispatchEvent(new Event('resize'));
        let height=this.state.modalHeight+100*res.data.length;
        this.setState({
          modalHeight:height
        });
      });
    });
  }
  render() {
    const { loading, loadingMore, showLoadingMore, data } = this.state;
    const loadMore = showLoadingMore ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {loadingMore && <Spin />}
        {!loadingMore && <Button onClick={this.onLoadMore}>加载更多</Button>}
      </div>
    ) : null;
    return (
      <div
        style={{
          width: '100%',
          height: this.state.modalHeight
        }}
      >
        <List
          className={styles["demo-loadmore-list"]}
          loading={loading}
          itemLayout="horizontal"
          loadMore={loadMore}
          dataSource={data}
          renderItem={item => (
            <List.Item /* actions={[<a>更多</a>]}*/> 
              <List.Item.Meta
                /* avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />} */
                title={ item.AlarmType === 0 ? "异常" + item.AlarmCount + "次" : "超标" + item.AlarmCount + "次" }
                description={item.AlarmMsg}
              />              
            </List.Item>
          )}
        />
      </div>
    );
  }
}
export default MessageDetail;
