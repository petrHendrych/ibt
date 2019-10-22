import React, {Component, createRef} from 'react';
import { connect } from 'react-redux';
import {Map, TileLayer, Polyline, FeatureGroup} from "react-leaflet";



export default class MyMap extends Component {
    constructor(props) {
        super(props);

        this.map = createRef();
        this.group = createRef();
    }

    handleClick = () => {
        const map = this.map.current.leafletElement;
        const group = this.group.current.leafletElement;
        map.fitBounds(group.getBounds());
    };

    render() {
        return (
            <Map
                ref={this.map}
                center={[49.9277237, 14.2883905]}
                zoom={14}
                doubleClickZoom={false}
                // boundsOptions={this.group.current.leafletElement.getBounds()}
            >
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <button onClick={this.handleClick}>click</button>

                <FeatureGroup ref={this.group}>
                    <Polyline color="black" positions={this.props.points} ref={this.line}/>
                </FeatureGroup>
            </Map>
        );
    }
}

MyMap = connect (
    state => {
        return {
            points: state.points
        }
    }
)(MyMap);