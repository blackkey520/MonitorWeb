// import liraries
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { List, Avatar, Button, Spin, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import reqwest from 'reqwest';
import { post, get, geturl } from '../../dvapack/request';
import Cookie from 'js-cookie';
import * as common from '../../utils/utils';
import styles from './index.less';


// const fakeDataUrl = '/api/rest/AlarmDealInfoApi/GetAllExceptionInfo';
const fakeDataUrl = '/api/rest/AtmosphereApi/AlarmData/GetAlarmHistoryList';
const SCREEN_HEIGHT = document.querySelector('body').offsetHeight;
const SCREEN_WIDTH = document.querySelector('body').offsetWidth;

let DGIMN1;
let datenow1;

/* @connect(({ alarm }) => ({
  alarmdata: alarm.data,
})) */
class MessageDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loadingMore: false,
      showLoadingMore: false,
      data: [],
      modalHeight: SCREEN_HEIGHT * 0.6,
      pageindex: 1,
      pagesize: 1
    }
  }
  modifyMessageDetailStateData = (DGIMN, datenow) => {
    DGIMN1=DGIMN;
    datenow1=datenow;
    this.setState({
      pageindex: 1
    });
    this.getData((res) => {
      this.setState({
        loading: false,
        data: res.data,
      });
      this.setState({
        showLoadingMore: res.total > this.state.data.length ? true : false,
      });
    }, DGIMN, datenow,1);
  }
  getData = (callback, DGIMN, datenow,pageindex) => {
    //每次查询之前让其加载中
    this.setState({
      loading: true
    });

    let account = "";
    const response = Cookie.get('token');
    if (response) {
      const user = JSON.parse(response);
      account = user.User_ID;
    }
    let starttime = datenow;
    let endtime = common.getTimeDistance("today");

    let payload={ authorCode: account, DGIMN: DGIMN, pageIndex: pageindex, pageSize: this.state.pagesize, beginTime: starttime, endTime: endtime };
    reqwest({
      url: fakeDataUrl+"?authorCode="+account,
      type: 'json',
      method: 'POST',
      data: JSON.stringify(payload),
      contentType: 'application/json; charset=utf-8',
      //crossOrigin: true,
      success: (res) => {
        if (res.data) {
          callback(res); 
        }
      },
    });
  }
  onLoadMore = () => {
    this.setState({
      loadingMore: true,
      pageindex: this.state.pageindex+1
    });
    
    this.getData((res) => {
      const data = this.state.data.concat(res.data);
      this.setState({
        data,
        loading: false,
        loadingMore: false,
        showLoadingMore: res.total > data.length ? true : false,
      }, () => {
        // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
        // In real scene, you can using public method of react-virtualized:
        // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
        window.dispatchEvent(new Event('resize'));
        let modalHeight = this.state.modalHeight + 100 * res.data.length;
        this.setState({ modalHeight });
      });
    }, DGIMN1, datenow1, this.state.pageindex + 1);
  }
  render() {
    const { loading, loadingMore, showLoadingMore, data } = this.state;
    const loadMore = showLoadingMore ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {/* loadingMore && <Spin /> */}
        {!loadingMore && <Button onClick={this.onLoadMore}>加载更多</Button>}
      </div>
    ) : null;
    return (
      <Modal
      visible={this.props.showdetail}
      title={this.props.detailtitle !== null ? `${this.props.detailtitle }` : '详细信息'}
      //wrapClassName={styles["vertical-center-modal"]}
      width={SCREEN_WIDTH * 0.45}
      onCancel={() => {
        this.props.transfershowdetail({showdetail:false});
      }}
      footer={null}
    >
        <Spin spinning={loading}>
          <div
            style={{
              width: '100%',
              height: this.state.modalHeight
            }}
          >
            <List
              className={styles["demo-loadmore-list"]}
              itemLayout="horizontal"
              loadMore={loadMore}
              dataSource={data}
              renderItem={item => (
                <List.Item /* actions={[<a>更多</a>]}*/>
                  <List.Item.Meta
                    /* avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />} */
                    title={item.AlarmType === 0 ? "异常" + item.AlarmCount + "次" : "超标" + item.AlarmCount + "次"}
                    description={item.AlarmMsg}
                  />
                </List.Item>
              )}
            />
          </div>
        </Spin>
    </Modal>
    );
  }
}
export default MessageDetail;
