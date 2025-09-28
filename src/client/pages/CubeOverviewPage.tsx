import React, { useContext } from 'react';

import Button from 'components/base/Button';
import Controls from 'components/base/Controls';
import { Flexbox } from 'components/base/Layout';
import Link from 'components/base/Link';
import Tooltip from 'components/base/Tooltip';
import BlogPost from 'components/blog/BlogPost';
import CubeOverviewCard from 'components/cube/CubeOverviewCard';
import DynamicFlash from 'components/DynamicFlash';
import CubeOverviewModal from 'components/modals/CubeOverviewModal';
import CubeSettingsModal from 'components/modals/CubeSettingsModal';
import CustomizeBasicsModal from 'components/modals/CustomizeBasicsModal';
import DeleteCubeModal from 'components/modals/DeleteCubeModal';
import RenderToRoot from 'components/RenderToRoot';
import withModal from 'components/WithModal';
import UserContext from 'contexts/UserContext';
import BlogPostType from 'datatypes/BlogPost';
import Cube, { CubeCards } from 'datatypes/Cube';
import useAlerts from 'hooks/UseAlerts';
import CubeLayout from 'layouts/CubeLayout';
import MainLayout from 'layouts/MainLayout';

const CubeOverviewModalLink = withModal(Link, CubeOverviewModal);
const CubeSettingsModalLink = withModal(Link, CubeSettingsModal);
const DeleteCubeModalLink = withModal(Link, DeleteCubeModal);
const CustomizeBasicsModalLink = withModal(Link, CustomizeBasicsModal);

interface CubeOverviewProps {
  post: BlogPostType;
  priceOwned: number;
  pricePurchase: number;
  cube: Cube;
  cards: CubeCards;
  followed: boolean;
  followersCount: number;
}

const CubeOverview: React.FC<CubeOverviewProps> = ({
  post,
  cards,
  priceOwned,
  pricePurchase,
  cube,
  followed,
  followersCount,
}) => {
  const user = useContext(UserContext);
  const { alerts, addAlert } = useAlerts();

  return (
    <MainLayout>
      <CubeLayout cards={cards} cube={cube} activeLink="overview" hasControls={!!user && cube.owner.id === user.id}>
        <Flexbox direction="col" gap="2" className="mb-2">
          {user && cube.owner.id === user.id && (
            <Controls>
              <Flexbox direction="row" justify="start" gap="4" alignItems="center" className="py-2 px-4">
                {(cube.cardCount > 0 && (
                  <CubeOverviewModalLink
                    modalprops={{
                      cube: cube,
                    }}
                  >
                    Edit Overview
                  </CubeOverviewModalLink>
                )) || (
                  <Tooltip text="Please add at least one card to the cube in order to edit the overview. This is a spam prevention mechanism.">
                    Edit Overview
                  </Tooltip>
                )}
                <CubeSettingsModalLink modalprops={{ addAlert, onCubeUpdate: () => {} }}>
                  Edit Settings
                </CubeSettingsModalLink>
                <CustomizeBasicsModalLink
                  modalprops={{
                    cube: cube,
                    onError: (message: string) => {
                      addAlert('danger', message);
                    },
                  }}
                >
                  Customize basics
                </CustomizeBasicsModalLink>
                <DeleteCubeModalLink modalprops={{ cube }}>Delete Cube</DeleteCubeModalLink>
              </Flexbox>
            </Controls>
          )}
          <DynamicFlash />
          {alerts.map(({ color, message }, index) => (
            <div className={`alert alert-${color}`} key={index}>
              {message}
            </div>
          ))}
          <CubeOverviewCard
            priceOwned={priceOwned}
            pricePurchase={pricePurchase}
            followersCount={followersCount}
            followed={followed}
          />
          {post && <BlogPost key={post.id} post={post} />}
          {post && (
            <Button color="primary" block href={`/cube/blog/${cube.id}`} type="link">
              View All Blog Posts
            </Button>
          )}
        </Flexbox>
      </CubeLayout>
    </MainLayout>
  );
};

export default RenderToRoot(CubeOverview);
