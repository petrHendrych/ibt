import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Map, TileLayer, Polyline, Marker, FeatureGroup} from "react-leaflet";
import {latLngBounds} from "leaflet";



export default class MyMap extends Component {
    constructor(props) {
        super(props);

        this.map = React.createRef();
        this.group = React.createRef();
    }

    handleClick = () => {
        const map = this.map.current.leafletElement;
        const group = this.group.current.leafletElement;
        map.fitBounds(group.getBounds());
    };

    render() {
        const bounds = latLngBounds(this.props.points);

        return (
            <Map doubleClickZoom={false} bounds={bounds} ref={this.map}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <button onClick={this.handleClick} className="button">FIT</button>
                <FeatureGroup ref={this.group}>
                    <Polyline color="black" positions={this.props.points} ref={this.line}/>
                </FeatureGroup>
                {this.props.selectedIndex === null ? <></> : <Marker position={this.props.points[this.props.selectedIndex]}/>}
            </Map>
        );
    }
}

MyMap = connect (
    state => {
        return {
            points: state.points,
            selectedIndex: state.selectedPoint
        }
    }
)(MyMap);