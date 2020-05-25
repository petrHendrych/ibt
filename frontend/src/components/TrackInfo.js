/**
 * @author Petr Hendrych <xhendr03@fit.vutbr.cz>
 * @file Track info component with all information and measurements
 */

import React, {Component} from 'react';
import { faChevronRight, faChevronLeft, faPencilAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {AreaChart, Area, XAxis, YAxis, Label} from 'recharts';
import {DomUtil, DomEvent} from 'leaflet';
import { connect } from 'react-redux';
import _ from 'lodash';

import {editTrackName, getTracks, updateTrack} from "../actions/tracks";


export default class TrackInfo extends Component {
    state = {
        show: false
    };

    getLength = (track) => {
        if (track.current) {
            let distance = 0;
            const latLng = track.current.leafletElement._latlngs;

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

    disablePropagation = () => {
        let div = DomUtil.get('info');
        DomEvent.disableClickPropagation(div);
    };

    render() {
        const {elevations, times} = this.props.track.properties;

        if (_.isEmpty(this.props.track.geometry.coordinates))
            return  <></>;

        return (
            <div id="info" className={this.state.show ? "track-info show" : "track-info"} onClick={() => this.disablePropagation()}>
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
                <TrackTimes times={times} track={this.props.track}/>
                <TrackElevations elevations={elevations} track={this.props.track} polyline={this.props.polyline}/>
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
        const name = this.state.name === '' ? this.props.name : this.state.name;

        if(e.keyCode === 13){
            this.onBlurHandler(e);
            this.props.editName(name);
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
    null,
    dispatch => {
        return {
            updateTrack: (id) => dispatch(updateTrack(id)),
            getTracks: () => dispatch(getTracks()),
            editName: (name) => dispatch(editTrackName(name))
        }
    }
)(NameInput);


class TrackTimes extends Component {
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

    renderTimes = (times) => {
        if (_.isEmpty(times)) {
            return <span className="track-info-value">no data</span>
        }

        return <span className="track-info-value">{this.getTotalTime(this.props.track)}</span>
    };

    render() {
        return <h5 className="track-info-key">Time: {this.renderTimes(this.props.times)}</h5>
    }
}

class TrackElevations extends Component {
    getData = (track, polyline) => {
        if (!_.isEmpty(track) && polyline.current) {
            const ele = track.properties.elevations;
            const latLng = polyline.current.leafletElement._latlngs;
            let data = [{ele: ele[0], dst: 0}];
            let distance = 0;


            for (let i = 1; i < ele.length; i++) {
                distance += latLng[i].distanceTo(latLng[i - 1]);
                data.push({ele: parseFloat(ele[i]), dst: _.round(distance, 1)});
            }
            return data;
        }
    };

    getFormatter(length) {
        if (length > 1000) {
            return (tick) => `${_.round(tick/1000, 1)} km`
        }
        return (tick) => `${tick} m`
    };

    renderElevations = (elevations, data) => {
        if (_.isEmpty(elevations) || !data) {
            return <span className="track-info-value">no data</span>
        }

        return (
            <AreaChart width={300} height={260} data={data}
                       margin={{top: 10, right: 5, left: 0, bottom: 10}}>
                <XAxis dataKey="dst" tick={{fontSize: 12}} tickFormatter={this.getFormatter(data.slice(-1)[0].dst)}>
                    <Label value="Distance" offset={-5} position="bottom" fontSize="13"/>
                </XAxis>
                <YAxis tick={{fontSize: 12}} tickFormatter={(tick) => `${tick} m`}>
                    <Label value="Altitude" position="insideLeft" angle={-90} fontSize="13"/>
                </YAxis>
                <Area dataKey='ele' stroke='#8884d8' fill='#8884d8' />
            </AreaChart>
        )
    };

    render() {
        return <h5 className="track-info-key">
            Elevations: {this.renderElevations(this.props.elevations, this.getData(this.props.track, this.props.polyline))}
            </h5>
    }
}