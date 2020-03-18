import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Map, TileLayer, Polyline, Marker, FeatureGroup, Rectangle} from "react-leaflet";
import {latLngBounds} from "leaflet";
import {getPointLatLng, updatePointLatLng} from "../actions";
import _ from 'lodash';
import {getFiles} from "../actions/files";
import {getTracks} from "../actions/tracks";

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

    handleClick = () => {
        const map = this.map.current.leafletElement;
        const group = this.group.current.leafletElement;
        map.fitBounds(group.getBounds());
    };

    getLatLng = (e) => {
        const coords = e.latlng;
        this.props.getPointLatLng(coords);
    };

    updateMarker = (e) => {
        const coords = e.target.getLatLng();
        this.props.updatePointLatLng(this.props.selectedIndex, coords);
    };

    render() {
        let bounds = latLngBounds([[49.24, 16.54], [49.15, 16.71]]);

        if (!_.isEmpty(this.props.track)) {
            bounds = latLngBounds(this.props.track.geometry.coordinates);
        }

        return (
            <Map doubleClickZoom={false} bounds={bounds} ref={this.map} ondblclick={this.getLatLng} maxZoom={18}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {_.isEmpty(this.props.track) ? <></> : <button onClick={this.handleClick} className="fit-button">fit track</button>}

                { !_.isEmpty(this.props.track) ?
                    <FeatureGroup ref={this.group}>
                        <Polyline color="black" positions={this.props.track.geometry.coordinates}/>
                    </FeatureGroup> :
                    <></>
                }
                {
                    this.props.selectedIndex === null ? <></> :
                    <Marker onDragEnd={this.updateMarker}
                            draggable={true}
                            position={this.props.coordinates[this.props.selectedIndex]}
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