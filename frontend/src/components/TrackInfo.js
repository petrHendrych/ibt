import React, {Component} from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

import CanvasJSReact from '../canvas/canvasjs.react';

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

    render() {
        const {elevations, times} = this.props.track.properties;

        const options = {
            theme: "light2",
            animationEnabled: false,
            zoomEnabled: false,
            title: {
                text: "Track elevations"
            },
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
                <div className="track-info-button" onClick={(e) => {
                    e.stopPropagation();
                    this.setState({show: !this.state.show})
                }}>
                    <FontAwesomeIcon icon={this.state.show ? faChevronLeft : faChevronRight} size="2x" className="text-muted"/>
                </div>
                { !_.isEmpty(elevations) ? <CanvasJSChart options = {options}/> : <></>}
                { !_.isEmpty(times) ?
                    <>
                        <h4 className="text-center mt-2"><strong>Track duration</strong></h4>
                        <h5 className="text-center">{this.getTotalTime(this.props.track)}</h5>
                    </> : <></>
                }

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