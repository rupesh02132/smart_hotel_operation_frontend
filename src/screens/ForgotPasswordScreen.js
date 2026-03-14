import { useState } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../state/auth/Action";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link } from "react-router-dom";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const { loading, error, message } = useSelector((state) => state.auth);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!email) return;
    dispatch(forgotPassword(email));
  };

  return (
    <Row className="justify-content-md-center">
      <Col xs={12} md={6}>
        <h2 className="mb-4">Forgot Password</h2>

        {error && <Message variant="danger">{error}</Message>}
        {message && <Alert variant="success">{message}</Alert>}
        {loading && <Loader />}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="mt-3 w-100">
            Send Reset Link
          </Button>
        </Form>

        <div className="mt-3 text-center">
          <Link to="/login">Back to Login</Link>
        </div>
      </Col>
    </Row>
  );
};

export default ForgotPasswordScreen;
