# FAQ BotExample (PowerShell):



Small sample FAQ bot using Node.js + Express with a simple local matching algorithm and optional LLM fallbacks.

Gemini Premium (Vertex AI) automation

Features------------------------------------

- Serve a minimal client at `/` to ask questions

- `/api/faqs` returns the FAQ datasetThe `/webhook` endpoint logs incoming questions, adds FAQ context, and can call Gemini Premium via Vertex AI when the local match confidence is low.

- `/api/ask` accepts `{ question }` and returns the best local match (or uses OpenAI/Gemini when configured)

- `/webhook` logs inbound questions and can call Gemini Premium via Vertex AI before respondingEnvironment variables

- `GCP_PROJECT` (or `GOOGLE_CLOUD_PROJECT` / `GOOGLE_PROJECT_ID`) — Google Cloud project that has access to Gemini

Requirements- `GCP_LOCATION` (or `GOOGLE_LOCATION`) — Vertex AI region, e.g., `us-central1`

- Node 18+ (uses top-level await and the global `fetch` API)- `GEMINI_MODEL` (or `GOOGLE_MODEL`) — Gemini model id, e.g., `gemini-1.5-flash`

- `GOOGLE_APPLICATION_CREDENTIALS` — path to a service account JSON key (for local dev), or rely on Application Default Credentials when deployed to GCP

Quick start

Webhook endpoint (POST)

1. Install dependencies- `POST /webhook` with JSON body:

	- `question` (string) — required

```powershell	- `source` (string) — optional source identifier

npm install	- `userId` (string) — optional user id

```

Response:

2. Start the server- 200 JSON: `{ answer, provider, localScore }`



```powershellLogs & storage

npm start- Incoming requests are appended to `logs/requests.log`.

```- Responses are appended to `logs/responses.json`.



3. Open http://localhost:3000Example (PowerShell, Vertex AI service account JSON)



Optional: OpenAI fallback```powershell

- Set the environment variable `OPENAI_API_KEY` to enable server-side fallback to OpenAI when the local matching score is low.$env:GCP_PROJECT = "your-project-id"

$env:GCP_LOCATION = "us-central1"

Example (PowerShell):$env:GEMINI_MODEL = "gemini-1.5-flash"

$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\service-account.json"

```powershell- `GOOGLE_PROJECT_ID` — your GCP project id

$env:OPENAI_API_KEY = "sk-..."

npm start# send a webhook question

```Invoke-RestMethod -Method Post -Uri http://localhost:3000/webhook -Body (ConvertTo-Json @{ question = "How do I reset my password?"; userId = "user-123" }) -ContentType 'application/json'

```

Gemini Premium (Vertex AI) automation

------------------------------------Notes

- The server only calls Gemini when the local FAQ similarity score is < 0.55, to save tokens. Adjust this in `src/automation.js` if desired.

The `/webhook` endpoint logs incoming questions, adds FAQ context, and can call Gemini Premium via Vertex AI when the local match confidence is low.- Ensure the service account has the Vertex AI User role (or the specific `aiplatform.endpoints.generateContent` permission).

- When deploying to Cloud Run / GCE / GKE, prefer Workload Identity instead of storing a JSON key.

Environment variables- `GOOGLE_LOCATION` — e.g., `us-central1`

- `GCP_PROJECT` (or `GOOGLE_CLOUD_PROJECT` / `GOOGLE_PROJECT_ID`) - Google Cloud project that has access to Gemini- `GOOGLE_MODEL` — the model id (for publisher models use e.g. `text-bison@001` or `projects/.../publishers/.../models/...`)

- `GCP_LOCATION` (or `GOOGLE_LOCATION`) - Vertex AI region, for example `us-central1`- `GOOGLE_APPLICATION_CREDENTIALS` — (optional) path to a service account JSON key file, or rely on ADC when running on GCP

- `GEMINI_MODEL` (or `GOOGLE_MODEL`) - Gemini model id, for example `gemini-1.5-flash`

- `GOOGLE_APPLICATION_CREDENTIALS` - path to a service account JSON key (for local dev), or rely on Application Default Credentials when deployed to GCPThe code will use the Google Auth library to obtain an access token and call the Vertex AI predict endpoint. Example (PowerShell):



Webhook endpoint (POST)```powershell

- `POST /webhook` with JSON body containing:$env:GOOGLE_PROJECT_ID = 'my-project-id'

  - `question` (string) - required$env:GOOGLE_LOCATION = 'us-central1'

  - `source` (string) - optional source identifier$env:GOOGLE_MODEL = 'text-bison@001'

  - `userId` (string) - optional user id$env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\path\to\sa.json'

npm start

Response

- 200 JSON: `{ answer, provider, localScore }`Invoke-RestMethod -Method Post -Uri http://localhost:3000/webhook -Body (ConvertTo-Json @{ question = "How do I reset my password?" }) -ContentType 'application/json'

```

Logs and storage

- Incoming requests are appended to `logs/requests.log`If you prefer a simple gateway that accepts a bearer token, the older `GEMINI_API_URL` + `GEMINI_API_KEY` approach remains in the codebase but Vertex is the recommended path.

- Responses are appended to `logs/responses.json`

Webhook endpoint (POST)

Example (PowerShell, Vertex AI service account JSON)- `POST /webhook` with JSON body:

	- `question` (string) — required

```powershell	- `source` (string) — optional source identifier

$env:GCP_PROJECT = "your-project-id"	- `userId` (string) — optional user id

$env:GCP_LOCATION = "us-central1"

$env:GEMINI_MODEL = "gemini-1.5-flash"Response:

$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\service-account.json"- 200 JSON: { answer, provider, localScore }

npm start

Logs & storage

# Send a webhook question- Incoming requests are appended to `logs/requests.log`.

Invoke-RestMethod -Method Post -Uri http://localhost:3000/webhook -Body (ConvertTo-Json @{ question = "How do I reset my password?"; userId = "user-123" }) -ContentType 'application/json'- Responses are appended to `logs/responses.json`.

```

Example (PowerShell):

Notes

- The server only calls Gemini when the local FAQ similarity score is below 0.55 to save tokens. Adjust this in `src/automation.js` if needed.```powershell

- Ensure the service account has the Vertex AI User role (permission `aiplatform.endpoints.generateContent`).$env:GEMINI_API_URL = "https://your-gemini-endpoint"

- On Cloud Run, GCE, or GKE prefer Workload Identity over long-lived JSON keys.$env:GEMINI_API_KEY = "ya29.your_token"

npm start

Next steps and improvements

- Replace the Jaccard matcher with semantic embeddings plus cosine similarity# then POST a question

- Add a persistent vector store (for example SQLite plus embeddings)Invoke-RestMethod -Method Post -Uri http://localhost:3000/webhook -Body (ConvertTo-Json @{ question = "How do I reset my password?" }) -ContentType 'application/json'

- Add tests and CI```

- Add an admin UI to edit FAQs

- Build a richer chat UI that streams responsesNotes

- The provided `src/gemini.js` is intentionally generic so you can adapt the JSON payload to match your specific Gemini/Vertex AI API shape. If you share the exact endpoint format you intend to use, I can tailor the client to that API.

