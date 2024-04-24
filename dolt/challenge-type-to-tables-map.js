import { challengeTypes } from '../shared/config/challenge-types.js';

const solution_url_required = {
  columns: [
    {
      name: 'id',
      type: 'INT AUTO_INCREMENT'
    },
    {
      name: 'challenge_id',
      type: 'INT NOT NULL'
    }
  ],
  constraints: [
    'fk_challenge_id_solution_url_required FOREIGN KEY (challenge_id) REFERENCES challenges(id)'
  ]
};

export const challengeTypeToTablesMap = {
  [challengeTypes.html]: [],
  [challengeTypes.js]: [],
  [challengeTypes.jsProject]: [],
  [challengeTypes.frontEndProject]: [],
  [challengeTypes.backEndProject]: [solution_url_required],
  [challengeTypes.pythonProject]: [],
  [challengeTypes.modern]: [],
  [challengeTypes.step]: [],
  [challengeTypes.quiz]: [],
  [challengeTypes.backend]: [],
  [challengeTypes.video]: [],
  [challengeTypes.codeAllyPractice]: [],
  [challengeTypes.codeAllyCert]: [],
  [challengeTypes.multifileCertProject]: [],
  [challengeTypes.theOdinProject]: [],
  [challengeTypes.colab]: [],
  [challengeTypes.exam]: [],
  [challengeTypes.msTrophy]: [],
  [challengeTypes.multipleChoice]: [],
  [challengeTypes.python]: [],
  [challengeTypes.dialogue]: [],
  [challengeTypes.fillInTheBlank]: [],
  [challengeTypes.multifilePythonCertProject]: []
};

// Add challenge types to CDB

// Features
/**
 * 1. app_url (required) {
 *  challenge_id INT
 *  required BOOLEAN
 * }
 * 2. source_code_url (required)
 * 3. local_address_allowed
 * 4. editor_address_allowed
 * 5. display_preview_modal
 */

// challengeType.modern === challengeType.js + preview
