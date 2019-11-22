import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Map, TileLayer, Polyline, Marker, FeatureGroup} from "react-leaflet";
import {latLngBounds} from "leaflet";
import {fetchData} from "../actions";
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

    render() {
        let bounds = latLngBounds([[49.24, 16.54], [49.15, 16.71]]);

        if (!_.isEmpty(this.props.data)) {
            bounds = latLngBounds(this.props.data.features[1].geometry.coordinates);
        }

        return (
            <Map doubleClickZoom={false} bounds={bounds} ref={this.map}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <button onClick={this.handleClick} className="fit-button">fit track</button>
                <FeatureGroup ref={this.group}>
                    {_.isEmpty(this.props.data) ? <></> : <Polyline color="black" positions={this.props.data.features[1].geometry.coordinates} />}
                </FeatureGroup>
                {this.props.selectedIndex === null ? <></> : <Marker position={this.props.data.features[1].geometry.coordinates[this.props.selectedIndex]}/>}
            </Map>
        );
    }
}

MyMap = connect (
    state => {
        return {
            selectedIndex: state.selectedIndex,
            data: state.data
        }
    },
    dispatch => {
        return {
            fetchData: () => dispatch(fetchData())
            // getPointLatLng: (e) => dispatch(getPointLatLng(e))
        }
    }
)(MyMap);