// populateDB.js
const { Pool } = require("pg");
const faker = require("faker");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "consulting",
  password: "root",
  port: 5432,
});

const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // Drop existing tables if they exist
    await client.query("DROP TABLE IF EXISTS jobs;");
    await client.query("DROP TABLE IF EXISTS professionals;");
    await client.query("DROP TABLE IF EXISTS companys;");

    // Create jobs table
    const createJobsTableQuery = `
      CREATE TABLE jobs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        company VARCHAR(255),
        category VARCHAR(50),
        type VARCHAR(50),
        salaryRange VARCHAR(50),
        aboutCompany TEXT,
        aboutJob TEXT,
        mandatoryRequirements TEXT,
        optionalRequirements TEXT,
        postedDate TIMESTAMP,
        candidates INTEGER,
        track INTEGER,
        close BOOLEAN
      );
    `;

    // Create professionals table
    const createProfessionalsTableQuery = `
      CREATE TABLE professionals (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        phone VARCHAR(50),
        birthdate DATE,
        linkedin VARCHAR(255),
        title VARCHAR(255),
        experience TEXT,
        education TEXT
      );
    `;

    const createCompanysTableQuery = `
    CREATE TABLE IF NOT EXISTS companys (
      id SERIAL PRIMARY KEY,
      company VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      website VARCHAR(255),
      about TEXT
    );
  `;

    await client.query(createProfessionalsTableQuery);
    await client.query(createJobsTableQuery);
    await client.query(createCompanysTableQuery);

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

const createFakeProfessional = () => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(), // In a real-world scenario, use hashed passwords
    name: faker.name.findName(),
    phone: faker.phone.phoneNumber(),
    birthdate: faker.date.past(30).toISOString().split("T")[0], // to ensure the date format is correct for SQL
    linkedin: faker.internet.url(),
    title: faker.name.jobTitle(),
    experience: faker.name.jobDescriptor(),
    education: faker.name.jobArea(),
  };
};
const insertFakeProfessionalData = async (data) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const insertQuery = `
      INSERT INTO professionals (email, password, name, phone, birthdate, linkedin, title, experience, education)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const values = [
      data.email,
      data.password,
      data.name,
      data.phone,
      data.birthdate,
      data.linkedin,
      data.title,
      data.experience,
      data.education,
    ];
    const { rows } = await client.query(insertQuery, values);
    await client.query("COMMIT");
    return rows[0]; // Return the inserted professional data
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

const createFakeJob = () => {
  return {
    title: faker.name.jobTitle(),
    company: faker.company.companyName(),
    category: faker.name.jobType(),
    type: "Full-time",
    salaryRange: `$${faker.finance.amount(30000, 100000, 0)}`,
    aboutCompany: faker.company.catchPhrase(),
    aboutJob: faker.name.jobDescriptor(),
    mandatoryRequirements: faker.lorem.paragraph(),
    optionalRequirements: faker.lorem.paragraph(),
    postedDate: faker.date.recent(),
    // Assuming candidates, track, and close are boolean or numeric types
    candidates: faker.datatype.number({ min: 0, max: 100 }),
    track: faker.datatype.number({ min: 0, max: 100 }),
    close: faker.datatype.boolean(),
  };
};

const insertFakeData = async (data) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const insertQuery = `
      INSERT INTO jobs (title, company, type, category, salaryrange, aboutcompany, aboutjob, mandatoryrequirements, optionalrequirements, posteddate, candidates, track, close)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `;
    const values = [
      data.title,
      data.company,
      data.type,
      data.category,
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
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

const insertFakeCompanyData = async (data) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const insertQuery = `
      INSERT INTO companys (company, email, password, website, about)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      data.company,
      data.email,
      data.password,
      data.website,
      data.about,
    ];
    const { rows } = await client.query(insertQuery, values);
    await client.query("COMMIT");
    return rows[0]; // Return the inserted company data
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

const createFakeCompanys = () => {
  return {
    company: faker.company.companyName(),
    email: faker.internet.email(),
    password: faker.internet.password(), // En un escenario real, utiliza contraseñas hasheadas
    website: faker.internet.url(),
    about: faker.lorem.paragraphs(2),
  };
};


(async () => {
  try {
    await createTables(); // Asegúrate de que esta promesa se resuelve antes de continuar
    console.log('All tables has been created');

    const fakeJobs = Array.from({ length: 10 }, createFakeJob);
    for (const job of fakeJobs) {
      await insertFakeData(job);
    }
    const fakeProfessionals = Array.from(
      { length: 10 },
      createFakeProfessional
    );
    for (const professional of fakeProfessionals) {
       await insertFakeProfessionalData(
        professional
      );
    }
    const fakeCompanys = Array.from(
      { length: 10 },
      createFakeCompanys
      );
    for (const company of fakeCompanys) {
        await insertFakeCompanyData(
          company
      );
    }

    console.log("Fake jobs inserted into database");
  } catch (e) {
    console.error("An error occurred:", e);
  } finally {
    await pool.end();
  }
})();
