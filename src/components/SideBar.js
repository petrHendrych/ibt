import React, {Component} from 'react';
import { Accordion } from "react-bootstrap";
import { connect } from 'react-redux';
import {List, AutoSizer, CellMeasurer, CellMeasurerCache} from 'react-virtualized';
import _ from 'lodash';

import SideBarCard from './SideBarCard';
import SideBarHeader from './SideBarHeader';
import { selectPoint } from "../actions";
import { Spinner } from "../utils";
import {getTrack} from "../actions/tracks";


export default class SideBar extends Component {

    rowRenderer = ({index, key, isScrolling, style}) => {
        return (
            <div key={key} style={style} onClick={() => this.props.getTrack(this.props.trackList[index].id)}>
                <div>{this.props.trackList[index].name}</div>
            </div>
        )
    };

    render() {

        if (this.props.trackLoading) {
            return (
                <div className="side-bar">
                    <SideBarHeader/>
                    <div className="flex-mid">
                        <Spinner size="5x"/>
                    </div>
                </div>
            );
        }

        return (
            <div className="side-bar d-flex flex-column justify-content-between">
                <SideBarHeader />
                <div style={{ flex: '1 1 auto' }}>
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                rowCount={this.props.trackList.length}
                                width={width}
                                height={height}
                                rowHeight={40}
                                rowRenderer={this.rowRenderer}
                                overscanRowCount={3}
                            />
                        )}
                    </AutoSizer>
                </div>
                {/*<div className="list-area">*/}
                    {/*<AutoSizer disableHeight={} disableWidth={}/>*/}
                    {/**/}
                {/*</div>*/}

                {/*{this.props.trackList.map((track) =>*/}
                    {/*<li key={track.id} onClick={() => this.props.getTrack(track.id)}>{track.name}</li>*/}
                {/*)}*/}
                <Footer/>
                {/*<Accordion activeKey={this.props.selectedIndex}>*/}
                    {/*{this.props.data.features[1].geometry.coordinates.map((coordinates, index) =>*/}
                        {/*<SideBarCard*/}
                            {/*onClick={() => this.props.selectPoint(index)}*/}
                            {/*active={index === this.props.selectedIndex}*/}
                            {/*key={`card-${index}`}*/}
                            {/*index={index}*/}
                            {/*coords={coordinates}*/}
                            {/*render={this.props.bounds.length === 2}*/}
                        {/*/>*/}
                    {/*)}*/}
                {/*</Accordion>*/}
            </div>
        );
    }
}

function Footer(props) {
    return (
        <div className="footer mb-2">
            <span className="small">Tato práce byla vytvořena jako bakalářská práce na
                <a href="https://www.fit.vut.cz/"> Fakultě informačních technologií VUT v Brně</a>
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
            trackList: state.tracks.data ? state.tracks.data : []
        }
    },
    dispatch => {
        return {
            selectPoint: (p) => dispatch(selectPoint(p)),
            getTrack: (id) => dispatch(getTrack(id))
        }
    }
)(SideBar);


