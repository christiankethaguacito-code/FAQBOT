import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { findBestAnswer } from './faq.js';
// import { callGemini } from './gemini.js'; // Disabled for now

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_DIR = path.join(__dirname, '../logs');
const REQ_LOG = path.join(LOG_DIR, 'requests.log');
const RESP_FILE = path.join(LOG_DIR, 'responses.json');

async function ensureLogDir() {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
  } catch (e) {
    // ignore
  }
  try {
    await fs.access(RESP_FILE);
  } catch (e) {
    await fs.writeFile(RESP_FILE, '[]', 'utf8');
  }
}

function now() {
  return new Date().toISOString();
}

async function appendRequestLog(obj) {
  const line = JSON.stringify(obj) + '\n';
  await fs.appendFile(REQ_LOG, line, 'utf8');
}

async function storeResponse(record) {
  const text = await fs.readFile(RESP_FILE, 'utf8');
  const arr = JSON.parse(text || '[]');
  arr.push(record);
  await fs.writeFile(RESP_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

export async function handleIncomingWebhook(req, res) {
  await ensureLogDir();

  const payload = req.body || {};
  const question = (payload.question || '').toString().trim();
  const source = payload.source || 'unknown';
  const userId = payload.userId || payload.user || null;

  if (!question) return res.status(400).json({ error: 'question is required' });

  const reqRecord = { ts: now(), source, userId, question };
  await appendRequestLog(reqRecord);

  // load faqs each request to keep it simple and allow editing faqs.json live
  const faqsFile = path.join(__dirname, '../faqs.json');
  const faqs = JSON.parse(await fs.readFile(faqsFile, 'utf8'));
  const local = findBestAnswer(question, faqs);

  // Compose context and prompt
  const contextSnippet = `Closest FAQ match (score=${Math.round((local.score||0)*100)/100}): Q: ${local.faq?.question || ''}\nA: ${local.answer || ''}`;
  const prompt = `${payload.promptPrefix || 'You are a helpful assistant.'}\nUser question: ${question}\n\nContext:\n${contextSnippet}\n\nIf the context answers the question, answer concisely and cite the FAQ. Otherwise answer based on general knowledge.`;

  let geminiData = null;
  let answerText = local.answer || null;
  let used = 'local';
  
  // Gemini integration disabled - set GCP_PROJECT to enable
  // const vertexConfigured = Boolean(
  //   process.env.GCP_PROJECT
  //   || process.env.GOOGLE_CLOUD_PROJECT
  //   || process.env.GOOGLE_PROJECT_ID
  // );
  // try {
  //   if (vertexConfigured && local.score < 0.55) {
  //     geminiData = await callGemini(prompt, { max_tokens: 400, temperature: 0.2 });
  //     if (geminiData?.text) {
  //       answerText = geminiData.text;
  //       used = 'gemini';
  //     }
  //   }
  // } catch (err) {
  //   console.error('Gemini call failed', err);
  // }

  const record = {
    ts: now(),
    source,
    userId,
    question,
    answer: answerText,
    provider: used,
    geminiModel: geminiData?.model || null,
    localScore: local.score,
    geminiRaw: geminiData?.raw || null
  };

  await storeResponse(record);

  // Return the answer and metadata to the caller
  return res.json({ answer: answerText, provider: used, localScore: local.score });
}
