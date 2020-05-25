import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Map, TileLayer, Polyline, Marker, Rectangle} from "react-leaflet";
import {latLngBounds, LineUtil, icon} from "leaflet";
import {Modal} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSquare } from '@fortawesome/free-regular-svg-icons';
import {faPlus, faTrashAlt, faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

import TrackInfo from "./TrackInfo";
import {getTrackPartition, updateTrack} from "../actions/tracks";
import {
    deletePartitionPoint,
    deletePoint,
    getPointLatLng,
    insertPoint, pointsError,
    selectPoint,
    updatePointLatLng
} from "../actions/points";
import {TRACK_PARTITION_CLEAR} from "../actions/types";

const circleMarker = icon({
    iconUrl: require('../images/circleMarker.svg'),
    iconSize: [14, 14]
});

const startMarker = icon({
    iconUrl: require('../images/startMarker.svg'),
    iconSize: [16, 16]
});

const endMarker = icon({
    iconUrl: require('../images/endMarker.svg'),
    iconSize: [16, 16]
});

export default class MyMap extends Component {
    constructor(props) {
        super(props);

        this.map = React.createRef();
        this.polyline = React.createRef();

        this.state = {
            bounds: []
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.bounds !== this.props.bounds) {
            this.setState({bounds: this.props.bounds})
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
        bounds.push([parseFloat(this.state.bounds[0].lat.toFixed(6)), parseFloat(this.state.bounds[0].lng.toFixed(6))]);
        bounds.push([parseFloat(this.state.bounds[1].lat.toFixed(6)), parseFloat(this.state.bounds[1].lng.toFixed(6))]);
        this.props.getTrackPartition(this.props.track.properties.id, bounds);
    };

    updateMarker = (e, idx = this.props.selectedIndex) => {
        let coords = e.target.getLatLng();
        coords.lat = parseFloat(coords.lat.toFixed(6));
        coords.lng = parseFloat(coords.lng.toFixed(6));
        this.props.updatePointLatLng(idx, coords);
    };

    updateRectangle = (e) => {
        const latLng = e.target.getLatLng(); //get marker LatLng
        const markerIndex = e.target.options.index; //get marker index

        this.setState(prevState => {
            const markerData = [...prevState.bounds];
            markerData[markerIndex] = latLng;
            return { bounds: markerData };
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

    dblClickDeletePoint = (index) => {
        if (this.props.track.geometry.coordinates.length === 2) {
            this.props.pointsError();
        } else {


            const realIndex = this.props.partition.indexes[index];
            this.props.deletePartitionPoint(realIndex);
            this.props.deletePoint(realIndex);
            this.props.updateTrack(this.props.track.properties.id);
        }
    };

    render() {
        const position = [49.94415, 15.446655];
        const maxBounds = latLngBounds([-90, 180], [90, -180]);

        let bounds = null;
        if (!_.isEmpty(this.props.track) && !_.isEmpty(this.props.track.geometry.coordinates)) {
            bounds = latLngBounds(this.props.track.geometry.coordinates);
        }

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
                        <TrackInfo map={this.map} polyline={this.polyline}/>
                        <Polyline
                            ref={this.polyline}
                            color="black"
                            weight={3}
                            positions={this.props.track.geometry.coordinates}
                            onClick={(e) => this.polylineClickHandler(e, this.props.track.geometry.coordinates)}
                        />
                        <Marker icon={startMarker} position={this.props.track.geometry.coordinates[0]}/>
                        <Marker icon={endMarker} position={
                            this.props.track.geometry.coordinates[this.props.track.geometry.coordinates.length - 1]
                        }/>
                        {this.props.partition.indexes.map((val, index) =>
                            <Marker
                                key={index}
                                index={index}
                                position={this.props.track.geometry.coordinates[val]}
                                draggable={true}
                                onDragEnd={(e) => this.updateMarker(e, val)}
                                icon={circleMarker}
                                autoPan={true}
                                ondblclick={() => this.dblClickDeletePoint(index)}
                            />
                        )}
                    </>
                }
                {
                    this.props.selectedIndex === null ? <></> :
                    <Marker onDragEnd={this.updateMarker}
                            draggable={true}
                            position={this.props.track.geometry.coordinates[this.props.selectedIndex]}
                            autoPan={true}
                    />
                }
                {
                    this.state.bounds.length === 2 ?
                    <Rectangle bounds={this.state.bounds}/> :
                    <></>
                }
                {
                    this.state.bounds.map((position, index) =>
                        <Marker
                            key={index}
                            index={index}
                            position={position}
                            draggable={true}
                            onDrag={this.updateRectangle}
                            onDragend={() => this.state.bounds.length === 2 ? this.getPartition() : null}
                            icon={circleMarker}
                        />
                    )
                }

                <Modal show={this.state.isShow} onHide={() => this.setState({isShow: false})} backdrop={'static'}>
                    <Modal.Header closeButton>
                        <Modal.Title>User help</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <HelpInfo name="Add point" icon={faPlus}
                                  text="To add new point simply click anywhere on track.
                                  Point will be added exactly on place where you click!
                                  Adding point inside bounding box is not allowed."
                        />
                        <HelpInfo name="Part selection" icon={faSquare}
                                  text="To create boundary for part selection make 2 corner points by double clicking on map.
                                  Points of track that are inside this boundary will appear in side bar."
                        />
                        <HelpInfo name="Deleting multiple points" icon={faTrashAlt}
                                  text="To delete multiple points click on trashcan. After click checkboxes at each point will appear.
                                  Select points you wanna delete and click again on trashcan. To prevent errors never leave only 1 point."
                        />
                        <HelpInfo name="Saving edits" icon={faExclamationTriangle}
                                  text="Beware of not implemented autosave after points position editation.
                                  If you go back to track selection without saving then changes will be discarded.
                                  To prevent losses always click save button before leaving. To save new track name hit enter key."
                        />
                    </Modal.Body>
                </Modal>
            </Map>
        );
    }
}

function HelpInfo(props) {
    return (
        <div className="help-info border-bottom mt-2">
            <p className="mb-1">
                <FontAwesomeIcon icon={props.icon} className="ml-1" style={{marginRight: "15px"}}/>
                <strong>{props.name}</strong>
            </p>
            <p className="text-justify text-padding">
                {props.text}
            </p>
        </div>
    )
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
            updateTrack: (id) => dispatch(updateTrack(id)),
            deletePoint: (index) => dispatch(deletePoint(index)),
            deletePartitionPoint: (index) => dispatch(deletePartitionPoint(index)),
            pointsError: () => dispatch(pointsError()),
            insertPoint: (idx, val) => dispatch(insertPoint(idx, val)),
            clearPartition: () => dispatch({type: TRACK_PARTITION_CLEAR}),
            getTrackPartition: (idx, bounds) => dispatch(getTrackPartition(idx, bounds)),
            updatePointLatLng: (index, val) => dispatch(updatePointLatLng(index, val))
        }
    }
)(MyMap);

/**
 * Function took and modified from official Leaflet source
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