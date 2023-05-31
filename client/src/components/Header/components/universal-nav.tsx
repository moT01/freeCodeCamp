import Loadable from '@loadable/component';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Media from 'react-responsive';
import { useFeature } from '@growthbook/growthbook-react';
import { isLanding } from '../../../utils/path-parsers';
import { Link, SkeletonSprite } from '../../helpers';
import {
  SEARCH_EXPOSED_WIDTH,
  DONATE_NAV_EXPOSED_WIDTH
} from '../../../../../config/misc';
import { User } from '../../../redux/prop-types';
import FreeCodeCampLogo from '../../../assets/icons/freecodecamp';
import AkamaiLogo from '../../../assets/icons/akamai-logo';
import MenuButton from './menu-button';
import NavLinks from './nav-links';
import NavLogo from './nav-logo';
import './universal-nav.css';
import AuthOrProfile from './auth-or-profile';


const SearchBar = Loadable(() => import('../../search/searchBar/search-bar'));
const SearchBarOptimized = Loadable(
  () => import('../../search/searchBar/search-bar-optimized')
);

interface UniversalNavProps {
  displayMenu: boolean;
  isLanguageMenuDisplayed: boolean;
  fetchState: { pending: boolean };
  menuButtonRef: React.RefObject<HTMLButtonElement>;
  searchBarRef?: React.RefObject<HTMLDivElement>;
  showMenu: () => void;
  hideMenu: () => void;
  showLanguageMenu: (elementToFocus: HTMLButtonElement | null) => void;
  hideLanguageMenu: () => void;
  user?: User;
}
export const UniversalNav = ({
  displayMenu,
  isLanguageMenuDisplayed,
  showMenu,
  hideMenu,
  showLanguageMenu,
  hideLanguageMenu,
  menuButtonRef,
  searchBarRef,
  user,
  fetchState
}: UniversalNavProps): JSX.Element => {
  const { pending } = fetchState;
  const { t } = useTranslation();

  const exposeDonateButton = useFeature('expose_donate_button').on;

  const search =
    typeof window !== `undefined` && isLanding(window.location.pathname) ? (
      <SearchBarOptimized innerRef={searchBarRef} />
    ) : (
      <SearchBar innerRef={searchBarRef} />
    );

  return (
    <nav
      aria-label={t('aria.primary-nav')}
      className='universal-nav'
      id='universal-nav'
    >
      <div className='logo freecc-logo'>
        <FreeCodeCampLogo aria-hidden='true' />
      </div>
      <div className='logo akamai-logo'>
        <AkamaiLogo aria-hidden='true' />
      </div>
    </nav>
  );
};

UniversalNav.displayName = 'UniversalNav';
export default UniversalNav;
