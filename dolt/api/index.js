import express from 'express';
import { createConnection } from 'mysql';
import {
  booleanFeatureTables,
  columnsToGraphqlName,
  featureTablesWithColumns,
  tablesToJson
} from './variables.js';

const app = express();

const db = createConnection('mysql://root:@127.0.0.1/dolt');

db.connect(err => {
  if (err) throw err;
  console.log('MySQL database connected');
});

function maybeJson(table, value) {
  return tablesToJson.includes(table) ? JSON.parse(value) : value;
}

async function runSQL(sql, values = []) {
  return new Promise((resolve, _reject) => {
    db.query(sql, values, (err, _result) => {
      if (err) {
        console.error('Error running SQL:\n', sql);
        throw err;
      }
      resolve(_result);
    });
  });
}

let curriculumData = {};
let curriculumArray = [];

async function fetchCurriculumFromDB() {
  try {
    // add all from challenges table to `curriculumData`
    const challenges = await runSQL('SELECT * FROM challenges');
    challenges.forEach(challenge => {
      curriculumData[challenge.id] = { ...challenge };
    });

    // add all from features tables to `curriculumData`
    for (const table of Object.keys(featureTablesWithColumns)) {
      const tableColumns = featureTablesWithColumns[table];
      const challenges = await runSQL(`SELECT * FROM ${table}`);

      challenges.forEach(challenge => {
        tableColumns.forEach(column => {
          // name our learn client expects
          const graphQlName = columnsToGraphqlName[column] || column;

          curriculumData[challenge.challenge_id][graphQlName] = maybeJson(
            table,
            challenge[column]
          );
        });
      });
    }

    // add all boolean tables to `curriculumData`
    for (const table of Object.keys(booleanFeatureTables)) {
      const challenges = await runSQL(`SELECT challenge_id FROM ${table}`);

      challenges.forEach(challenge => {
        curriculumData[challenge.challenge_id][booleanFeatureTables[table]] =
          true;
      });
    }

    // add superblock, block, order, etc

    curriculumArray = Object.values(curriculumData);
  } catch (err) {
    console.error(err);
  }

  console.log('Curriculum data fetched from database');
}

fetchCurriculumFromDB();

app.get('/curriculum', (req, res) => {
  res.json(curriculumArray);
});

app.get('/superblock-map', async (req, res) => {
  const query = `SELECT title, dashed_name FROM superblocks ORDER BY superblock_order;`;
  const result = await runSQL(query);
  res.json(result);
});

app.get('/block-map', async (req, res) => {
  const q1 = `
SELECT s.title AS superblock_title,
  b.title AS block_title,
  s.dashed_name AS superblock_dashed_mame,
  b.dashed_name AS block_dashed_name,
  superblock_order,
  block_order
  FROM superblocks AS s
  FULL JOIN superblocks_blocks AS sb
  ON s.id = sb.superblock_id
  FULL JOIN blocks AS b
  ON b.id = sb.block_id
  ORDER BY superblock_order, block_order;`;

  const map = await runSQL(q1);

  res.json(map);
});

// TODO: Make sure to sanitize data on any endpoints that run a query from input

app.get('/challenge/:object_id', (req, res) => {
  const { object_id } = req.params;

  const query = `SELECT * FROM challenges WHERE object_id = ?`;

  db.query(query, [object_id], async (err, rows) => {
    if (err) throw res.send('Challenge not found');
    if (rows.length > 1)
      throw (
        'More than one row returned for challenge with object_id: ' + object_id
      );

    const returnChallenge = { ...rows[0] };
    const challengeId = rows[0].id;

    for (const table of Object.keys(featureTablesWithColumns)) {
      const tableColumns = featureTablesWithColumns[table];
      const challenges = await runSQL(
        `SELECT * FROM ${table} WHERE challenge_id = ?`,
        [challengeId]
      );

      challenges.forEach(challenge => {
        tableColumns.forEach(column => {
          // name our learn client expects
          const graphQlName = columnsToGraphqlName[column] || column;

          returnChallenge[graphQlName] = maybeJson(table, challenge[column]);
        });
      });
    }

    // add all boolean tables to `curriculumData`
    for (const table of Object.keys(booleanFeatureTables)) {
      const challenges = await runSQL(
        `SELECT challenge_id FROM ${table} WHERE challenge_id = ?`,
        [challengeId]
      );

      challenges.forEach(() => {
        returnChallenge[booleanFeatureTables[table]] = true;
      });
    }

    res.json(returnChallenge);
  });
});

app.get('/superblock/dashed-name/:name', (req, res) => {
  const { name } = req.params;
  const query = `SELECT * FROM superblocks WHERE dashed_name = ?`;

  db.query(query, [name], (err, rows) => {
    if (err) throw err;

    res.json(rows);
  });
});

const PORT = 3010;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
