import { account } from "../../appwriteConfig";
import { ID } from "appwrite";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { email, password, name } = req.body;
  try {
    const response = await account.create(ID.unique(), email, password, name);
    console.log(response, email, password, name);
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
    res.status(201 || 200).json({ message: "Signup successful", data: session });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}
