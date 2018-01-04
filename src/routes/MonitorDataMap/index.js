// import liraries
import React, { Component } from 'react';
import { connect } from 'dva';
import { Map, Markers, InfoWindow } from 'react-amap';
import config from '../../config';

const { amapKey, centerlongitude, centerlatitude, zoom } = config;
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

@connect(({ loading, points }) => ({
  ...loading,
  pointlist: points.pointlist,
}))
class MonitorDataMap extends Component {
  constructor() {
    super();
    this.state = {
      position: { longitude: centerlongitude,
        latitude: centerlatitude },
      offset: [10, -20],
      size: { width: 270, height: 330 },
      showwindow: false,
      Content: null,
    };
    this.markersEvents = {
      click(e, marker) {
        // 通过高德原生提供的 getExtData 方法获取原始数据
        const extData = marker.getExtData();
        this.setState({
          position: {
            longitude: extData.longitude,
            latitude: extData.latitude,
          },
          offset: [10, -20],
          showwindow: true,
          size: { width: 270, height: 330 },
          Content: null,
        });
      },
    };
    this.windowEvents = {
      // created: (iw) => { console.log(iw) },
      // open: () => { console.log('InfoWindow opened') },
      close: () => {
        this.setState({
          showwindow: false,
        });
      },
      // change: () => { console.log('InfoWindow prop changed') },
    };
  }

  render() {
    const markers = [];
    this.props.pointlist.map((item, key) => {
      markers.push({
        key,
        position: {
          longitude: item.longitude,
          latitude: item.latitude,
        },
        title: `${item.targetName}-${item.pointName}`,
        ...item,
      });
    });
    return (
      <div style={{
          width: '100%',
          height: 'calc(100vh - 120px)',
        }}
      >
        <Map
          viewMode="3D"
          amapkey={amapKey}
          plugins={plugins}
          center={{
              longitude: centerlongitude,
              latitude: centerlatitude,
            }}
          zoom={zoom}
        >
          <Markers
            markers={markers}
            events={this.markersEvents}
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
            useCluster
          />
          <InfoWindow
            position={this.state.position}
            visible={this.state.visible}
            isCustom={false}
            content={this.state.Content}
            size={this.state.size}
            offset={this.state.offset}
            events={this.windowEvents}
          />
        </Map>
      </div>);
  }
}
// make this component available to the app
export default MonitorDataMap;
