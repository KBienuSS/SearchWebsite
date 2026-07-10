import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert
} from 'reactstrap';
import '../../../styles/AuthStyles.scss';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    login: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.login || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          login: formData.login,
          password: formData.password
        })
      });

      if (response.status === 409) {
        setError('This login is already taken.');
        return;
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || errData?.error || 'Registration failed');
      }

      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="auth-page">
      <h1>Sign Up</h1>

      {error && <Alert color="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} className="auth-form">
        <FormGroup>
          <Label for="login">Login</Label>
          <Input
            type="text"
            name="login"
            id="login"
            value={formData.login}
            onChange={handleChange}
            placeholder="Choose a login"
          />
        </FormGroup>

        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
        </FormGroup>

        <FormGroup>
          <Label for="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repeat your password"
          />
        </FormGroup>

        <Button color="primary" type="submit" disabled={submitting} block>
          {submitting ? 'Creating account...' : 'Sign Up'}
        </Button>
      </Form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Container>
  );
};

export default RegisterPage;