import React, {Component} from 'react';
import {Map, Marker, Polyline, Popup, TileLayer} from "react-leaflet";
import L from "leaflet";

const circleMarker = L.icon({
    iconUrl: require('../images/circleMarker.svg'),
    iconSize: [20, 20], // size of the icon
});

export default class MyMap extends Component {
    state = {
        markers: [],
        path: []
    };

    handleClick = () => {
        this.props.getState(this.state);
    };

    addMarker = (e) => {
        let markers = this.state.markers.slice();
        markers.push(e.latlng);
        this.setState({markers: markers});

        this.expandPath(this.state.markers.slice(-1)[0]);
    };

    expandPath = (item) => {
        let array = this.state.path.slice();
        array.push([item.lat, item.lng]);
        this.setState({path: array});
    };

    updateMarker = event => {
        const latLng = event.target.getLatLng(); //get marker LatLng
        const markerIndex = event.target.options.index; //get marker index
        //update
        this.setState(prevState => {
            const markerData = [...prevState.markers];
            markerData[markerIndex] = latLng;
            return { markers: markerData };
        });

        this.updatePath(markerIndex);
    };

    updatePath = (index) => {
        const updatedMarker = this.state.markers[index];
        //update
        this.setState(prevState => {
            const pathData = [...prevState.path];
            pathData[index] = [updatedMarker.lat, updatedMarker.lng];
            return { path: pathData };
        });
    };

    render() {
        return (
            <Map
                center={[51.5, -0.1]}
                zoom={12}
                doubleClickZoom={false}
                ondblclick={this.addMarker}
            >
                <Polyline color="darkblue" positions={this.state.path} />
                <button onClick={this.handleClick}>Click</button>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {this.state.markers.map((position, idx) =>
                    <Marker
                        key={`marker-${idx}`}
                        index={idx}
                        position={position}
                        draggable={true}
                        onDrag={this.updateMarker}
                        icon={circleMarker}
                    >
                        <Popup>
                            <span>A pretty CSS3 popup. <br/> Easily customizable.</span>
                        </Popup>
                    </Marker>
                )}
            </Map>
        );
    }
}