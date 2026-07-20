import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import AdCard from '../AdCard/AdCard';
import { fetchAdsByPhrase, getAds, getAdsLoading, getAdsError } from '../../../redux/adsRedux';
import './Search.scss';

const Search = () => {
  const { searchPhrase } = useParams();
  const dispatch = useDispatch();

  const ads = useSelector(getAds);
  const loading = useSelector(getAdsLoading);
  const error = useSelector(getAdsError);

  useEffect(() => {
    dispatch(fetchAdsByPhrase(searchPhrase));
  }, [dispatch, searchPhrase]);

  return (
    <Container className="search-page py-5">
      <h1 className="search-title mb-4">
        Search results for: "{decodeURIComponent(searchPhrase)}"
      </h1>

      {loading && (
        <div className="search-spinner-wrapper text-center">
          <Spinner animation="border" variant="primary" role="status" />
        </div>
      )}

      {!loading && error && (
        <Alert variant="danger">{error}</Alert>
      )}

      {!loading && !error && ads.length === 0 && (
        <div className="search-empty-state">
          <p>No ads found for this search.</p>
        </div>
      )}

      {!loading && !error && ads.length > 0 && (
        <Row className="ads-grid g-4">
          {ads.map((ad) => (
            <Col key={ad._id} xs={12} sm={6} md={4}>
              <AdCard ad={ad} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Search;