import { writeFileSync, rmSync } from 'fs';
import apollo from '@apollo/client/core/core.cjs';
import { createConnection } from 'mysql';
import { allChallengeNode, allCertificateNode } from './graphql-query.js';
const { ApolloClient, InMemoryCache } = apollo;

const query_filename = ['create-tables', 'insert', 'drop-tables'];

for (const filename of query_filename) {
  rmSync(`./queries/${filename}.sql`, {
    force: true
  });
}

const client = new ApolloClient({
  uri: 'http://localhost:8000/__graphql',
  cache: new InMemoryCache({ addTypename: false })
});

const allChallengeData = await client.query({
  query: allChallengeNode
});

// console.log(JSON.stringify(data, null, 2));

const connection = createConnection('mysql://root:@127.0.0.1/curriculum');

connection.connect();

await seed();

await createTables(allChallengeData.data.allChallengeNode.nodes);

await addChallenges(allChallengeData.data.allChallengeNode.nodes);

const allCertificateData = await client.query({
  query: allCertificateNode
});

await addCertifications(allCertificateData.data.allCertificateNode.nodes);

await createDropTablesQueries();

connection.end();

function getTableName(key) {
  return key;
}

function getColumnType(value) {
  switch (typeof value) {
    case 'string':
      return 'TEXT';
    case 'number':
      return 'INT';
    case 'boolean':
      return 'BOOLEAN';
    case 'object':
      return 'JSON';
    default:
      return 'TEXT';
  }
}

async function seed() {
  let sql = `
CREATE TABLE IF NOT EXISTS certifications(
  id INT NOT NULL AUTO_INCREMENT,
  title TEXT NOT NULL,
  object_id VARCHAR(24) NOT NULL,
  dashed_name TEXT NOT NULL,
  state ENUM('current','upcoming','legacy') NOT NULL,
  PRIMARY KEY (id)
);`;
  await runCreateTable(sql);

  sql = `
CREATE TABLE IF NOT EXISTS certifications_prerequisites(
  certification_id INT NOT NULL,
  prerequisite_object_id VARCHAR(24) NOT NULL,
  PRIMARY KEY (certification_id, prerequisite_object_id),
  FOREIGN KEY (certification_id) REFERENCES certifications(id)
);`;
  await runCreateTable(sql);

  sql = `
CREATE TABLE IF NOT EXISTS superblocks(
  id INT NOT NULL AUTO_INCREMENT,
  title TEXT NOT NULL,
  dashed_name TEXT NOT NULL,
  superblock_order INT NOT NULL,
  PRIMARY KEY (id)
);`;
  await runCreateTable(sql);

  sql = `
CREATE TABLE IF NOT EXISTS blocks(
  id INT NOT NULL AUTO_INCREMENT,
  title TEXT NOT NULL,
  dashed_name TEXT NOT NULL,
  PRIMARY KEY (id)
);`;
  await runCreateTable(sql);

  sql = `
CREATE TABLE IF NOT EXISTS superblocks_blocks(
  superblock_id INT NOT NULL,
  block_id INT NOT NULL,
  block_order int NOT NULL,
  PRIMARY KEY (superblock_id, block_id),
  FOREIGN KEY (superblock_id) REFERENCES superblocks(id),
  FOREIGN KEY (block_id) REFERENCES blocks(id)
);`;
  await runCreateTable(sql);

  sql = `
CREATE TABLE IF NOT EXISTS challenges (
  id INT NOT NULL AUTO_INCREMENT,
  title TEXT NOT NULL,
  object_id VARCHAR(24) NOT NULL,
  dashed_name TEXT NOT NULL,
  PRIMARY KEY (id)
);`;
  await runCreateTable(sql);

  sql = `
CREATE TABLE IF NOT EXISTS blocks_challenges(
  block_id INT NOT NULL,
  challenge_id INT NOT NULL,
  challenge_order int NOT NULL,
  PRIMARY KEY (block_id, challenge_id),
  FOREIGN KEY (block_id) REFERENCES blocks(id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);`;
  await runCreateTable(sql);

  sql = `
CREATE TABLE IF NOT EXISTS block_time_to_complete(
  id INT NOT NULL AUTO_INCREMENT,
  block_id INT NOT NULL,
  time_to_complete TEXT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (block_id) REFERENCES blocks(id)
)`;
  await runCreateTable(sql);
}

