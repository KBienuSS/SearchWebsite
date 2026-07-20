import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import '../../../styles/AuthStyles.scss';
import { API_URL } from '../../../config';
import { useDispatch } from 'react-redux';
import { logIn } from '../../../redux/usersRedux';

const LoginPage = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const options = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    };

    setStatus('loading');
    fetch(`${API_URL}/auth/login`, options)
    .then(async res => {
      if (res.status === 200) {
        const userRes = await fetch(`${API_URL}/auth/user`, {
          method: 'GET',
          credentials: 'include',
        });
        const userData = await userRes.json();
        dispatch(logIn(userData.user));

        setStatus('success');
        setTimeout(() => navigate('/'), 1000);
      } else if (res.status === 400) {
        setStatus('incorrectData');
      } else {
        setStatus('error');
      }
    })
    .catch(err => {
      setStatus('error');
    });
  };

  return (
    <Container className="auth-page">
      <h1>Sign In</h1>

      {status === 'success' && (
        <Alert variant="success">
          <Alert.Heading>Success!</Alert.Heading>
          <p>You have been successfully logged in!</p>
        </Alert>
      )}

      {status === 'error' && (
        <Alert variant="danger">
          <Alert.Heading>Something went wrong...</Alert.Heading>
          <p>Unexpected error... Try again!</p>
        </Alert>
      )}

      {status === 'incorrectData' && (
        <Alert variant="danger">
          <Alert.Heading>Incorrect data</Alert.Heading>
          <p>Login or password are incorrect...</p>
        </Alert>
      )}

      {status === 'loading' && (
        <Spinner animation='border' role='status' className='block mx-auto'>
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      )}

      <Form onSubmit={handleSubmit} className="auth-form">
        <Form.Group>
          <Form.Label>Login</Form.Label>
          <Form.Control
            type="text"
            name="login"
            id="login"
            value={login}
            onChange={e => setLogin(e.target.value)}
            placeholder="Your login"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Your password"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      <p className="auth-switch">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Container>
  );
};

export default LoginPage;