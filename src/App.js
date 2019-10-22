import React, { Component } from 'react'
import SideBar from './components/SideBar'
import MyMap from './components/Map'
import './stylesheets/style.css'

export default class App extends Component {
    render() {
        return (
            <div>
                <SideBar />
                <MyMap />
            </div>
        );
    }
}