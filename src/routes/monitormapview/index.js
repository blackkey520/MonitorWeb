// import liraries
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import { Map, Markers, InfoWindow } from 'react-amap'
import { config } from 'utils'

const { amapKey, centerlongitude, centerlatitude, zoom } = config
const plugins = [
  'MapType',
  'Scale', {
    name: 'ToolBar',
    options: {
      visible: true, // 不设置该属性默认就是 true
      onCreated (ins) {
        console.log(ins)
      },
    },
  },
]

// create a component
class MonitorMapView extends Component {

  constructor () {
    super()
    this.state = {
      position: { longitude: centerlongitude,
        latitude: centerlatitude },
      offset: [10, -20],
      size: { width: 270, height: 330 },
      showwindow: false,
      Content: null,
    }
    this.markersEvents = {
      click (e, marker) {
    // 通过高德原生提供的 getExtData 方法获取原始数据
        const extData = marker.getExtData()
        this.setState({
          position: {
            longitude: extData.longitude,
            latitude: extData.latitude,
          },
          offset: [10, -20],
          showwindow: true,
          size: { width: 270, height: 330 },
          Content: null,
        })
      },
    }
    this.windowEvents = {
      // created: (iw) => { console.log(iw) },
      // open: () => { console.log('InfoWindow opened') },
      close: () => {
        this.setState({
          showwindow: false,
        })
      },
      // change: () => { console.log('InfoWindow prop changed') },
    }
  }

  render () {
    let markers = []
    this.props.monitorpoint.pointlist.map((item, key) => {
      markers.push({
        key,
        position: {
          longitude: item.longitude,
          latitude: item.latitude,
        },
        title: `${item.targetName}-${item.pointName}`,
        ...item,
      })
    })
    debugger;
    return (
      <Page>
        <div style={{
          width: '100%',
          height: 'calc(100vh - 184px)',
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
                return (<div style={{ background: `url('http://61.50.135.114:37879/Themes/Gis/Icon/arcgisIcon/${extData.imgName}')`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  width: '30px',
                  height: '40px',
                  color: '#000',
                  textAlign: 'center',
                  lineHeight: '40px' }}
                />)
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
        </div>
      </Page>)
  }
}

MonitorMapView.propTypes = {
  loading: PropTypes.object,
}

export default connect(({ monitorpoint, loading }) => ({ monitorpoint, loading }))(MonitorMapView)
