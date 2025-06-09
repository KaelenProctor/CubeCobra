import React, { useContext, useState } from 'react';

import { EyeClosedIcon, LinkExternalIcon } from '@primer/octicons-react';

import CardKingdomBulkButton from 'components/purchase/CardKingdomBulkButton';
import ManaPoolBulkButton from 'components/purchase/ManaPoolBulkButton';
import TCGPlayerBulkButton from 'components/purchase/TCGPlayerBulkButton';
import { getCubeDescription, getCubeId } from 'utils/Util';

import BaseUrlContext from '../../contexts/BaseUrlContext';
import { CSRFContext } from '../../contexts/CSRFContext';
import CubeContext from '../../contexts/CubeContext';
import UserContext from '../../contexts/UserContext';
import useAlerts from '../../hooks/UseAlerts';
import Button from '../base/Button';
import { Card, CardBody, CardFooter, CardHeader } from '../base/Card';
import { Col, Flexbox, Row } from '../base/Layout';
import Link from '../base/Link';
import Tag from '../base/Tag';
import Text from '../base/Text';
import Tooltip from '../base/Tooltip';
import Markdown from '../Markdown';
import ConfirmActionModal from '../modals/ConfirmActionModal';
import FollowersModal from '../modals/FollowersModal';
import QRCodeModal from '../modals/QRCodeModal';
import MtgImage from '../MtgImage';
import TextBadge from '../TextBadge';
import Username from '../Username';
import withModal from '../WithModal';
import CubeIdModal from './CubeIdModal';

const FollowersModalLink = withModal(Link, FollowersModal);
const CubeIdModalLink = withModal(Link, CubeIdModal);
const QRCodeModalLink = withModal(Link, QRCodeModal);
const ConfirmActionModalButton = withModal(Link, ConfirmActionModal);
interface PrivateCubeIconProps {
  visibility: string;
}

const PrivateCubeIcon: React.FC<PrivateCubeIconProps> = ({ visibility }) => {
  const visibilityWord = visibility === 'pr' ? 'private' : 'unlisted';
  return (
    <Tooltip
      text={`This cube is set as ${visibilityWord}.`}
      wrapperTag="span"
      className="text-secondary"
      style={{ position: 'relative', top: '-3px' }}
    >
      <EyeClosedIcon size={24} />
    </Tooltip>
  );
};

interface CubeOverviewCardProps {
  priceOwned: number;
  pricePurchase: number;
  followersCount: number;
  followed: boolean;
}

