import jwt from "jsonwebtoken";

interface User {id: string;
  // Define the properties of your User object
  // Example: id: string;
}

function genToken(user: User): string {
  const payload = { user };
  const token = jwt.sign(payload, process.env.JWT_SECRET || "", {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
  return token;
}

export default genToken;
