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
  [challengeTypes.backEndProject]: [solution_url_required]
};
