import React, {Component} from 'react';
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import {Link} from "react-router-dom";

export default class LoginView extends Component {
    render() {
        return (
            <Container className="w-50">
                <Row className="justify-content-center align-items-center flex-fill">
                    <Col>
                        <Card className="p-4 mt-5">
                            <Card.Body>
                                <h1>Login</h1>
                                <p className="text-muted">All fields are required</p>
                                <LoginForm />
                                <p className="mt-4">Do not have an account, yet? <Link to="/register">Register here!</Link></p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}

class LoginForm extends Component {
    render() {
        return (
            <Form>
                <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="email" placeholder="Enter username" />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        );
    }
}