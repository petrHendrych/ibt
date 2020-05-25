/**
 * @author Petr Hendrych <xhendr03@fit.vutbr.cz>
 * @file Simple main view of application
 */

import React, {Component} from 'react';
import SideBar from '../components/SideBar';
import MyMap from '../components/Map';
import Alerts from "../components/Alerts";

export default class MainView extends Component {
    render() {
        return (
            <>
                <SideBar />
                <Alerts/>
                <MyMap />
            </>
        );
    }
}
