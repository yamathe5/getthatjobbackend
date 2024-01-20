// professionalController.js
const { findProfessionalByEmail, createProfessional } = require("../models/professionalModel");

const loginProfessional = async (req, res) => {
  const { email, password } = req.body;
  try {
    const professional = await findProfessionalByEmail(email);
    if (!professional) {
      return res.status(404).json({ message: "Professional not found." });
    }
    
    if (professional.password !== password) {
      return res.status(401).json({ message: "Incorrect password." });
    }
    // Fake token for demonstration purposes
    const fakeToken = `fake-jwt-token-for-${professional.id}`;

    return res.status(200).json({
      message: "Login successful",
      token: fakeToken,
      ...professional
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred during login." });
  }
};    

const signupProfessional = async (req, res) => {
  const { email } = req.body;
  try {
    const existingProfessional = await findProfessionalByEmail(email);
    if (existingProfessional) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const newProfessional  = await createProfessional(req.body);
    const fakeToken = `fake-jwt-token-for-${newProfessional.id}`;
    return res.status(200).json({
      ...newProfessional,
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


module.exports = { loginProfessional, signupProfessional };
