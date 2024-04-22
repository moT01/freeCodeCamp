import { challengeTypes } from '../shared/config/challenge-types.js';

const app_url = {
  columns: [
    {
      name: 'id',
      type: 'INT AUTO_INCREMENT'
    },
    {
      name: 'challenge_id',
      type: 'INT NOT NULL'
    },
    {
      name: 'required',
      type: 'BOOLEAN NOT NULL'
    }
  ],
  constraints: [
    'fk_challenge_id_solution_url_required FOREIGN KEY (challenge_id) REFERENCES challenges(id)'
  ]
};

export const challengeTypeToTablesMap = {
  [challengeTypes.html]: [],
  [challengeTypes.js]: [],
  [challengeTypes.backEndProject]: [app_url]
};

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
