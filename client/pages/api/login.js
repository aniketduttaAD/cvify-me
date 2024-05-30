import { account } from "../../appwriteConfig";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { email, password } = req.body;
  try {
    const session = await account.createEmailPasswordSession(email, password);
    res.setHeader(
      "Set-Cookie",
      serialize("authToken", session.$id, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: "strict",
        path: "/",
      })
    );
    res.status(200).json({ message: "Login successful", data: session });
  } catch (error) {
    res.status(401).json({ error: "Invalid credentials" });
  }
}
