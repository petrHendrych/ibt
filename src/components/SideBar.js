import React, {Component} from 'react';
import {Accordion, Card, OverlayTrigger, Tooltip} from "react-bootstrap";
import { connect } from 'react-redux';
import {List, AutoSizer, CellMeasurer, CellMeasurerCache} from 'react-virtualized';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTrashAlt, faSave } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

import SideBarCard from './SideBarCard';
import SideBarHeader from './SideBarHeader';
import {deletePoints, selectPoint} from "../actions/points";
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

    deleteTrackHandler = (id) => {
        if (window.confirm("Are you sure you want to delete this track?")) {
            this.props.deleteTrack(id);
        }
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    this.deleteTrackHandler(this.props.trackList[index].id);
                                }}
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

    state = {
        toggleDelete: false,
        checkAll: false,
        checked: []
    };

    componentDidUpdate(pProps) {
        if (this.list) {
            this.cachePoints.clearAll();
            this.list.forceUpdateGrid();
        }
    };

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

    toggleCheckboxes = (toggle = true) => {
        if (toggle) {
            this.setState({
                toggleDelete: !this.state.toggleDelete,
                checked: [],
                checkAll: false
            });
        }
    };

    toggleDelete = (indexes) => {
        if (this.state.toggleDelete) {
            if (window.confirm("Are you sure you want to delete these points?")) {
                this.props.deletePoints(indexes);
                this.toggleCheckboxes();
            }
        } else {
            this.toggleCheckboxes();
        }
    };

    checkAll = () => {
        this.setState({checkAll: !this.state.checkAll}, () => {
            let arr = this.state.checked;

            if (this.state.checkAll) {
                for (let i = 0; i < this.props.track.geometry.coordinates[0].length; i++) {
                    if (arr.includes(i)) {continue;}
                    arr = [...arr, i];
                }
                this.setState({checked: arr});
            } else {
                this.setState({checked: []});
            }
        });
    };

    checkboxHandler = (index) => {
        if (this.state.checked.includes(index)) {
            this.setState({checked: this.state.checked.filter(idx => idx !== index)})
        } else {
            this.setState({checked: [...this.state.checked, index]});
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
                            delete={this.state.toggleDelete}
                            checked={this.checkboxHandler}
                            all={this.state.checkAll}
                        />
                    </Accordion>
                </div>
            </CellMeasurer>
        )
    };

    render() {
        return (
            <div className={"point-container " + (this.props.show ? "show" : "")}>
                <nav className="navigation text-center">
                    <OverlayTrigger placement="bottom" overlay={<Tooltip className="nav-tooltip" id="tooltip-disabled">back to tracks</Tooltip>}>
                        <FontAwesomeIcon
                            onClick={() => {
                                this.props.onChange();
                                this.props.clearTrack();
                                this.props.clearIndex();
                                this.toggleCheckboxes(this.state.toggleDelete)
                            }}
                            icon={faArrowRight}
                            className="pointer"
                        />
                    </OverlayTrigger>
                    <div className="mx-5 d-inline-block">
                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-disabled">save changes</Tooltip>}>
                            <FontAwesomeIcon
                                onClick={() => this.props.updateTrack(this.props.track.properties.id, this.props.track)}
                                icon={faSave}
                                className="pointer"
                            />
                        </OverlayTrigger>
                    </div>
                    <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-disabled">delete multiple points</Tooltip>}>
                          <FontAwesomeIcon
                              icon={faTrashAlt}
                              className={"pointer " + (this.state.toggleDelete ? "text-danger" : "")}
                              onClick={(e) => {
                                  e.stopPropagation();
                                  this.toggleDelete(this.state.checked);
                                  this.props.selectPoint(this.props.selectedIndex);
                              }}
                          />
                    </OverlayTrigger>
                    { this.state.toggleDelete ?
                        <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-disabled">select all</Tooltip>}>
                            <input
                                type="checkbox"
                                className="select-all-checkbox"
                                onClick={() => this.checkAll()}
                            />
                        </OverlayTrigger> :
                        <></>
                    }
                </nav>

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
            deletePoints: (indexes) => dispatch(deletePoints(indexes)),
            clearTrack: () => dispatch({type: TRACK_CLEAR}),
            clearIndex: () => dispatch({type: UNSELECT_POINT})
        }
    }
)(PointContainer);
