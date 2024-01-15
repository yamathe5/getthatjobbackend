// populateDB.js
const { Pool } = require('pg');
const faker = require('faker');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mydatabase',
  password: 'root',
  port: 5432,
});

const createFakeJob = () => {
  return {
    title: faker.name.jobTitle(),
    company: faker.company.companyName(),
    type: faker.name.jobType(),
    salaryRange: `$${faker.finance.amount(30000, 100000, 0)}`,
    aboutCompany: faker.company.catchPhrase(),
    aboutJob: faker.name.jobDescriptor(),
    mandatoryRequirements: faker.lorem.paragraph(),
    optionalRequirements: faker.lorem.paragraph(),
    postedDate: faker.date.recent(),
    // Assuming candidates, track, and close are boolean or numeric types
    candidates: faker.datatype.number({ min: 0, max: 100 }),
    track: faker.datatype.boolean(),
    close: faker.datatype.boolean(),
  };
};

const insertFakeData = async (data) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const insertQuery = `
      INSERT INTO jobs (title, company, type, salary_range, about_company, about_job, mandatory_requirements, optional_requirements, posted_date, candidates, track, close)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `;
    const values = [
      data.title,
      data.company,
      data.type,
      data.salaryRange,
      data.aboutCompany,
      data.aboutJob,
      data.mandatoryRequirements,
      data.optionalRequirements,
      data.postedDate,
      data.candidates,
      data.track,
      data.close,
    ];
    await client.query(insertQuery, values);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

(async () => {
  const fakeJobs = Array.from({ length: 10 }, createFakeJob);
  for (const job of fakeJobs) {
    await insertFakeData(job);
  }
  console.log('Fake jobs inserted into database');
  await pool.end();
})();
