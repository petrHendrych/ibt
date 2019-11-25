import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Map, TileLayer, Polyline, Marker, FeatureGroup, Rectangle} from "react-leaflet";
import {latLngBounds} from "leaflet";
import {fetchData, getPointLatLng} from "../actions";
import _ from 'lodash';

export default class MyMap extends Component {
    constructor(props) {
        super(props);

        this.map = React.createRef();
        this.group = React.createRef();
    }

    componentDidMount() {
        this.props.fetchData();
    }

    handleClick = () => {
        const map = this.map.current.leafletElement;
        const group = this.group.current.leafletElement;
        map.fitBounds(group.getBounds());
    };

    getLatLng = (e) => {
        const coords = e.latlng;
        this.props.getPointLatLng(coords);
    };

    updateMarker = () => {
        console.log(this.props.selectedIndex);
    };

    render() {
        let bounds = latLngBounds([[49.24, 16.54], [49.15, 16.71]]);

        if (!_.isEmpty(this.props.data)) {
            bounds = latLngBounds(this.props.data.features[1].geometry.coordinates);
        }

        return (
            <Map doubleClickZoom={false} bounds={bounds} ref={this.map} ondblclick={this.getLatLng}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {_.isEmpty(this.props.data) ? <></> : <button onClick={this.handleClick} className="fit-button">fit track</button>}
                <FeatureGroup ref={this.group}>
                    {_.isEmpty(this.props.data) ? <></> : <Polyline color="black" positions={this.props.data.features[1].geometry.coordinates} />}
                </FeatureGroup>
                {this.props.selectedIndex === null ? <></> : <Marker onDrag={this.updateMarker} draggable={true} position={this.props.data.features[1].geometry.coordinates[this.props.selectedIndex]}/>}
                {this.props.bounds.length === 2 ? <Rectangle bounds={this.props.bounds}/> : <></>}
            </Map>
        );
    }
}

MyMap = connect (
    state => {
        return {
            selectedIndex: state.selectedIndex,
            data: state.data,
            bounds: state.bounds
        }
    },
    dispatch => {
        return {
            fetchData: () => dispatch(fetchData()),
            getPointLatLng: (point) => dispatch(getPointLatLng(point))
        }
    }
)(MyMap);