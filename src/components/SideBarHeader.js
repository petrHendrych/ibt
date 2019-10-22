import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons'

export default class SideBarHeader extends Component {
    render() {
        return (
            <div className="side-bar-header">
                <div className="box text-center border-right h-100">
                    <FontAwesomeIcon icon={faMapMarkedAlt} className="mr-2"/>
                    Moje trasy
                </div>
                <div className="box text-center h-100">
                    <FontAwesomeIcon icon={faUser} className="mr-2"/>
                    Petr Hendrych
                </div>
            </div>
        );
    }
}