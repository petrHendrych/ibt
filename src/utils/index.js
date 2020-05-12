import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';


export function Spinner(props) {
    return (
        <FontAwesomeIcon className="text-muted" icon={faCircleNotch} size={props.size} spin/>
    );
}

export function validateCoords(coords) {
    const valid = [];

    if (coords[0] >= -90 && coords[0] <= 90) {
        valid.push(true)
    } else {
        valid.push(false);
    }

    if (coords[1] >= -180 && coords[1] <= 180) {
        valid.push(true);
    } else {
        valid.push(false);
    }

    return valid;
}