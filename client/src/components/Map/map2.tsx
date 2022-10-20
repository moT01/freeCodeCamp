import {
  faBook,
  faBrain,
  faMicrochip,
  faLanguage,
  faChartArea,
  faLightbulb,
  faWaveSquare,
  faSquareRootVariable,
  faQuestion,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { graphql, useStaticQuery } from 'gatsby';
import i18next from 'i18next';
import React from 'react';

import { SuperBlocks } from '../../../../config/certification-settings';
import envData from '../../../../config/env.json';
import { isAuditedCert } from '../../../../utils/is-audited';
import { generateIconComponent } from '../../assets/icons';
import LinkButton from '../../assets/icons/link-button';
import { ChallengeNode } from '../../redux/prop-types';
import { Link, Spacer } from '../helpers';

import './map.css';

const { curriculumLocale } = envData;

interface MapProps {
  currentSuperBlock?: SuperBlocks | null;
  forLanding?: boolean;
}

interface MapData {
  allChallengeNode: {
    nodes: ChallengeNode[];
  };
}

function createSuperBlockTitle(superBlock: SuperBlocks) {
  const superBlockTitle = i18next.t(`intro:${superBlock}.title`);
  return superBlock === 'coding-interview-prep'
    ? superBlockTitle
    : i18next.t('learn.cert-map-estimates.certs', {
        title: superBlockTitle
      });
}

const linkSpacingStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

function renderMap2(nodes: ChallengeNode[]) {
  const superBlocks = [
    'Philosophy of Knowledge',
    'History of Computation',
    'College Algebra',
    'Foundations of Critical Thinking',
    'Precalculus',
    'Ethical Reasoning',
    'Calculus I'
  ];

  const icons = {
    'Philosophy of Knowledge': faQuestionCircle,
    'History of Computation': faMicrochip,
    'College Algebra': faSquareRootVariable,
    'Foundations of Critical Thinking': faBrain,
    Precalculus: faChartArea,
    'Ethical Reasoning': faBrain,
    'Calculus I': faBrain
  };

  return (
    <ul data-test-label='learn-curriculum-map'>
      {superBlocks.map((superBlock, i) => (
        <li key={i}>
          <Link className='btn link-btn btn-lg' to={`/learn/${superBlock}/`}>
            <div style={linkSpacingStyle}>
              <FontAwesomeIcon className='map-icon' icon={icons[superBlock]} />
              {superBlock}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Map2({
  forLanding = false,
  currentSuperBlock = null
}: MapProps): React.ReactElement {
  /*
   * this query gets the first challenge from each block and the first block
   * from each superblock, leaving you with one challenge from each
   * superblock
   */
  const nodes: any = [];

  return (
    <div className='map-ui' data-test-label='learn-curriculum-map'>
      {renderMap2(nodes)}
    </div>
  );
}

Map2.displayName = 'Map2';

export default Map2;
