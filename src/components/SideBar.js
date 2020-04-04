import React, {Component} from 'react';
import { Accordion, Card } from "react-bootstrap";
import { connect } from 'react-redux';
import {List, AutoSizer, CellMeasurer, CellMeasurerCache} from 'react-virtualized';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

import SideBarCard from './SideBarCard';
import SideBarHeader from './SideBarHeader';
import { selectPoint } from "../actions";
import { Spinner } from "../utils";
import {deleteTrack, getTrack, updateTrack} from "../actions/tracks";
import {TRACK_CLEAR, UNSELECT_POINT} from "../actions/types";


export default class SideBar extends Component {
    constructor(props) {
        super(props);

        this.cacheTracks = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 50
        });

        this.state = {
            isShow: false
        };

        this.isShow = this.isShow.bind(this);
    }

    isShow = () => {
        this.setState({isShow: !this.state.isShow});
    };

    getFileName = (id) => {
        let result = "";
        this.props.files.forEach(track => {
            if (track.id === id) {
                result = track.title;
            }
        });
        return result;
    };

    tracksRenderer = ({index, key, style, parent}) => {
        return (
            <CellMeasurer
                parent={parent}
                key={key}
                cache={this.cacheTracks}
                columnIndex={0}
                rowIndex={index}
            >
                <div className="p-2 clearfix" style={style}>
                    <Card className="side-card"
                          border="success"
                          onClick={() => {this.props.getTrack(this.props.trackList[index].id); this.isShow()}}
                    >
                        <div><strong>{this.props.trackList[index].name}</strong></div>
                        <div>
                            <span className="float-left pt-2">File: {this.getFileName(this.props.trackList[index].gpx_file)}</span>
                            <button
                                className="btn btn-danger btn-sm float-right m-2"
                                onClick={(e) =>
                                    {e.stopPropagation(); this.props.deleteTrack(this.props.trackList[index].id)}
                                }
                            >
                                Delete
                            </button>
                        </div>
                    </Card>
                </div>
            </CellMeasurer>
        )
    };

    render() {
        if (this.props.auth.isLoading || this.props.trackLoading) {
            return (
                <div className="side-bar d-flex flex-column justify-content-between">
                    <SideBarHeader/>
                    <div className="flex-mid">
                        <Spinner size="5x"/>
                    </div>
                    <Footer/>
                </div>
            );
        }

        if (_.isEmpty(this.props.trackList) && this.props.auth.isAuthenticated) {
            return (
                <div className="side-bar d-flex flex-column justify-content-between">
                    <SideBarHeader/>
                    <div className="flex-mid">
                        <span className="new-line text-center">{"No tracks \nUpload gpx file"}</span>
                    </div>
                    <Footer/>
                </div>
            )
        }

        if (_.isEmpty(this.props.trackList)) {
            return (
                <div className="side-bar d-flex flex-column justify-content-between">
                    <SideBarHeader/>
                    <div className="flex-mid">
                        <span
                            className="new-line text-center">{"No tracks available \nPlease login or create new account"}</span>
                    </div>
                    <Footer/>
                </div>
            )
        }

        return (
            <div className="side-bar d-flex flex-column justify-content-between">
                <SideBarHeader />
                <div style={{ flex: '1 1 auto', overflow: 'hidden' }}>
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                rowCount={this.props.trackList.length}
                                width={width}
                                height={height}
                                defferedMeasurementCache={this.cacheTracks}
                                rowHeight={this.cacheTracks.rowHeight}
                                rowRenderer={this.tracksRenderer}
                                overscanRowCount={5}
                            />
                        )}
                    </AutoSizer>
                    <PointContainer show={this.state.isShow} onChange={this.isShow}/>
                </div>
                <Footer/>
            </div>
        );
    }
}

function Footer(props) {
    return (
        <div className="footer p-2">
            <span className="small">
                Tato práce byla vytvořena jako bakalářská práce na <a href="https://www.fit.vut.cz/">Fakultě informačních technologií VUT v Brně</a>
            </span>
        </div>
    )
}

