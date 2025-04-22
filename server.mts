import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Get the directory name properly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3050;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.text()); // Also handle text payloads (for sendBeacon)

// Serve static files from the current directory
app.use("/*url", express.static(__dirname));

// POST endpoint for stats
app.post("/stats", (req, res) => {
  console.log("\n\nReceived stats:");

  try {
    // Handle different payload types
    let data = req.body;

    // If the payload is a string (as with sendBeacon), try to parse it
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.log("Could not parse string payload as JSON");
      }
    }

    // Log the parsed data
    console.log(data.method);
    console.log(`time: ${data.time}`);
    console.log(`payload length: ${data.payload.length}`);

    // Send a success response
    res.status(200).send("Stats received");
  } catch (error) {
    console.error("Error processing stats:", error);
    res.status(500).send("Error processing stats");
  }
});

// Ensure all routes not handled before are sent to index.html
app.get("/test.html", (req, res) => {
  res.sendFile(path.join(__dirname, "test.html"));
});

app.get("/test2.html", (req, res) => {
  res.sendFile(path.join(__dirname, "test2.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`POST endpoint available at http://localhost:${PORT}/stats`);
});
