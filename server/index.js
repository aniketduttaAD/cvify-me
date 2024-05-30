const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const axios = require("axios");
const { Cashfree } = require("cashfree-pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

function generateOrderId() {
  const uniqueId = crypto.randomBytes(16).toString("hex");
  const hash = crypto.createHash("sha256");
  hash.update(uniqueId);
  const orderId = hash.digest("hex");
  return orderId.substr(0, 12);
}

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/payment", async (req, res) => {
  try {
    let request = {
      order_amount: 200.0,
      order_currency: "INR",
      order_id: await generateOrderId(),
      customer_details: {
        customer_id: "cvbuilderUser",
        customer_phone: "9999999999",
        customer_name: "Cv Builder",
        customer_email: "cvbuilder@test.com",
      },
    };
    Cashfree.PGCreateOrder("2023-08-01", request)
      .then((response) => {
        console.log(response.data);
        res.json(response.data);
      })
      .catch((error) => {
        console.error(error.response.data.message);
        res.status(500).json({ error: error.response.data.message });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create payment" });
  }
});

app.post("/verify", async (req, res) => {
  try {
    let { orderId } = req.body;
    Cashfree.PGOrderFetchPayments("2023-08-01", orderId)
      .then((response) => {
        res.json(response.data);
        console.log("here", response.data);
      })
      .catch((error) => {
        console.error(error.response.data.message);
        res.status(500).json({ error: error.response.data.message });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to verify order" });
  }
});

app.post("/generate-about", async (req, res) => {
  const { skills, jobTitle } = req.body;

  if (!skills || !jobTitle) {
    return res.status(400).json({ error: "Skills and job title are required" });
  }

  const prompt = `Can you generate an about for my resume based on my skills and determine my background also based on my skills and add it: ${skills.join(
    ", "
  )} and job title: ${jobTitle}? give small, to the point and professional about, make it 20-25 words`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        n: 3,
        stop: null,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("OpenAI API response:", response.data);

    if (response.data.choices && response.data.choices.length > 0) {
      const generatedTexts = response.data.choices.map((choice) =>
        choice.message.content.trim()
      );
      res.json(generatedTexts);
    } else {
      console.error("No choices returned from OpenAI API");
      res.status(500).json({ error: "Failed to generate text" });
    }
  } catch (error) {
    console.error(
      "Error generating text:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to generate text" });
  }
});

app.listen(8000, () => {
  console.log("Server running on port 8000");
});
