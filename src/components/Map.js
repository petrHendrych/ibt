import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Map, TileLayer, Polyline, Marker, Rectangle} from "react-leaflet";
import {latLngBounds, LineUtil} from "leaflet";
import _ from 'lodash';
import {getFiles} from "../actions/files";
import {getTracks} from "../actions/tracks";

import {getPointLatLng, updatePointLatLng} from "../actions/points";

export default class MyMap extends Component {
    constructor(props) {
        super(props);

        this.map = React.createRef();
        this.polyline = React.createRef();
    }

    state = {
        marker: {
            lat: 50.30216818708575,
            lng: 17.159141868020516
        }
    };

    componentDidMount() {
        this.props.getFiles();
        this.props.getTracks();
    }

    boundsHandler = () => {
        const map = this.map.current.leafletElement;
        const group = this.polyline.current.leafletElement;
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

    polylineClickHandler = (e) => {
        const point = e.latlng;
        const mapPoint = this.map.current.leafletElement.latLngToLayerPoint(point);
        const {minPoint, idxClosest} = closestPoint(mapPoint, this.polyline.current.leafletElement);
        this.setState({marker: this.map.current.leafletElement.layerPointToLatLng(minPoint)});
        console.log(idxClosest);
    };

    render() {
        let bounds = latLngBounds([[49.24, 16.54], [49.15, 16.71]]);

        if (!_.isEmpty(this.props.track)) {
            if (!_.isEmpty(this.props.track.geometry.coordinates[0])) {
                bounds = latLngBounds(this.props.track.geometry.coordinates);
            }
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
                    <Polyline
                        ref={this.polyline}
                        color="black"
                        positions={this.props.track.geometry.coordinates[0]}
                        onClick={(e) => this.polylineClickHandler(e, this.props.track.geometry.coordinates[0])}
                    /> :
                    <></>
                }
                <Marker position={this.state.marker}/>
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

function closestPoint(p, polyline) {
    let minDistance = Infinity,
        minPoint = null,
        idxClosest = 0,
        closest = LineUtil._sqClosestPointOnSegment,
        p1, p2;

    for (let j = 0, jLen = polyline._parts.length; j < jLen; j++) {
        let points = polyline._parts[j];

        for (let i = 1, len = points.length; i < len; i++) {
            p1 = points[i - 1];
            p2 = points[i];

            let sqDist = closest(p, p1, p2, true);

            if (sqDist < minDistance) {
                idxClosest = i;
                minDistance = sqDist;
                minPoint = closest(p, p1, p2);
            }
        }
    }
    if (minPoint) {
        minPoint.distance = Math.sqrt(minDistance);
    }
    return {minPoint, idxClosest};
}