async function createTables(data) {
  const createdTables = [];
  for (const challengeNode of data) {
    const {
      // Filter out fields not related to 'feature' tables
      __typename,
      /* eslint-disable @typescript-eslint/no-unused-vars */
      block,
      certification,
      challengeType,
      challengeOrder,
      dashedName,
      id,
      order,
      superBlock,
      superOrder,

      description,
      time,
      url,
      required,
      ...challenge
    } = challengeNode.challenge;
    /* eslint-enable @typescript-eslint/no-unused-vars */

    // SPECIAL CASES
    // Usually, because of reserved words in mysql
    challenge.descriptions = description;
    // challenge.time_to_complete = time;
    challenge.course_url = url;
    challenge.required_resources = required;

    for (const [key, value] of Object.entries(challenge)) {
      // Filter out null values
      if (!value) {
        continue;
      }

      const tableName = getTableName(key);
      const columnType = getColumnType(value);
      let sql = '';
      if (columnType === 'BOOLEAN') {
        sql = `
CREATE TABLE IF NOT EXISTS ${tableName} (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);`;
      } else {
        sql = `
CREATE TABLE IF NOT EXISTS ${tableName} (
  id INT NOT NULL AUTO_INCREMENT,
  challenge_id INT NOT NULL,
  ${key} ${columnType},
  PRIMARY KEY (id),
  FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);`;
      }
      if (!createdTables.includes(tableName)) {
        createdTables.push(tableName);
        await runCreateTable(sql);
      }
    }
  }
}

async function addCertifications(data) {
  let certification_id = 1;
  for (const certificateNode of data) {
    const { certification, id, tests, title } = certificateNode.challenge;

    const sql = `INSERT INTO certifications (title, object_id, dashed_name, state) VALUES (?,?,?,?);`;
    await insert(sql, [
      title,
      id,
      certification,
      title.includes('Legacy') ? 'legacy' : 'current'
    ]);
    for (const test of tests) {
      const { id: test_id } = test;
      const sql = `INSERT INTO certifications_prerequisites (certification_id, prerequisite_object_id) VALUES (?,?);`;
      await insert(sql, [certification_id, test_id]);
    }

    certification_id += 1;
  }
}

