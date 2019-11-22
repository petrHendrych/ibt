import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';


export function Spinner(props) {
    return (
        <FontAwesomeIcon className="text-muted" icon={faCircleNotch} size={props.size} spin/>
    );
}