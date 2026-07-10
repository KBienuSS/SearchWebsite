import { Link } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import './AdCard.scss';

const AdCard = ({ ad }) => (
  <Card className="h-100">
    <div className="ad-image-wrapper">
      <img
        src={`/uploads/${ad.image}`}
        alt={ad.title}
        className="ad-image"
      />
    </div>
    <CardBody className="d-flex flex-column">
      <CardTitle tag="h5">{ad.title}</CardTitle>
      <CardText className="text-muted">{ad.location}</CardText>
      <Link to={`/ads/${ad._id}`} className="mt-auto">
        <Button color="primary" block>Read more</Button>
      </Link>
    </CardBody>
  </Card>
);

export default AdCard;