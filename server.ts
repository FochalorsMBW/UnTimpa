import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { analyzeDocumentWithGemini } from './server/geminiForensics.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Configure JSON parser with generous payload size for high-res images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Forensic Document & Overlay Detection Engine',
      geminiConfigured: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY',
      timestamp: new Date().toISOString()
    });
  });

  // Main Forensics Analyzer Endpoint
  app.post('/api/analyze-document', async (req, res) => {
    try {
      const { imageBase64, mimeType, contextHint, fileName } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: 'imageBase64 parameter is required' });
      }

      const result = await analyzeDocumentWithGemini({
        imageBase64,
        mimeType: mimeType || 'image/png',
        contextHint,
        fileName
      });

      res.json(result);
    } catch (error: any) {
      console.error('API /api/analyze-document error:', error);
      res.status(500).json({
        error: 'Failed to analyze document forensics',
        details: error?.message || String(error)
      });
    }
  });

  // Search Provenance Endpoint
  app.post('/api/search-provenance', async (req, res) => {
    try {
      const { queryText, extractedText } = req.body;
      res.json({
        query: queryText || extractedText,
        verifiedSources: [
          {
            title: 'Koleksi Hoaks & Fact-Check Terkini - CekFakta',
            url: 'https://cekfakta.com',
            snippet: 'Basis data verifikasi klaim visual dan foto hasil manipulasi/timpaan'
          },
          {
            title: 'TurnBackHoax Investigasi Disinformasi',
            url: 'https://turnbackhoax.id',
            snippet: 'Arsip klarifikasi editan tangkapan layar berita dan surat edaran palsu'
          }
        ]
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development vs Static dist for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Forensics server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
});
