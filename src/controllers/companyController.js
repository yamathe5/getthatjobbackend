// companyController.js
const { findCompanyByEmail, createCompany } = require("../models/companyModel");

const loginCompany = async (req, res) => {
  const { email, password } = req.body;
  try {
    const company = await findCompanyByEmail(email);
    console.log(company);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }

    if (company.password !== password) {
      return res.status(401).json({ message: "Incorrect password." });
    }
    // Fake token for demonstration purposes
    const fakeToken = `fake-jwt-token-for-${company.id}`;

    return res.status(200).json({
      message: "Login successful",
      token: fakeToken,
      ...company,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred during login." });
  }
};

const signupCompany = async (req, res) => {
  const { email } = req.body;
  try {
    const existingCompany = await findCompanyByEmail(email);
    if (existingCompany) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const newCompany  = await createCompany(req.body);
    console.log("New company: ", newCompany );
    const fakeToken = `fake-jwt-token-for-${newCompany.id}`;
    return res.status(200).json({
      ...newCompany,
      message: "Sign up successful",
      token: fakeToken,
    });
  
    
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred during Sign up." });
  }
};

module.exports = { loginCompany, signupCompany };
