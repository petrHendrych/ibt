import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Map, TileLayer, Polyline, Marker, Rectangle} from "react-leaflet";
import {latLngBounds, LineUtil, icon} from "leaflet";
import {Modal} from "react-bootstrap";
import _ from 'lodash';

import TrackInfo from "./TrackInfo";
import {getTrackPartition} from "../actions/tracks";
import {getPointLatLng, insertPoint, selectPoint, updatePointLatLng} from "../actions/points";
import {TRACK_PARTITION_CLEAR} from "../actions/types";

const circleMarker = icon({
    iconUrl: require('../images/circleMarker.svg'),
    iconSize: [14, 14], // size of the icon
});

export default class MyMap extends Component {
    constructor(props) {
        super(props);

        this.map = React.createRef();
        this.polyline = React.createRef();

        this.state = {
            markers: []
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.bounds !== this.props.bounds) {
            this.setState({markers: this.props.bounds})
        }
    }

    boundsHandler = () => {
        const map = this.map.current.leafletElement;
        const polyline = this.polyline.current.leafletElement;
        map.fitBounds(polyline.getBounds());
    };

    boundsPointHandler = (e) => {
        const coords = e.latlng;
        this.props.getPointLatLng(coords);

        if (this.props.bounds.length === 2) {
            this.getPartition();
        }
    };

    getPartition = () => {
        const bounds = [];
        bounds.push([parseFloat(this.state.markers[0].lat.toFixed(6)), parseFloat(this.state.markers[0].lng.toFixed(6))]);
        bounds.push([parseFloat(this.state.markers[1].lat.toFixed(6)), parseFloat(this.state.markers[1].lng.toFixed(6))]);
        this.props.getTrackPartition(this.props.track.properties.id, bounds);
    };

    updateMarker = (e) => {
        let coords = e.target.getLatLng();
        coords.lat = parseFloat(coords.lat.toFixed(6));
        coords.lng = parseFloat(coords.lng.toFixed(6));
        this.props.updatePointLatLng(this.props.selectedIndex, coords);
    };

    updateRectangle = (e) => {
        const latLng = e.target.getLatLng(); //get marker LatLng
        const markerIndex = e.target.options.index; //get marker index

        this.setState(prevState => {
            const markerData = [...prevState.markers];
            markerData[markerIndex] = latLng;
            return { markers: markerData };
        });
    };

    polylineClickHandler = (e) => {
        let point = e.latlng;
        const mapPoint = this.map.current.leafletElement.latLngToLayerPoint(point);
        const {minPoint, idxClosest} = closestPoint(mapPoint, this.polyline.current.leafletElement);
        point = [
            parseFloat(this.map.current.leafletElement.layerPointToLatLng(minPoint).lat.toFixed(6)),
            parseFloat(this.map.current.leafletElement.layerPointToLatLng(minPoint).lng.toFixed(6))
        ];
        this.props.selectPoint(idxClosest);
        this.props.insertPoint(idxClosest, point);
        if (this.props.selectedIndex === null) {
            this.props.selectPoint(idxClosest);
        }
    };

    dblClickHandler = (e) => {
        if (!_.isEmpty(this.props.track) && this.props.bounds.length !== 2) {
            this.boundsPointHandler(e)
        }
    };

    render() {
        const position = [49.94415, 15.446655];
        const maxBounds = latLngBounds([-90, 180], [90, -180]);
        const bounds = !_.isEmpty(this.props.track) ? latLngBounds(this.props.track.geometry.coordinates) : null;

        return (
            <Map doubleClickZoom={false}
                 bounds={bounds}
                 center={position}
                 zoom={8}
                 ref={this.map}
                 ondblclick={(e) => this.dblClickHandler(e)}
                 maxZoom={18}
                 maxBounds={maxBounds}
            >
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    noWrap={true}
                />


                {_.isEmpty(this.props.track) ? <></> :
                    <>
                        <button onClick={this.boundsHandler} className="fit-button">Fit Track</button>
                        <button onClick={() => this.setState({isShow: true})} className="help-button">Help</button>
                        <TrackInfo />
                    </>
                }

                { !_.isEmpty(this.props.track) ?
                    <Polyline
                        ref={this.polyline}
                        color="black"
                        weight={3}
                        positions={this.props.track.geometry.coordinates}
                        onClick={(e) => this.polylineClickHandler(e, this.props.track.geometry.coordinates[0])}
                    /> :
                    <></>
                }
                {
                    this.props.selectedIndex === null ? <></> :
                    <Marker onDragEnd={this.updateMarker}
                            draggable={true}
                            position={this.props.track.geometry.coordinates[0][this.props.selectedIndex]}
                    />
                }
                {
                    this.state.markers.length === 2 ?
                    <Rectangle bounds={this.state.markers}/> :
                    <></>
                }
                {
                    this.state.markers.map((position, index) =>
                        <Marker
                            key={index}
                            index={index}
                            position={position}
                            draggable={true}
                            onDrag={this.updateRectangle}
                            onDragend={() => this.state.markers.length === 2 ? this.getPartition() : null}
                            icon={circleMarker}
                        />
                    )
                }
                <Modal show={this.state.isShow} onHide={() => this.setState({isShow: false})} backdrop={'static'}>
                    <Modal.Header closeButton>
                        <Modal.Title>User help</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>To add point click anywhere on track.</p>
                        <p>To select only partition of track two times double click anywhere on map to create boundary.
                            Points of track that are inside this boundary will  appear in side bar.
                        </p>
                    </Modal.Body>
                </Modal>
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
            partition: state.partition
        }
    },
    dispatch => {
        return {
            selectPoint: (p) => dispatch(selectPoint(p)),
            getPointLatLng: (point) => dispatch(getPointLatLng(point)),
            insertPoint: (idx, val) => dispatch(insertPoint(idx, val)),
            clearPartition: () => dispatch({type: TRACK_PARTITION_CLEAR}),
            getTrackPartition: (idx, bounds) => dispatch(getTrackPartition(idx, bounds)),
            updatePointLatLng: (index, val) => dispatch(updatePointLatLng(index, val))
        }
    }
)(MyMap);

/**
 * Function took and modified from oficial Leaflet source
 * url: https://github.com/Leaflet/Leaflet/blob/master/src/layer/vector/Polyline.js
 * line: 89
 *
 * @param p
 * @param polyline
 * @returns {{minPoint: *, idxClosest: number}}
 */
function closestPoint(p, polyline) {
    let minDistance = Infinity,
        minPoint = null,
        idxClosest = 0,
        closest = LineUtil._sqClosestPointOnSegment,
        p1, p2;

    for (let j = 0, jLen = polyline._rings.length; j < jLen; j++) {
        let points = polyline._rings[j];
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