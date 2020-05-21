import React, {Component} from 'react';
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {Redirect} from "react-router";
import {connect} from "react-redux";
import PropTypes from "prop-types";

import {registerUser, invalidPasswords} from "../actions/auth";
import Alerts from "../components/Alerts";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons/index";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index.es";

class RegisterView extends Component {
    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to={"/"}/>
        }
        return (
            <Container className="w-50">
                <Alerts/>
                <Row className="justify-content-center align-items-center flex-fill">
                    <Col>
                        <Card className="p-4 mt-5">
                            <Card.Body>
                                <h1>Register</h1>
                                <p className="text-muted">Create new account. All fields are required</p>
                                <RegisterForm registerUser={this.props.registerUser} isAuthenticated={this.props.isAuthenticated}/>
                                <p className="mt-4">Already have an account? <Link to="/login">Login here!</Link></p>
                                <p><Link to="/"><FontAwesomeIcon icon={faArrowLeft} className="mr-2"/>Back to homepage</Link></p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {registerUser})(RegisterView);

class RegisterForm extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        password2: ''
    };

    static propTypes = {
        registerUser: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool
    };

    onSubmit = (e) => {
        e.preventDefault();
        const { username, email, password, password2 } = this.state;
        if (password !== password2) {
            this.props.invalidPasswords();
        } else {
            const newUser = {
                username,
                email,
                password
            };

            this.props.registerUser(newUser);
        }
    };

    onChange = (e) => {
        if (e.target.name === "username") {
            if (e.target.value.length < 16) {
                this.setState({[e.target.name]: e.target.value});
            }
        } else {
            this.setState({ [e.target.name]: e.target.value });
        }
    };

    render() {
        const {username, email, password, password2} = this.state;

        return (
            <Form onSubmit={this.onSubmit}>
                <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" onChange={this.onChange} value={username}
                    name="username" required/>
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="example@gmail.com" onChange={this.onChange} value={email}
                    name="email" required/>
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" onChange={this.onChange} value={password} name="password" required/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Verity password</Form.Label>
                    <Form.Control type="password" onChange={this.onChange} value={password2} name="password2" required/>
                    <Form.Text className="text-muted">
                        Verify password by entering the same password from the above field.
                    </Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Register
                </Button>
            </Form>
        );
    }
}

RegisterForm = connect (
    null,
    dispatch => {
        return {
            invalidPasswords: () => dispatch(invalidPasswords())
        }
    }
)(RegisterForm);