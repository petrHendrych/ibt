import React, {Component} from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faPencilAlt} from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

import CanvasJSReact from '../canvas/canvasjs.react';
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {editTrackName, getTracks, updateTrack} from "../actions/tracks";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class TrackInfo extends Component {
    state = {
        show: false
    };

    getTotalTime = (trk) => {
        if (!_.isEmpty(trk)) {
            const start = new Date(trk.properties.times[0]);
            const end = new Date(trk.properties.times[trk.properties.times.length - 1]);

            const result =  (end - start) / 1000;

            const hours = Math.floor(result / 60 / 60);
            const minutes = Math.floor(result / 60) - (hours * 60);
            const seconds = result % 60;

            return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
        }
    };

    getElevations = (track) => {
        if (!_.isEmpty(track)) {
            const ele = track.properties.elevations;
            let xVal = 1;
            let dps = [];

            for(let i = 0; i < ele.length; i++) {
                dps.push({x: xVal,y: parseFloat(ele[i])});
                xVal++;
            }
            return dps;
        }
    };

    getLength = (track) => {
        if (track.current) {
            let distance = 0;
            const latLng = track.current.leafletElement._latlngs[0];

            for (let i = 1; i < latLng.length; i++) {
                distance += latLng[i].distanceTo(latLng[i - 1]);
            }

            if (distance < 1000) {
                return `${_.round(distance, 1)} m`
            } else {
                distance = distance / 1000;
                return `${_.round(distance, 1)} km`
            }
        }

        return 0;
    };

    render() {
        const {elevations, times} = this.props.track.properties;

        if (_.isEmpty(this.props.track.geometry.coordinates[0]))
            return  <></>;

        const options = {
            theme: "light2",
            axisY: {
                includeZero: false
            },
            width: 300,
            height: 250,
            data: [{
                type: "splineArea",
                dataPoints: this.getElevations(this.props.track)
            }]
        };
        return (
            <div className={this.state.show ? "track-info show" : "track-info"}>
                <OverlayTrigger placement="right"  overlay={<Tooltip className="nav-tooltip" id="tooltip-disabled">Track info</Tooltip>}>
                    <div className="track-info-button" onClick={(e) => {
                        e.stopPropagation();
                        this.setState({show: !this.state.show})
                    }}>
                        <FontAwesomeIcon icon={this.state.show ? faChevronLeft : faChevronRight} size="2x" className="text-muted"/>
                    </div>
                </OverlayTrigger>
                <NameInput name={this.props.track.properties.name} id={this.props.track.properties.id}/>
                <h5 className="track-info-key">Length: <span className="track-info-value">{this.getLength(this.props.polyline)}</span></h5>
                { !_.isEmpty(times) ?
                <>
                    <h5 className="track-info-key">Time: <span className="track-info-value">{this.getTotalTime(this.props.track)}</span></h5>
                </> : <></>}
                { !_.isEmpty(elevations) ?
                    <>
                        <h5>Track elevations:</h5>
                        <CanvasJSChart options = {options}/>
                    </> : <></>}
            </div>
        )
    }
}

TrackInfo = connect (
    state => {
        return {
            track: state.tracks.track ? state.tracks.track : {}
        }
    }
)(TrackInfo);

class NameInput extends Component {
    state = {name: this.props.name, enable: true};

    handleNameChange = (e) => {
        this.setState({name: e.target.value})
    };

    handleFocus = (e) => {
        e.target.select();
    };

    onBlurHandler = (e) => {
        if (e.target.value === '') {
            this.setState({name: this.props.name})
        }
    };

    keyPress = async (e) => {
        if(e.keyCode === 13){
            this.props.editName(this.state.name);
            this.setState({enable: !this.state.enable});
            await this.props.updateTrack(this.props.id);
            this.props.getTracks();
        }
    };

    render () {
        return (
            <h5 className="track-info-key">Name:
                <input value={this.state.name}
                       disabled={this.state.enable}
                       className={"track-info-name ml-1 " + (this.state.enable ? "" : "border-bottom")}
                       onFocus={this.handleFocus}
                       onKeyUp={this.keyPress}
                       onChange={this.handleNameChange}
                       onBlur={this.onBlurHandler}
                />
                <FontAwesomeIcon icon={faPencilAlt}
                                 className={"float-right pointer " + (this.state.enable ? "text-muted" : "")}
                                 size="1x"
                                 onClick={() => this.setState({enable: !this.state.enable})}
                />
            </h5>
        )
    }
}

NameInput = connect (
    state => {
        return {}
    },
    dispatch => {
        return {
            updateTrack: (id) => dispatch(updateTrack(id)),
            getTracks: () => dispatch(getTracks()),
            editName: (name) => dispatch(editTrackName(name))
        }
    }
)(NameInput);

