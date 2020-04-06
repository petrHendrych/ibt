import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Map, TileLayer, Polyline, Marker, FeatureGroup, Rectangle} from "react-leaflet";
import {latLngBounds, polyline} from "leaflet";
import L from 'leaflet';
import _ from 'lodash';
import {getFiles} from "../actions/files";
import {getTracks} from "../actions/tracks";

import {getPointLatLng, updatePointLatLng} from "../actions/points";

export default class MyMap extends Component {
    constructor(props) {
        super(props);

        this.map = React.createRef();
        this.group = React.createRef();
    }

    componentDidMount() {
        this.props.getFiles();
        this.props.getTracks();
    }

    boundsHandler = () => {
        const map = this.map.current.leafletElement;
        const group = this.group.current.leafletElement;
        map.fitBounds(group.getBounds());
    };

    boundsPointHandler = (e) => {
        const coords = e.latlng;
        this.props.getPointLatLng(coords);
    };

    updateMarker = (e) => {
        let coords = e.target.getLatLng();
        coords.lat = parseFloat(coords.lat.toFixed(6));
        coords.lng = parseFloat(coords.lng.toFixed(6));
        this.props.updatePointLatLng(this.props.selectedIndex, coords);
    };

    polylineClickHandler = (e, line) => {
        const point = e.latlng;
        const latlngs = [
            [45.51, -122.68],
            [37.77, -122.43],
            [34.04, -118.2]
        ];
        console.log(this.map);
        const nPol = L.LineUtil.closestPointOnSegment(this.map, line, point);
        // console.log(nPol.closestLayerPoint([49.4, 16.3]));
        console.log(nPol);
        // const p = LineUtil.closestPointOnSegment(this.map, line, point);
    };

    render() {
        let bounds = latLngBounds([[49.24, 16.54], [49.15, 16.71]]);

        if (!_.isEmpty(this.props.track)) {
            bounds = latLngBounds(this.props.track.geometry.coordinates);
        }

        return (
            <Map doubleClickZoom={false}
                 bounds={bounds}
                 ref={this.map}
                 ondblclick={(e) => this.polylineClickHandler(e, this.props.track.geometry.coordinates)}
                 maxZoom={18}
            >
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {_.isEmpty(this.props.track) ? <></> : <button onClick={this.boundsHandler} className="fit-button">fit track</button>}

                { !_.isEmpty(this.props.track) ?
                    <FeatureGroup ref={this.group}>
                        <Polyline
                            color="black"
                            positions={this.props.track.geometry.coordinates[0]}
                            onClick={(e) => this.polylineClickHandler(e, this.props.track.geometry.coordinates[0])}
                        />
                    </FeatureGroup> :
                    <></>
                }
                {
                    this.props.selectedIndex === null ? <></> :
                    <Marker onDragEnd={this.updateMarker}
                            draggable={true}
                            position={this.props.track.geometry.coordinates[0][this.props.selectedIndex]}
                    />
                }
                {this.props.bounds.length === 2 ? <Rectangle bounds={this.props.bounds}/> : <></>}
            </Map>
        );
    }
}

MyMap = connect (
    state => {
        return {
            selectedIndex: state.selectedIndex,
            bounds: state.bounds,
            track: state.tracks.track ? state.tracks.track : {},
        }
    },
    dispatch => {
        return {
            getFiles: () => dispatch(getFiles()),
            getTracks: () => dispatch(getTracks()),
            getPointLatLng: (point) => dispatch(getPointLatLng(point)),
            updatePointLatLng: (index, val) => dispatch(updatePointLatLng(index, val))
        }
    }
)(MyMap);