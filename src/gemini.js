let auth = null;

async function getAuth() {
  if (!auth) {
    const { GoogleAuth } = await import('google-auth-library');
    auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
  }
  return auth;
}

function resolveConfig(opts = {}) {
  const projectId = opts.projectId
    ?? process.env.GCP_PROJECT
    ?? process.env.GOOGLE_CLOUD_PROJECT
    ?? process.env.GOOGLE_PROJECT_ID;
  const location = opts.location
    ?? process.env.GCP_LOCATION
    ?? process.env.GOOGLE_LOCATION
    ?? 'us-central1';
  const modelId = opts.model
    ?? process.env.GEMINI_MODEL
    ?? process.env.GOOGLE_MODEL
    ?? 'gemini-1.5-flash';

  if (!projectId) throw new Error('Set GCP_PROJECT (or GOOGLE_CLOUD_PROJECT) to call Vertex AI Gemini');
  if (!location) throw new Error('Set GCP_LOCATION (or GOOGLE_LOCATION) to call Vertex AI Gemini');
  if (!modelId) throw new Error('Set GEMINI_MODEL (or GOOGLE_MODEL) to call Vertex AI Gemini');

  const resource = modelId.includes('/') ? modelId : `publishers/google/models/${modelId}`;
  const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/${resource}:generateContent`;

  return { projectId, location, modelId: resource, url };
}

function extractText(data) {
  const candidate = data?.candidates?.[0];
  const parts = candidate?.content?.parts;
  if (Array.isArray(parts)) {
    const textPart = parts.find(part => typeof part?.text === 'string' && part.text.length > 0);
    if (textPart?.text) return textPart.text;
  }
  if (candidate?.output) return candidate.output;
  const prediction = data?.predictions?.[0];
  if (prediction) {
    return prediction.content || prediction.text || prediction.displayText || null;
  }
  return null;
}

export async function callGemini(prompt, opts = {}) {
  const { url, modelId } = resolveConfig(opts);
  const auth = await getAuth();
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const token = typeof tokenResponse === 'string' ? tokenResponse : tokenResponse?.token;
  if (!token) throw new Error('Unable to obtain Google Cloud access token for Vertex AI');

  const generationConfig = {
    temperature: typeof opts.temperature === 'number' ? opts.temperature : 0.3,
    maxOutputTokens: opts.max_tokens || 512
  };

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    generationConfig
  };

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Vertex AI error ${resp.status}: ${txt}`);
  }

  const data = await resp.json();
  const text = extractText(data);
  return { text, raw: data, model: modelId };
}
