import React, {Component} from 'react';

export default class Input extends Component {
    state = { value: this.props.val };

    onInputChange = event => {
        const latRe = /^([+-])?(?:90(?:(?:\.0{0,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{0,6})?))$/;
        const lngRe = /^([+-])?(?:180(?:(?:\.0{0,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{0,6})?))$/;

        if (this.props.label === "Lat") {
            if (event.target.value === '' || latRe.test(event.target.value)) {
                this.setState({value: event.target.value}, () => {
                    this.props.onChange(this.state.value, 0);
                });
            } else if (event.target.value === '' || lngRe.test(event.target.value)) {
                this.setState({value: event.target.value}, () => {
                    this.props.onChange(this.state.value, 1);
                })
            }
        }
        // if (event.target.value === '' || re.test(event.target.value)) {
        //     this.setState({value: event.target.value}, () => {
        //         if (this.props.label === "Lat") {
        //             this.props.onChange(this.state.value, 0);
        //         } else {
        //             this.props.onChange(this.state.value, 1);
        //         }
        //     });
        // }
    };

    onInputBlur = () => {
        this.props.onBlur();
    };

    componentDidUpdate(prevProps) {
        if (this.props.val !== prevProps.val) {
            this.setState({value: this.props.val})
        }
    }

    render () {
        return (
            <div className="input-group input-group-sm mb-2 d-inline-flex w-50">
                <div className="input-group-prepend">
                    <span className="input-group-text justify-content-center input-span">{this.props.label}</span>
                </div>
                <input
                    className="pl-1 side-bar-input"
                    type="text"
                    value={this.state.value}
                    onChange={this.onInputChange}
                    onBlur={this.onInputBlur}
                />
            </div>
        );
    }
}