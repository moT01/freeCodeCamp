import React from 'react';
import ShowClassic from '../../templates/Challenges/classic/show';
import { Ext } from '../../redux/prop-types';

const props = {
  data: {
    challengeNode: {
      challenge: {
        // dashedName: 'problem-1-multiples-of-3-or-5',
        // block: 'project-euler-problems-1-to-100', // don't need
        // demoType: null,
        title: 'Problem 1: Multiples of 3 or 5',
        description:
          '<section id="description">\n<p>If we list all the natural numbers below 10 that are multiples of 3 or 5, we get 3, 5, 6 and 9. The sum of these multiples is 23.</p>\n<p>Find the sum of all the multiples of 3 or 5 below the provided parameter value <code>number</code>.</p>\n</section>',
        id: '5900f36e1000cf542c50fe80',
        // hasEditableBoundaries: false,
        // instructions: '',
        challengeType: 1,
        helpCategory: 'Euler',
        // videoUrl: null,
        // superBlock: 'project-euler' as SuperBlocks,
        // translationPending: false,
        // forumTopicId: 301722,
        fields: {
          blockName: 'daily-coding-challenge', // don't need
          // slug: '/learn/project-euler/project-euler-problems-1-to-100/problem-1-multiples-of-3-or-5',
          tests: [
            {
              text: '<p><code>multiplesOf3Or5(10)</code> should return a number.</p>',
              testString: "assert(typeof multiplesOf3Or5(10) === 'number');"
            },
            {
              text: '<p><code>multiplesOf3Or5(49)</code> should return 543.</p>',
              testString: 'assert.strictEqual(multiplesOf3Or5(49), 543);'
            },
            {
              text: '<p><code>multiplesOf3Or5(19564)</code> should return 89301183.</p>',
              testString:
                'assert.strictEqual(multiplesOf3Or5(19564), 89301183);'
            }
          ]
        },
        // required: [],
        // usesMultifileEditor: false,
        challengeFiles: [
          {
            fileKey: 'scriptjs',
            ext: 'js' as Ext,
            name: 'script',
            contents:
              'function multiplesOf3Or5(number) {\n\n  return true;\n}\n\nmultiplesOf3Or5(1000);',
            head: '',
            tail: '',
            editableRegionBoundaries: [],
            history: ['script.js']
          }
        ]
      }
    }
  },
  pageContext: {
    challengeMeta: {
      // blockHashSlug: '/learn/project-euler/#project-euler-problems-1-to-100',
      // dashedName: 'problem-1-multiples-of-3-or-5',
      // certification: 'project-euler',
      disableLoopProtectTests: true,
      // disableLoopProtectPreview: false,
      // superBlock: 'project-euler',
      // block: 'project-euler-problems-1-to-100', // don't need
      // isFirstStep: true,
      // template: null,
      // required: [],
      // isLastChallengeInBlock: false,
      // nextChallengePath:
      //   '/learn/project-euler/project-euler-problems-1-to-100/problem-2-even-fibonacci-numbers',
      // prevChallengePath:
      //   '/learn/coding-interview-prep/take-home-projects/build-a-light-bright-app',
      id: '5900f36e1000cf542c50fe80' // don't need cause we have it? or do we - lets keep it for now. Seems like we need it for the page/challenge meta to submit
    }
    // projectPreview: {
    //   challengeData: {
    //     challengeType: 1,
    //     challengeFiles: [
    //       {
    //         name: 'script',
    //         ext: 'js',
    //         contents:
    //           'function arrangedProbability(limit) {\n  // Based on https://www.mathblog.dk/project-euler-100-blue-discs-two-blue/\n  let blue = 15;\n  let discs = 21;\n\n  while (discs < limit) {\n    const nextBlue = 3 * blue + 2 * discs - 2;\n    const nextDiscs = 4 * blue + 3 * discs - 3;\n\n    blue = nextBlue;\n    discs = nextDiscs;\n  }\n  return blue;\n}',
    //         head: '',
    //         tail: '',
    //         history: ['script.js'],
    //         fileKey: 'scriptjs'
    //       }
    //     ]
    //   }
    // },
    // id: '/learn/project-euler/project-euler-problems-1-to-100/problem-1-multiples-of-3-or-5'
  }
};

function DailyCodingChallenge(): JSX.Element {
  return <ShowClassic {...props} />;
}

DailyCodingChallenge.displayName = 'DailyCodingChallenge';

export default DailyCodingChallenge;
