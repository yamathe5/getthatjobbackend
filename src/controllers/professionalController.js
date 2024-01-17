// professionalController.js
const { findProfessionalByEmail } = require("../models/professionalModel");

const loginProfessional = async (req, res) => {
  const { email, password } = req.body;
  try {
    const professional = await findProfessionalByEmail(email);
    console.log(professional)
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

module.exports = { loginProfessional };
