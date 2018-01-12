// import liraries
import React, { Component } from 'react';
import { connect } from 'dva';
import { Map, Markers } from 'react-amap';


const alphabet = 'ABCDEFGHIJKLMNOP'.split('');
const randomMarker = (len) => (
  Array(len).fill(true).map((e, idx) => ({
    position: {
      longitude: 100 + Math.random() * 30,
      latitude: 30 + Math.random() * 20,
    },
    myLabel: alphabet[idx],
    myIndex: idx + 1,
  }))
);

const style = {
  padding: '8px',
  backgroundColor: '#000',
  color: '#fff',
  border: '1px solid #fff',
};

const mouseoverStyle = {
  padding: '8px',
  backgroundColor: '#fff',
  color: '#000',
  border: '1px solid #000',
}

@connect()
class AMapTest extends Component {
  constructor(){
    super();
    this.markers = randomMarker(10);
    this.mapCenter = {longitude: 115, latitude: 40};
    this.state = {
      useCluster: false,
    };
    this.markerEvents = {
      mouseover:(e, marker) => {
        marker.render(this.renderMouseoverLayout);
      },
      mouseout: (e, marker) => {
        marker.render(this.renderMarkerLayout);
      }
    }
  }
  
  toggleCluster(){
    this.setState({
      useCluster: !this.state.useCluster,
    })
  }
  
  renderMouseoverLayout(extData){
    if (extData.myIndex === 3){
      return false;
    }
    return <div style={mouseoverStyle}>{extData.myLabel}</div>
  }
  
  renderMarkerLayout(extData){
    if (extData.myIndex === 3){
      return false;
    }
    return <div style={style}>{extData.myLabel}</div>
  }
  
  render(){   
    return <div>
      <div style={{width: '100%', height: 370}}>
        <Map plugins={['ToolBar']} center={this.mapCenter} zoom={4}>
          <Markers 
            events={this.markerEvents}
            markers={this.markers}
            useCluster={this.state.useCluster}
            render={this.renderMarkerLayout}
          />
        </Map>
      </div>
      <button onClick={()=>{ this.toggleCluster() }}>Toggle Cluster</button>
    </div>
  }
}
// make this component available to the app
export default AMapTest;
