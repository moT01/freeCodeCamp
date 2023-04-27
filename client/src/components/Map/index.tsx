import i18next from 'i18next';
import React from 'react';

import { SuperBlocks } from '../../../../config/certification-settings';
import {
  CurriculumMaps,
  getAuditedSuperBlocks,
  getNotAuditedSuperBlocks,
  superBlockOrder
} from '../../../../config/superblock-order';
import { Languages } from '../../../../config/i18n';
import envData from '../../../../config/env.json';
import { generateIconComponent } from '../../assets/icons';
import LinkButton from '../../assets/icons/link-button';
import { Link, Spacer } from '../helpers';
import { getSuperBlockTitleForMap } from '../../utils/superblock-map-titles';

import './map.css';
import CertificationIcon from '../../assets/icons/certification';

const { curriculumLocale, showNewCurriculum, showUpcomingChanges } = envData;

interface MapProps {
  currentSuperBlock?: SuperBlocks | null;
  forLanding?: boolean;
}

const linkSpacingStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '15px',
  width: '100%'
};

const stage1 = [
  '2022/responsive-web-design',
  'javascript-algorithms-and-data-structures',
  'front-end-development-libraries'
];

const stage2 = [
  'relational-database',
  'back-end-development-and-apis',
  'quality-assurance',
  'information-security'
];

const stage3 = [
  'scientific-computing-with-python',
  'data-analysis-with-python',
  'machine-learning-with-python',
  'college-algebra-with-python'
];

const stage4 = [
  'coding-interview-prep',
  'the-odin-project',
  'project-euler',
  'responsive-web-design'
];

const allSuperBlocks = ['', ...stage1, ...stage2, ...stage3, ...stage4];
const fullyCompleted = 1;
const currentCert = 5;

function MapLi({
  superBlock,
  landing = false,
  last = false
}: {
  superBlock: SuperBlocks | string;
  landing: boolean;
  last?: boolean;
}) {
  const index = allSuperBlocks.indexOf(superBlock);
  const circleFill = currentCert >= index ? 'solid' : 'grey';
  const arrowFill = currentCert > index ? 'solid-arrow' : 'grey-arrow';
  const certIconFill =
    fullyCompleted >= index
      ? 'var(--yellow-gold)'
      : 'var(--secondary-background)';

  return (
    <li>
      <div className='progress-icon'>
        {currentCert > index ? (
          <div className='cert-icon-outline'>
            <CertificationIcon fill={certIconFill} />
          </div>
        ) : (
          <span className={`progress-number ${circleFill}`}>
            {allSuperBlocks.indexOf(superBlock)}
          </span>
        )}
        {!last && <span className={`arrow ${arrowFill}`}>&#x2193;</span>}
      </div>

      <Link className='btn link-btn btn-lg' to={`/learn/${superBlock}/`}>
        <div style={linkSpacingStyle}>
          {getSuperBlockTitleForMap(superBlock)}
          {generateIconComponent(superBlock, 'map-icon')}
        </div>
        {landing && <LinkButton />}
      </Link>
    </li>
  );
}

function renderLandingMap() {
  const landingSuperOrder =
    superBlockOrder[curriculumLocale as Languages][CurriculumMaps.Landing];

  return (
    <ul data-test-label='certifications'>
      {landingSuperOrder.map((superBlock, i) => (
        <MapLi superBlock={superBlock} key={i} landing={true} />
      ))}
    </ul>
  );
}

function renderLearnMap(currentSuperBlock: MapProps['currentSuperBlock']) {
  // const tempAuditedSuperBlocks = getAuditedSuperBlocks({
  //   language: curriculumLocale,
  //   showNewCurriculum: showNewCurriculum.toString(),
  //   showUpcomingChanges: showUpcomingChanges.toString()
  // });
  // const tempNotAuditedSuperBlocks = getNotAuditedSuperBlocks({
  //   language: curriculumLocale,
  //   showNewCurriculum: showNewCurriculum.toString(),
  //   showUpcomingChanges: showUpcomingChanges.toString()
  // });

  // const auditedSuperBlocks = tempAuditedSuperBlocks.filter(
  //   superBlock => superBlock !== currentSuperBlock
  // );

  // const notAuditedSuperBlocks = tempNotAuditedSuperBlocks.filter(
  //   superBlock => superBlock !== currentSuperBlock
  // );

  return (
    <div className='map-wrap'>
      {/* audited superblocks */}
      <Spacer size='medium' />

      <div className='stage-wrap'>
        <h2 className='stage-heading'>Stage 1: Front End Development</h2>
        <Spacer size='small' />
        <ul>
          {stage1.map((superBlock, i) => (
            <MapLi
              key={i}
              last={i + 1 === stage1.length}
              superBlock={superBlock}
              landing={false}
            />
          ))}
        </ul>
      </div>

      <Spacer size='medium' />

      <div className='stage-wrap'>
        <h2 className='stage-heading'>Stage 2: Back End Development</h2>
        <Spacer size='small' />
        <ul>
          {stage2.map((superBlock, i) => (
            <MapLi
              key={i}
              last={i + 1 === stage2.length}
              superBlock={superBlock}
              landing={false}
            />
          ))}
        </ul>
      </div>

      <Spacer size='medium' />

      <div className='stage-wrap'>
        <h2 className='stage-heading'>Stage 3: Python & AI</h2>
        <Spacer size='small' />
        <ul>
          {stage3.map((superBlock, i) => (
            <MapLi
              key={i}
              last={i + 1 === stage3.length}
              superBlock={superBlock}
              landing={false}
            />
          ))}
        </ul>
      </div>

      <Spacer size='medium' />

      <div className='stage-wrap'>
        <h2 className='stage-heading'>Stage 4: Extra</h2>
        <Spacer size='small' />
        <ul>
          {stage4.map((superBlock, i) => (
            <MapLi
              key={i}
              last={i + 1 === stage4.length}
              superBlock={superBlock}
              landing={false}
            />
          ))}
        </ul>
      </div>

      {/* has not audited superblocks */}
      {/*notAuditedSuperBlocks.length > 0 && (
        <>
          {' '}
          <hr />
          <div style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: 0 }}>
              {i18next.t('learn.help-translate')}{' '}
            </p>
            <Link
              external={true}
              sameTab={false}
              to={i18next.t('links:help-translate-link-url')}
            >
              {i18next.t('learn.help-translate-link')}
            </Link>
            <Spacer size='medium' />
          </div>
        </>
      )*/}

      {/* not audited superblocks */}
      {/*notAuditedSuperBlocks.map((superBlock, i) => (
        <MapLi key={i} superBlock={superBlock} landing={false} />
      ))*/}
    </div>
  );
}

export function Map({
  forLanding = false,
  currentSuperBlock = null
}: MapProps): React.ReactElement {
  return (
    <div className='map-ui' data-test-label='learn-curriculum-map'>
      {forLanding ? renderLandingMap() : renderLearnMap(currentSuperBlock)}
    </div>
  );
}

Map.displayName = 'Map';

export default Map;