const CubeOverviewCard: React.FC<CubeOverviewCardProps> = ({ followed, priceOwned, pricePurchase, followersCount }) => {
  const { csrfFetch } = useContext(CSRFContext);
  const { cube } = useContext(CubeContext);
  const user = useContext(UserContext);
  const [followedState, setFollowedState] = useState(followed);
  const { addAlert } = useAlerts();
  const baseUrl = useContext(BaseUrlContext);

  const follow = () => {
    setFollowedState(true);

    csrfFetch(`/cube/follow/${cube.id}`, {
      method: 'POST',
      headers: {},
    }).then((response) => {
      if (!response.ok) {
        // eslint-disable-next-line no-console -- Debugging
        console.error(response);
      }
    });
  };

  const unfollow = () => {
    setFollowedState(false);

    csrfFetch(`/cube/unfollow/${cube.id}`, {
      method: 'POST',
      headers: {},
    }).then((response) => {
      if (!response.ok) {
        // eslint-disable-next-line no-console -- Debugging
        console.error(response);
      }
    });
  };

  return (
    <Flexbox direction="col" gap="2">
      <Row>
        <Col xs={12} md={6} lg={5} xl={4}>
          <Card>
            <CardHeader>
              <Flexbox direction="row" justify="between">
                <Text xl semibold>
                  {cube.name} {cube.visibility !== 'pu' && <PrivateCubeIcon visibility={cube.visibility} />}
                </Text>
                <TextBadge name="Cube ID">
                  <CubeIdModalLink
                    className="text-xs"
                    modalprops={{
                      shortId: cube.shortId,
                      fullID: cube.id,
                      alert: addAlert,
                    }}
                  >
                    {getCubeId(cube)}
                  </CubeIdModalLink>
                </TextBadge>
              </Flexbox>
            </CardHeader>
            <MtgImage image={cube.image} showArtist className="w-full" />
            <CardBody>
              <Flexbox direction="col" gap="1">
                <Flexbox direction="row" justify="between">
                  <Text semibold md>
                    {getCubeDescription(cube)}
                  </Text>
                  <FollowersModalLink href="#" modalprops={{ id: cube.id, type: 'cube' }}>
                    {followersCount} {followersCount === 1 ? 'follower' : 'followers'}
                  </FollowersModalLink>
                </Flexbox>
                <Flexbox direction="row" justify="between">
                  <Text italic>
                    {'Designed by '}
                    <Username user={cube.owner} />
                  </Text>
                </Flexbox>
                <Flexbox direction="row" justify="between" wrap="wrap">
                  <Link href={`/cube/rss/${cube.id}`}>RSS Feed</Link>
                  {' • '}
                  <QRCodeModalLink href="#" modalprops={{ link: `${baseUrl}/c/${cube.id}`, cubeName: cube.name }}>
                    QR Code
                  </QRCodeModalLink>
                  {' • '}
                  <Link href={`https://luckypaper.co/resources/cube-map/?cube=${cube.id}`}>
                    View in Cube Map <LinkExternalIcon size={16} />
                  </Link>
                  {' • '}
                  <ConfirmActionModalButton
                    modalprops={{
                      title: 'Report Cube',
                      message:
                        'Are you sure you want to report this cube? A moderator will review the report and take appropriate action.',
                      target: `/cube/report/${cube.id}`,
                      buttonText: 'Report Cube',
                    }}
                  >
                    Report Cube
                  </ConfirmActionModalButton>
                </Flexbox>
                {cube.priceVisibility === 'pu' && (
                  <>
                    <Flexbox direction="row" gap="2">
                      {Number.isFinite(priceOwned) && (
                        <TextBadge name="Owned">
                          <Tooltip text="TCGPlayer Market Price as owned (cards marked as any type of ownership, or Ordered)">
                            ${Math.round(priceOwned).toLocaleString()}
                          </Tooltip>
                        </TextBadge>
                      )}
                      {Number.isFinite(pricePurchase) && (
                        <TextBadge name="Buy">
                          <Tooltip text="TCGPlayer Market Price for cheapest version of each card">
                            ${Math.round(pricePurchase).toLocaleString()}
                          </Tooltip>
                        </TextBadge>
                      )}
                    </Flexbox>
                    <Text md semibold>
                      Purchase
                    </Text>
                    <TCGPlayerBulkButton cards={cube.cards.mainboard} />
                    <ManaPoolBulkButton cards={cube.cards.mainboard} />
                    <CardKingdomBulkButton cards={cube.cards.mainboard} />
                  </>
                )}
                {user && user.roles && user.roles.includes('Admin') && (
                  <Button
                    color="accent"
                    type="link"
                    disabled={cube.visibility !== 'pu'}
                    href={`/cube/${cube.featured ? 'unfeature/' : 'feature/'}${cube.id}`}
                  >
                    {cube.featured ? 'Remove from featured' : 'Add to featured'}
                  </Button>
                )}
                {user &&
                  cube.owner.id !== user.id &&
                  (followedState ? (
                    <Button color="danger" block onClick={unfollow}>
                      Unfollow
                    </Button>
                  ) : (
                    <Button color="primary" block onClick={follow}>
                      Follow
                    </Button>
                  ))}
              </Flexbox>
            </CardBody>
          </Card>
        </Col>
        <Col xs={12} md={6} lg={7} xl={8}>
          <Card>
            <CardBody>
              <Markdown markdown={cube.description || ''} />
            </CardBody>
            {cube.tags && cube.tags.length > 0 && (
              <CardFooter>
                <Flexbox direction="row" gap="2" wrap="wrap">
                  {cube.tags.map((tag) => (
                    <Tag href={`/search?q=${encodeURIComponent(`tag:"${tag}"`)}`} key={tag} text={tag} />
                  ))}
                </Flexbox>
              </CardFooter>
            )}
          </Card>
        </Col>
      </Row>
    </Flexbox>
  );
};

export default CubeOverviewCard;
