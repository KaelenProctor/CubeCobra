import React, { useContext, useMemo } from 'react';

import Container from 'components/base/Container';
import { Flexbox } from 'components/base/Layout';
import ResponsiveDiv from 'components/base/ResponsiveDiv';
import ErrorBoundary from 'components/ErrorBoundary';
import MobileBanner from 'components/MobileBanner';
import ConsentToHashedEmailsModal from 'components/modals/ConsentToHashedEmailsModal';
import Navbar from 'components/nav/Navbar';
import SideBanner from 'components/SideBanner';
import VideoBanner from 'components/VideoBanner';
import UserContext from 'contexts/UserContext';
import useToggle from 'hooks/UseToggle';
import Footer from 'layouts/Footer';

import { UserRoles } from '../../datatypes/User';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [expanded, toggle] = useToggle(false);
  const user = useContext(UserContext);

  const requestConsentForHashEmails = useMemo(() => {
    if (!user) return false;

    // consentToHashedEmail is an optional boolean prop
    // if it hasn't been set, we will ask for consent
    if (!Object.prototype.hasOwnProperty.call(user, 'consentToHashedEmail')) {
      // only ask for consent if the user has ads enabled
      return !(Array.isArray(user.roles) && user.roles.includes(UserRoles.PATRON));
    } else if (user.consentToHashedEmail === true) {
      // @ts-expect-error: 'nitroAds' may not exist on the 'window' object in some environments
      if (window.nitroAds && window.nitroAds.addUserToken) {
        // @ts-expect-error: 'nitroAds' may not exist on the 'window' object in some environments
        window.nitroAds.addUserToken(user.email_token, 'SHA-256');
      }
    }
    return false;
  }, [user]);

  return (
    <Flexbox className="min-h-screen text-text" direction="col">
      <Navbar expanded={expanded} toggle={toggle} />
      <div className="bg-bg flex-grow">
        <Container xxxl>
          <Flexbox className="flex-grow max-w-full" direction="row" gap="4">
            <ResponsiveDiv xxl className="pl-2 py-2 min-w-fit">
              <SideBanner placementId="left-rail" />
            </ResponsiveDiv>
            <div className="flex-grow px-2 max-w-full">
              <ErrorBoundary>{children}</ErrorBoundary>
              <ConsentToHashedEmailsModal isOpen={requestConsentForHashEmails} />
            </div>
            <ResponsiveDiv lg className="pr-2 py-2 min-w-fit">
              <SideBanner placementId="right-rail" />
            </ResponsiveDiv>
            <ResponsiveDiv md>
              <VideoBanner placementId="video" />
            </ResponsiveDiv>
          </Flexbox>
        </Container>
      </div>
      <Footer />
      <ResponsiveDiv baseVisible md>
        <MobileBanner placementId="mobile-banner" />
      </ResponsiveDiv>
    </Flexbox>
  );
};

MainLayout.displayName = 'MainLayout';

export default MainLayout;
