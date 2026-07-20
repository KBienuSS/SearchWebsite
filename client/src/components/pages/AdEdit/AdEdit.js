import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Form,
  Button,
  Alert,
  Card,
  Row,
  Col,
  Spinner
} from 'react-bootstrap';
import { getUser } from '../../../redux/usersRedux';
import { fetchAdById, updateAd, getAdById, getAdsLoading } from '../../../redux/adsRedux';
import './AdEdit.scss';

const AdEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(getUser);

  const ad = useSelector(getAdById(id));
  const loading = useSelector(getAdsLoading);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: '',
    price: '',
    location: ''
  });
  const [newImage, setNewImage] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    dispatch(fetchAdById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (!ad || initialized) return;

    if (!currentUser || ad.seller?._id !== currentUser.id) {
      navigate('/');
      return;
    }

    setFormData({
      title: ad.title || '',
      content: ad.content || '',
      date: ad.date ? ad.date.slice(0, 10) : '',
      price: ad.price ?? '',
      location: ad.location || ''
    });
    setInitialized(true);
  }, [ad, currentUser, navigate, initialized]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.content || !formData.date ||
        !formData.price || !formData.location) {
      setError('Please fill in all fields.');
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
      if (newImage) {
        data.append('image', newImage);
      }

      await dispatch(updateAd(id, data));
      navigate(`/ad/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !initialized) {
    return (
      <Container className="ad-edit-page py-5 text-center">
        <Spinner animation="border" role="status" />
      </Container>
    );
  }

  if (!initialized) {
    return null;
  }

  return (
    <Container className="ad-edit-page py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="ad-edit-card shadow-sm border-0">
            <Card.Body className="p-4 p-md-5">
              <h1 className="ad-edit-title mb-4">Edit Ad</h1>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} className="ad-edit-form">
                <Form.Group className="mb-3" controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="content">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="content"
                    rows={5}
                    value={formData.content}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Row>
                  <Col xs={12} sm={6}>
                    <Form.Group className="mb-3" controlId="price">
                      <Form.Label>Price (PLN)</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} sm={6}>
                    <Form.Group className="mb-3" controlId="date">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="location">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="image">
                  <Form.Label>Image</Form.Label>

                  {ad.image && !newImage && (
                    <div className="ad-edit-current-image mb-2">
                      <img
                        src={`/uploads/${ad.image}`}
                        alt="Current"
                        className="ad-edit-preview"
                      />
                      <Form.Text className="text-muted d-block">
                        Current image — upload a new one only if you want to replace it.
                      </Form.Text>
                    </div>
                  )}

                  <Form.Control
                    type="file"
                    name="image"
                    accept="image/png, image/jpeg, image/gif"
                    onChange={handleFileChange}
                  />
                  {newImage && (
                    <Form.Text className="text-muted">
                      New image selected: {newImage.name}
                    </Form.Text>
                  )}
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={submitting}
                  className="w-100 ad-edit-submit"
                >
                  {submitting ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdEdit;