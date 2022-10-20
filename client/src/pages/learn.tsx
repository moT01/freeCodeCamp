import { Grid, Row, Col } from '@freecodecamp/react-bootstrap';
import { graphql } from 'gatsby';
import React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Intro from '../components/Intro';
import Map from '../components/Map';
import Map2 from '../components/Map/map2';
import { Spacer } from '../components/helpers';
import LearnLayout from '../components/layouts/learn';
import {
  isSignedInSelector,
  userSelector,
  userFetchStateSelector
} from '../redux/selectors';

interface FetchState {
  pending: boolean;
  complete: boolean;
  errored: boolean;
}

interface User {
  name: string;
  username: string;
  completedChallengeCount: number;
}

const mapStateToProps = createSelector(
  userFetchStateSelector,
  isSignedInSelector,
  userSelector,
  (fetchState: FetchState, isSignedIn: boolean, user: User) => ({
    fetchState,
    isSignedIn,
    user
  })
);

interface Slug {
  slug: string;
}

interface LearnPageProps {
  isSignedIn: boolean;
  fetchState: FetchState;
  state: Record<string, unknown>;
  user: User;
  data: {
    challengeNode: {
      challenge: {
        fields: Slug;
      };
    };
  };
}

import './learn.css';

function LearnPage({
  isSignedIn,
  fetchState: { pending, complete },
  user: { name = '', completedChallengeCount = 0 },
  data: {
    challengeNode: {
      challenge: {
        fields: { slug }
      }
    }
  }
}: LearnPageProps) {
  const { t } = useTranslation();

  return (
    <LearnLayout>
      <Helmet title={t('metaTags:title')} />
      <Grid>
        <Spacer size={3} />
        <Row>
          <h1 className='choose-path'>Choose Your Learning Path</h1>
        </Row>
        <Spacer size={3} />
        <div className='row-1'>

          <div className='column-1'>
            <p>
              <span className='earn-heading'>
                Earn free, verified certifications.
              </span>{' '}
              Ideal for people who want to find work as a developer sooner, or
              who already have a bachelor's degree. Each certification will
              involve about 300 hours of coursework.
            </p>
            <Spacer size={1} />
            <Map />
          </div>

          <div className='column-1'>
            <p>
              <span className='earn-heading'>
                Earn free, accredited university degrees.
              </span>{' '}
              An Associates of Science in Mathematics and a Bachelors of Science
              in Computer Science. Ideal for people who don't yet have
              university degrees. Can take 4 years or longer.
            </p>
            <Spacer size={1} />
            <Map2 />
          </div>

        </div>
      </Grid>
    </LearnLayout>
  );
}

LearnPage.displayName = 'LearnPage';

export default connect(mapStateToProps, null)(LearnPage);

export const query = graphql`
  query FirstChallenge {
    challengeNode(
      challenge: {
        superOrder: { eq: 0 }
        order: { eq: 0 }
        challengeOrder: { eq: 0 }
      }
    ) {
      challenge {
        fields {
          slug
        }
      }
    }
  }
`;
