import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Spinner,
  Alert,
  Modal
} from 'react-bootstrap';
import { getUser } from '../../../redux/usersRedux';
import { fetchAdById, deleteAd, getAdById, getAdsLoading, getAdsError } from '../../../redux/adsRedux';
import './Ad.scss';

const getInitials = (login) => {
  if (!login) return '?';
  return login.slice(0, 2).toUpperCase();
};

const Ad = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(getUser);

  const ad = useSelector(getAdById(id));
  const loading = useSelector(getAdsLoading);
  const error = useSelector(getAdsError);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    dispatch(fetchAdById(id));
  }, [id, dispatch]);

  const isOwner = currentUser && ad?.seller?._id === currentUser.id;

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await dispatch(deleteAd(id));
      navigate('/');
    } catch (err) {
      setDeleteError(err.message);
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading && !ad) {
    return (
      <Container className="ad-page py-5 text-center">
        <Spinner animation="border" role="status" />
      </Container>
    );
  }

  if (error && !ad) {
    return (
      <Container className="ad-page py-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Back to home
        </Button>
      </Container>
    );
  }

  if (!ad) {
    return null;
  }

  const showAvatarImage = ad.seller?.avatar && !avatarError;

  return (
    <Container className="ad-page py-5">
      <Row className="justify-content-center">
        <Col xs={12} lg={9}>
          <Card className="ad-card shadow-sm border-0">
            <Row className="g-0">
              <Col md={6}>
                <div className="ad-image-wrapper">
                  <img
                    src={`/uploads/${ad.image}`}
                    alt={ad.title}
                    className="ad-image"
                  />
                </div>
              </Col>

              <Col md={6}>
                <Card.Body className="p-4 p-md-5 d-flex flex-column h-100">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h1 className="ad-title mb-0">{ad.title}</h1>
                    <Badge bg="success" className="ad-price">
                      {ad.price} PLN
                    </Badge>
                  </div>

                  <div className="ad-meta mb-3">
                    <span className="ad-meta-item">{ad.location}</span>
                    <span className="ad-meta-separator">•</span>
                    <span className="ad-meta-item">
                      Published: {new Date(ad.date).toLocaleDateString('pl-PL')}
                    </span>
                  </div>

                  <p className="ad-description flex-grow-1">{ad.content}</p>

                  <div className="ad-seller mb-4">
                    <div className="ad-seller-label">Seller</div>
                    <div className="d-flex align-items-center gap-2 mt-2">
                      {showAvatarImage ? (
                        <img
                          src={`/uploads/${ad.seller.avatar}`}
                          alt={ad.seller?.login}
                          className="ad-seller-avatar"
                          onError={() => setAvatarError(true)}
                        />
                      ) : (
                        <div className="ad-seller-avatar ad-seller-avatar-fallback">
                          {getInitials(ad.seller?.login)}
                        </div>
                      )}
                      <div>
                        <div className="ad-seller-login">{ad.seller?.login}</div>
                        {ad.seller?.phone && (
                          <div className="ad-seller-phone">{ad.seller.phone}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {deleteError && (
                    <Alert variant="danger" className="mb-3">{deleteError}</Alert>
                  )}

                  {isOwner && (
                    <div className="ad-owner-actions d-flex gap-2">
                      <Button as={Link} to={`/ad/edit/${ad._id}`} variant="outline-primary">
                        Edit
                      </Button>
                      <Button variant="outline-danger" onClick={() => setShowConfirm(true)}>
                        Delete
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete this ad?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This action cannot be undone. Are you sure you want to delete "{ad.title}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Ad;