async function addChallenges(data) {
  const superblockSet = new Set();
  const blockSet = new Set();

  const superblock_to_superblock_id_map = new Map();
  const block_to_block_id_map = new Map();
  let block_id = 1;
  let superblock_id = 1;
  let sql = '';
  let c = 1;
  for (const challengeNode of data) {
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      superBlock,
      superOrder,
      id,
      challengeOrder,
      certification,
      order,
      block,
      title,
      dashedName,

      __typename,
      description,
      time,
      required,
      url,
      ...challenge
    } = challengeNode.challenge;
    /* eslint-enable @typescript-eslint/no-unused-vars */

    // SPECIAL CASES
    challenge.descriptions = description;
    // challenge.time_to_complete = time;
    challenge.course_url = url;
    challenge.required_resources = required;

    if (!superblockSet.has(superBlock)) {
      sql = `INSERT INTO superblocks (title, dashed_name, superblock_order) VALUES (?,?,?);`;
      await insert(sql, [superBlock, superBlock, superOrder]);
      superblockSet.add(superBlock);
      superblock_to_superblock_id_map.set(superBlock, superblock_id);
      superblock_id += 1;
    }

    if (!blockSet.has(block)) {
      sql = `INSERT INTO blocks (title, dashed_name) VALUES (?,?);`;
      await insert(sql, [block, block]);
      blockSet.add(block);
      block_to_block_id_map.set(block, block_id);

      // Add `block_time_to_complete` as special case, because it is per-block
      sql = `INSERT INTO block_time_to_complete (block_id, time_to_complete) VALUES (?,?);`;
      await insert(sql, [block_id, time]);

      block_id += 1;
    }

    sql = `INSERT INTO challenges (title, object_id, dashed_name) VALUES (?,?,?);`;
    await insert(sql, [title, id, dashedName]);

    if (
      superblock_to_superblock_id_map.get(superBlock) &&
      !block_to_block_id_map.get(block)
    ) {
      const superblockId = superblock_to_superblock_id_map.get(superBlock);
      const blockId = block_to_block_id_map.get(block);
      sql = `INSERT INTO superblocks_blocks (superblock_id, block_id, block_order) VALUES (?,?,?);`;
      await insert(sql, [superblockId, blockId, order]);
    }

    if (block_to_block_id_map.get(block)) {
      const blockId = block_to_block_id_map.get(block);
      sql = `INSERT INTO blocks_challenges (block_id, challenge_id, challenge_order) VALUES (?,?,?);`;
      await insert(sql, [blockId, c, challengeOrder]);
    }

    // Add to feature tables
    for (const [key, value] of Object.entries(challenge)) {
      const tableName = getTableName(key);
      if (!value || value?.length === 0) {
        continue;
      }
      const columnType = getColumnType(value);
      const values = [];
      switch (columnType) {
        case 'BOOLEAN':
          if (value) {
            values.push(c);
            sql = `INSERT INTO ${tableName} (challenge_id) VALUES (?);`;
          } else {
            continue;
          }
          break;
        case 'JSON':
          values.push(c, JSON.stringify(value));
          sql = `INSERT INTO ${tableName} (challenge_id, ${key}) VALUES (?,?);`;
          break;
        case 'INT':
          values.push(c, value);
          sql = `INSERT INTO ${tableName} (challenge_id, ${key}) VALUES (?,?);`;
          break;
        case 'TEXT':
          values.push(c, value);
          sql = `INSERT INTO ${tableName} (challenge_id, ${key}) VALUES (?,?);`;
          break;
        default:
          values.push(c, value);
          sql = `INSERT INTO ${tableName} (challenge_id, ${key}) VALUES (?,?);`;
          break;
      }

      await insert(sql, values);
    }
    c += 1;
  }
}

async function runSQL(sql) {
  return new Promise((resolve, _reject) => {
    connection.query(sql, (err, _result) => {
      if (err) {
        console.error('Error running SQL:\n', sql);
        throw err;
      }
      resolve();
    });
  });
}

async function insert(sql, values) {
  // TODO: This is not useful without the values included
  // writeFileSync(`../queries/insert.sql`, "\n" + sql + "\n", {
  //   flag: "a",
  // });
  return new Promise((resolve, _reject) => {
    connection.query(sql, values, (err, _result) => {
      if (err) {
        console.error('Error running SQL:\n', sql);
        console.error('\n... with values:\n', values);
        throw err;
      }
      resolve();
    });
  });
}

async function runCreateTable(sql) {
  writeFileSync(`./queries/create-tables.sql`, '\n' + sql + '\n', {
    flag: 'a'
  });
  await runSQL(sql);
}

/**
 * NOTE: The order of the tables is important, and NOT taken into account here.
 *       Tables with refs should be dropped first.
 */
async function createDropTablesQueries() {
  const sql = `show tables;`;
  return new Promise((resolve, _reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        console.error('Error running SQL:\n', sql);
        throw err;
      }
      for (const row of result) {
        const { Tables_in_curriculum } = row;
        const sql = `DROP TABLE IF EXISTS ${Tables_in_curriculum};`;
        writeFileSync(`./queries/drop-tables.sql`, sql + '\n', {
          flag: 'a'
        });
      }
      resolve();
    });
  });
}
