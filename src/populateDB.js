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
    await client.query("DROP TABLE IF EXISTS applications;");
    await client.query("DROP TABLE IF EXISTS followings;");
    await client.query("DROP TABLE IF EXISTS professionals;");
    await client.query("DROP TABLE IF EXISTS jobs;");
    await client.query("DROP TABLE IF EXISTS companys;");

    // Create jobs table
    const createJobsTableQuery = `
    CREATE TABLE jobs (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      company VARCHAR(255),
      category VARCHAR(50),
      type VARCHAR(50),
      minSalary VARCHAR(50),
      maxSalary VARCHAR(50),
      aboutCompany TEXT,
      aboutJob TEXT,
      mandatoryRequirements TEXT,
      optionalRequirements TEXT,
      postedDate TIMESTAMP,
      candidates INTEGER,
      track INTEGER,
      close BOOLEAN,
      companyid INTEGER REFERENCES companys(id) ON DELETE CASCADE
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
    );`;

    const createApplicationsTableQuery = `
    CREATE TABLE IF NOT EXISTS applications (
      id SERIAL PRIMARY KEY,
      jobid INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
      professionalid INTEGER REFERENCES professionals(id) ON DELETE CASCADE,
      professionalexperience TEXT,
      whyareyouinterested TEXT,
      date DATE NOT NULL,
      status VARCHAR(255) NOT NULL
    );`;
    const createFollowingsTableQuery = `
  CREATE TABLE IF NOT EXISTS followings (
    id SERIAL PRIMARY KEY,
    professionalid INTEGER REFERENCES professionals(id) ON DELETE CASCADE,
    companyid INTEGER REFERENCES companys(id) ON DELETE CASCADE,
    jobid INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    following BOOLEAN
  );`;

    await client.query(createCompanysTableQuery);
    await client.query(createProfessionalsTableQuery);
    await client.query(createJobsTableQuery);
    await client.query(createApplicationsTableQuery);
    await client.query(createFollowingsTableQuery);

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
  const type = faker.datatype.boolean();

  const minSalary = faker.datatype.number({ min: 500, max: 3000 });
  const maxSalary = minSalary + faker.datatype.number({ min: 0, max: 1000 });

  return {
    title: faker.name.jobTitle(),
    company: faker.company.companyName(),
    category: faker.name.jobType(),
    type: type ? "Full-time" : "Part-time",
    minSalary: `${minSalary}`,
    maxSalary: `${maxSalary}`,
    aboutCompany: faker.company.catchPhrase(),
    aboutJob: faker.name.jobDescriptor(),
    mandatoryRequirements: faker.lorem.paragraph(),
    optionalRequirements: faker.lorem.paragraph(),
    postedDate: faker.date.recent(),
    candidates: faker.datatype.number({ min: 0, max: 100 }),
    track: faker.datatype.number({ min: 0, max: 100 }),
    close: faker.datatype.boolean(),
    companyid: faker.datatype.number({ min: 1, max: 4 }),
  };
};

const InsertFakeJobData = async (data) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const insertQuery = `
      INSERT INTO jobs (title, company, type, category, minsalary, maxsalary, aboutcompany, aboutjob, mandatoryrequirements, optionalrequirements, posteddate, candidates, track, close, companyid)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    `;
    const values = [
      data.title,
      data.company,
      data.type,
      data.category,
      data.minSalary,
      data.maxSalary,
      data.aboutCompany,
      data.aboutJob,
      data.mandatoryRequirements,
      data.optionalRequirements,
      data.postedDate,
      data.candidates,
      data.track,
      data.close,
      data.companyid,
    ];
    // console.log(values)
    await client.query(insertQuery, values);
    await client.query("COMMIT");
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

const createFakeApplications = () => {
  const statuses = ["waiting", "inprogress", "finished"];

  // Elegir un estado al azar del arreglo
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    jobid: faker.datatype.number({ min: 1, max: 10 }),
    professionalid: faker.datatype.number({ min: 1, max: 2 }),
    professionalexperience: faker.lorem.paragraphs(2),
    whyareyouinterested: faker.lorem.sentence(),
    date: faker.date.past(2).toISOString().split("T")[0],
    status: randomStatus,
  };
};

const insertFakeApplicationsData = async (data) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const insertQuery = `
      INSERT INTO applications (jobid, professionalid, professionalexperience, whyareyouinterested, date, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      data.jobid,
      data.professionalid,
      data.professionalexperience,
      data.whyareyouinterested,
      data.date,
      data.status,
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

const createFakeFollowing = () => {
  const includeCompany = faker.datatype.boolean();

  return {
    professionalid: faker.datatype.number({ min: 1, max: 2 }),
    ...(includeCompany
      ? { companyid: faker.datatype.number({ min: 1, max: 4 }) }
      : { jobid: faker.datatype.number({ min: 1, max: 10 }) }),
    following: true,
  };
};

const insertFakeFollowingData = async (data) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const insertQuery = `
      INSERT INTO followings (professionalid, companyid, jobid, following)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [
      data.professionalid,
      data.companyid,
      data.jobid,
      data.following,
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

(async () => {
  try {
    await createTables(); // Asegúrate de que esta promesa se resuelve antes de continuar
    console.log("All tables has been created");

    const fakeProfessionals = Array.from(
      { length: 2 },
      createFakeProfessional
    );
    for (const professional of fakeProfessionals) {
      await insertFakeProfessionalData(professional);
    }
    const fakeCompanys = Array.from({ length: 4 }, createFakeCompanys);
    for (const company of fakeCompanys) {
      await insertFakeCompanyData(company);
    }
    const fakeJobs = Array.from({ length: 10 }, createFakeJob);
    for (const job of fakeJobs) {
      await InsertFakeJobData(job);
    }
    const fakeApplications = Array.from({ length: 10 }, createFakeApplications);
    for (const application of fakeApplications) {
      await insertFakeApplicationsData(application);
    }
    const fakeFollowing = Array.from({ length: 10 }, createFakeFollowing);
    for (const following of fakeFollowing) {
      await insertFakeFollowingData(following);
    }

    console.log("Fake jobs inserted into database");
  } catch (e) {
    console.error("An error occurred:", e);
  } finally {
    await pool.end();
  }
})();
