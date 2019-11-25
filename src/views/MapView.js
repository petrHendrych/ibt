import React, {Component} from 'react';
import SideBar from '../components/SideBar'
import MyMap from '../components/Map'

export default class MapView extends Component {
    render() {
        return (
            <div>
                <SideBar />
                <MyMap />
            </div>
        );
    }
}
