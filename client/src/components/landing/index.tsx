import { Grid } from '@freecodecamp/react-bootstrap';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import PrismFormatted from '../../templates/Challenges/components/prism-formatted';


import SEO from '../seo';
import AsSeenIn from './components/as-seen-in';
import Certifications from './components/certifications';
import LandingTop from './components/landing-top';
import Testimonials from './components/testimonials';

import './landing.css';
import '../../templates/Challenges/video.css';

const answers = [
   'EdgeWorkers',
   'EdgeKV',
   'EdgeIP',
   'Cloudlets',
   'NetStorage'
]

function Landing(): ReactElement {
  const { t } = useTranslation();

  return (
    <>
      <SEO title={t('metaTags:title')} />
      <main className='landing-page'>
        <div className='exam'>

          <div className='exam-head'>
            <div className='exam-title'>Akamai Cloud Practitioner Certification Exam</div>
            <div>|</div>
            <div className='exam-time'>Exam Time: <strong>9:47</strong></div>
            <div>|</div>
            <div className='exam-questions'>Question 10 of 75</div>
          </div>

          <div className='exam-content'>
            <div className='exam-question'>Which Akamai service provides file storage and retrieval with low latency and high throughput?</div>
            <div className='exam-answers'>
              {answers.map((option, index) => (
                <label className='video-quiz-option-label' key={index}>
                  <input
                    checked={index === 4 ? true : false}
                    className='video-quiz-input-hidden'
                    name='quiz'
                    type='radio'
                    value={index}
                  />{' '}
                  <span className='video-quiz-input-visible'>
                    {4 === index ? (
                      <span className='video-quiz-selected-input' />
                    ) : null}
                  </span>
                  <PrismFormatted
                    className={'video-quiz-option'}
                    text={option}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className='exam-foot'>
            <div className='exam-btn'>Previous</div>
            <div className='exam-btn'>Next</div>
          </div>

        </div>
      </main>
    </>
  );
}

Landing.displayName = 'Landing';
export default Landing;
