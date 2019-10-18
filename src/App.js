import React, { Component } from 'react'
import SideBar from './components/SideBar'
import MyMap from './components/Map'
import './stylesheets/style.css'

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            coordinates: [
                [
                    14.2883905,
                    49.9277237,
                    197.2075195
                ],
                [
                    14.2883125,
                    49.9277363,
                    197.2075195
                ],
                [
                    14.288353,
                    49.9275056,
                    197.6882324
                ],
                [
                    14.2884425,
                    49.9273289,
                    202.494873
                ],
                [
                    14.2882301,
                    49.9271829,
                    203.9368896
                ]
            ]
        };
    }

    getState = (childState) => {
        this.setState({mapData: childState});
    };

    render() {
        return (
            <div>
                <MyMap getState={this.getState}/>
                <SideBar coordinates={this.state.coordinates}/>
            </div>
        );
    }
}