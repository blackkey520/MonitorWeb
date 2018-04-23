// import liraries
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Map, Markers, InfoWindow } from 'react-amap';
import { Select, Cascader, Input, Card, Spin } from 'antd';
import { routerRedux } from 'dva/router';
import config from '../../config';
import MarkerDetail from '../../components/MarkerDetail';
import styles from './index.less';
import city from '../../utils/city';
import BreadcrumbHeader from '../../components/BreadcrumbHeader';

const Option = Select.Option;
const Search = Input.Search;

const { amapKey, zoom } = config;
const plugins = [
  'MapType',
  'Scale', {
    name: 'ToolBar',
    options: {
      visible: true, // 不设置该属性默认就是 true
      onCreated(ins) {
        console.log(ins);
      },
    },
  },
];

@connect(({ loading, points, global }) => ({
  ...loading,
  pointlist: points.pointlist,
  pollutanttype: global.pollutanttype,
  lastdata: points.lastdata,
  hourtendency: points.hourtendency,
  selectpoint: points.selectpoint,
  pollutant: points.pollutant,
}))
class MonitorDataMap extends PureComponent {
  constructor() {
    super();
    const _this = this;
    this.map = null;
    this.state = {
      position: [0, 0],
      visible: false,
    };
    // this.amapEvents = {
    //   created: (mapInstance) => {
    //     let addInfoWin;
    //     AMap.plugin('AMap.InfoWindow', () => {
    //       addInfoWin = new AMap.InfoWindow({
    //         isCustom: false,
    //       });
    //       // infowindow.open(mapInstance, [116.481488, 39.990464]);
    //       _this.infoWindow = addInfoWin;
    //     });

    //     _this.map = mapInstance;
    //   },
    // };
    this.markerEvents = {
      click: (MapsOption, marker) => {
        const itemdata = marker.F.extData;
        _this.props.dispatch(
          {
            type: 'points/querypointlastdata',
            payload: {
              itemdata,
            },
          }
        );
        _this.setState({
          visible: false,
        });
        _this.setState({
          position: { longitude: itemdata.longitude, latitude: itemdata.latitude },
          visible: true,
        });
        // _this.infoWindow.setContent(`<div class="infowindow-content"><div class="amap-info-header">${itemdata.targetName}-${itemdata.pointName}</div><div class="amap-info-body">test<TipContent/></div></div>`);
        // _this.infoWindow.open(_this.map, [itemdata.longitude, itemdata.latitude]);
      },
    };
  }
  changePollutant=(pollutant) => {
    this.props.dispatch(
      {
        type: 'points/queryhourtendency',
        payload: {
          pollutant,
        },
      }
    );
  }
  render() {
    const markers = [];
    const { location, pollutanttype, effects } = this.props;
    const { payload = {} } = location;
    // const singleStyle = {
    //   url: 'https://avatars1.githubusercontent.com/u/17128499?s=88&v=4',
    //   size: [50, 50],
    // };
    const windowheight = 220 + (this.props.lastdata.length * 15);
    const clusterOptions = {
      zoomOnClick: true,
      gridSize: 30,
      minClusterSize: 3,
      // styles: [singleStyle, singleStyle, singleStyle],
    };
    this.props.pointlist.map((item, key) => {
      markers.push({
        key: item.pointCode,
        position: {
          longitude: item.longitude,
          latitude: item.latitude,
        },
        title: `${item.targetName}-${item.pointName}`,
        ...item,
      });
    });
    return (
      <div
        style={{ width: '100%',
      height: 'calc(100vh - 120px)' }}
        className={styles.standardList}
      >
        <Card
          bordered={false}
          bodyStyle={
            {
              height: 'calc(100vh - 200px)',
              padding: '0px 20px',
            }
          }
          title={<BreadcrumbHeader />}
          extra={<div >
            <Cascader options={city}placeholder="请选择行政区" style={{ width: 250, marginLeft: 10 }} />
            <Select
              onChange={(value) => {
                this.props.dispatch(routerRedux.push(
                  {
                    type: 'points/querymonitorpoint',
                    payload: {
                      ...payload,
                      pollutantType: value,
                    },
                  }
                ));
            }}
              defaultValue={pollutanttype[0].PollutantTypeName}
              size="default"
              style={{ width: 100, marginLeft: 10 }}
            >
              {
            pollutanttype.map((item, key) => {
              return <Option key={key} value={item.PollutantTypeCode}>{item.PollutantTypeName}</Option>;
            })
        }
            </Select>

            <Search
              placeholder="输入条件模糊搜索"
              style={{ width: 270, marginLeft: 10 }}
              onSearch={value => console.log(value)}
            />
                 </div>}

        >
          <div
            style={{ width: '100%',
            height: 'calc(100vh - 220px)',
            flex: 1,
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
           }}
          >
            <Map
              loading={<Spin />}
              amapkey={amapKey}
              plugins={plugins}
              // center={{
              //   longitude: centerlongitude,
              //   latitude: centerlatitude,
              // }}
              // // events={this.amapEvents}
              // zoom={zoom}
            >
              <Markers
                markers={markers}
                events={this.markerEvents}
                useCluster={clusterOptions}
                render={(extData) => {
                return (<div style={{ background: `url('${window.location.origin}/api/Themes/Gis/Icon/arcgisIcon/${extData.imgName}')`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  width: '30px',
                  height: '40px',
                  color: '#000',
                  textAlign: 'center',
                  lineHeight: '40px' }}
                />);
              }}
              />
              <InfoWindow
                autoMove
                isCustom={false}
                size={{
                  width: 290,
                  height: windowheight,
                }}
                showShadow
                visible={this.state.visible}
                position={this.state.position}
                ref={(ref) => { this.infoWindow = ref; }}
              >
                <MarkerDetail
                  changePollutant={this.changePollutant}
                  lastdata={this.props.lastdata}
                  hourtendency={this.props.hourtendency}
                  selectpoint={this.props.selectpoint}
                  pollutant={this.props.pollutant}
                  effects={this.props.effects}
                />
              </InfoWindow>
            </Map>

          </div>
        </Card >
      </div>);
  }
}


// make this component available to the app
export default MonitorDataMap;
