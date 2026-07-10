import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert
} from 'reactstrap';
import './NewAd.scss';

const NewAd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: '',
    price: '',
    location: ''
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // podstawowa walidacja po stronie klienta
    if (!formData.title || !formData.content || !formData.date ||
        !formData.price || !formData.location || !image) {
      setError('Please fill in all fields and select an image.');
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('date', formData.date);
      data.append('price', formData.price);
      data.append('location', formData.location);
      data.append('image', image);

      const response = await fetch('/api/ads', {
        method: 'POST',
        credentials: 'include', // wysyła cookie sesji
        body: data
        // UWAGA: nie ustawiaj ręcznie Content-Type - przeglądarka
        // sama doda poprawny multipart/form-data z boundary
      });

      if (response.status === 401) {
        setError('You must be logged in to add an ad.');
        return;
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || errData?.message || 'Failed to create ad');
      }

      const created = await response.json();
      navigate(`/ads/${created._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="add-ad-page">
      <h1>Add New Ad</h1>

      {error && <Alert color="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} className="add-ad-form">
        <FormGroup>
          <Label for="title">Title</Label>
          <Input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Mountain bike, barely used"
          />
        </FormGroup>

        <FormGroup>
          <Label for="content">Description</Label>
          <Input
            type="textarea"
            name="content"
            id="content"
            rows={5}
            value={formData.content}
            onChange={handleChange}
            placeholder="Describe your item..."
          />
        </FormGroup>

        <FormGroup>
          <Label for="price">Price (PLN)</Label>
          <Input
            type="number"
            name="price"
            id="price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
          />
        </FormGroup>

        <FormGroup>
          <Label for="location">Location</Label>
          <Input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Kraków"
          />
        </FormGroup>

        <FormGroup>
          <Label for="date">Date</Label>
          <Input
            type="date"
            name="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label for="image">Image</Label>
          <Input
            type="file"
            name="image"
            id="image"
            accept="image/png, image/jpeg, image/gif"
            onChange={handleFileChange}
          />
        </FormGroup>

        <Button color="primary" type="submit" disabled={submitting} block>
          {submitting ? 'Publishing...' : 'Publish Ad'}
        </Button>
      </Form>
    </Container>
  );
};

export default AddAdPage;