SideBar = connect (
    state => {
        return {
            bounds: state.bounds,
            selectedIndex: state.selectedIndex,
            trackLoading: state.tracks.isLoading,
            trackList: state.tracks.data ? state.tracks.data : [],
            files: state.files.data ? state.files.data : [],
            auth: state.auth,
            track: state.tracks.track
        }
    },
    dispatch => {
        return {
            selectPoint: (p) => dispatch(selectPoint(p)),
            getTrack: (id) => dispatch(getTrack(id)),
            deleteTrack: (id) => dispatch(deleteTrack(id)),
            clearTrack: () => dispatch({type: TRACK_CLEAR}),
            clearIndex: () => dispatch({type: UNSELECT_POINT})
        }
    }
)(SideBar);

class PointContainer extends Component {
    constructor(props) {
        super(props);

        this.cachePoints = new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 25
        });
    }

    bindListRef = ref => {
        this.list = ref;
    };

    makeTimeout = () => {
        setTimeout(() => {
            if (this.list) {
                this.cachePoints.clearAll();
                this.list.forceUpdateGrid();
            }
        }, 1)
    };

    componentDidUpdate(pProps) {
        if (this.list) {
            this.cachePoints.clearAll();
            this.list.forceUpdateGrid();
        }
    };

    pointsRenderer = ({index, key, style, parent}) => {
        return (
            <CellMeasurer
                parent={parent}
                key={key}
                cache={this.cachePoints}
                columnIndex={0}
                rowIndex={index}
            >
                <div style={style}>
                    <Accordion activeKey={this.props.selectedIndex}>
                        <SideBarCard
                            onClick={() => {this.props.selectPoint(index); this.makeTimeout()}}
                            active={index === this.props.selectedIndex}
                            key={`card-${index}`}
                            index={index}
                            coords={this.props.track.geometry.coordinates[0][index]}
                            elevation={this.props.track.properties.elevations[index]}
                            time={this.props.track.properties.times[index]}
                        />
                    </Accordion>
                </div>
            </CellMeasurer>
        )
    };

    render() {
        return (
            <div className={"point-container " + (this.props.show ? "show" : "")}>
                <div onClick={() => {this.props.onChange(); this.props.clearTrack(); this.props.clearIndex()}}
                     className="go-back pointer text-center"
                >
                    <FontAwesomeIcon icon={faArrowRight} className="mr-2"/>
                    <span>back to tracks</span>
                </div>

                <button onClick={() =>
                    {this.props.updateTrack(this.props.track.properties.id, this.props.track); this.props.onChange()}
                }>
                    Update
                </button>

                {!_.isEmpty(this.props.track) ?
                    <div style={{ flex: '1 1 auto' }}>
                        <AutoSizer>
                            {({ height, width }) => (
                                <List
                                    ref={this.bindListRef}
                                    rowCount={this.props.track.geometry.coordinates[0].length}
                                    height={height}
                                    width={width}
                                    defferedMeasurementCache={this.cachePoints}
                                    rowHeight={this.cachePoints.rowHeight}
                                    rowRenderer={this.pointsRenderer}
                                    overscanRowCount={45}
                                />
                            )}
                        </AutoSizer>
                    </div>
                    :
                    <></>
                }
            </div>
        )
    }
}

PointContainer = connect (
    state => {
        return {
            bounds: state.bounds,
            selectedIndex: state.selectedIndex,
            track: state.tracks.track
        }
    },
    dispatch => {
        return {
            selectPoint: (p) => dispatch(selectPoint(p)),
            updateTrack: (id, track) => dispatch(updateTrack(id, track)),
            clearTrack: () => dispatch({type: TRACK_CLEAR}),
            clearIndex: () => dispatch({type: UNSELECT_POINT})
        }
    }
)(PointContainer);
