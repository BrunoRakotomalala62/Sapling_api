
import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pour parser le JSON
app.use(express.json());

async function rephraseText(text) {
    try {
        const response = await axios.post(
            'https://api.sapling.ai/api/v1/rephrase',
            {
                key: process.env.API_KEY_SAPLING,
                text,
                mapping: 'informal_to_formal'
            },
        );

        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.msg || 'Error rephrasing text');
    }
}

async function grammarCheck(text) {
    try {
        const response = await axios.post(
            'https://api.sapling.ai/api/v1/edits',
            {
                key: process.env.API_KEY_SAPLING,
                session_id: 'test session',
                text,
            },
        );

        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.msg || 'Error checking grammar');
    }
}

async function autocompleteText(query) {
    try {
        const response = await axios.post(
            'https://api.sapling.ai/api/v1/complete',
            {
                key: process.env.API_KEY_SAPLING,
                session_id: 'test session',
                query,
            },
        );

        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.msg || 'Error completing text');
    }
}

async function summarizeText(text) {
    try {
        const response = await axios.post(
            'https://api.sapling.ai/api/v1/summarize',
            {
                key: process.env.API_KEY_SAPLING,
                text,
            },
        );

        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.msg || 'Error summarizing text');
    }
}

async function detectAI(text) {
    try {
        const response = await axios.post(
            'https://api.sapling.ai/api/v1/aidetect',
            {
                key: process.env.API_KEY_SAPLING,
                text,
            },
        );

        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.msg || 'Error detecting AI content');
    }
}

app.get('/rephrase', async (req, res) => {
    const { sapling } = req.query;
    
    if (!sapling) {
        return res.status(400).json({ error: 'Parameter sapling is required' });
    }

    try {
        const data = await rephraseText(sapling);
        
        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            return res.json({
                "phrase réel": result.original,
                "paraphrase": result.replacement
            });
        } else {
            return res.status(500).json({ error: 'No results from API' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/sapling_grammar', async (req, res) => {
    const { edite } = req.query;
    
    if (!edite) {
        return res.status(400).json({ error: 'Parameter edite is required' });
    }

    try {
        const data = await grammarCheck(edite);
        
        return res.json({
            "texte original": edite,
            "corrections": data.edits || [],
            "status": "success"
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/autocomplete', async (req, res) => {
    const { sapling_phras } = req.query;
    
    if (!sapling_phras) {
        return res.status(400).json({ error: 'Parameter sapling_phras is required' });
    }

    try {
        const data = await autocompleteText(sapling_phras);
        
        return res.json({
            "phrase incomplète": sapling_phras,
            "suggestions": data.suggestions || [],
            "status": "success"
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/ai', async (req, res) => {
    const { detection } = req.query;
    
    if (!detection) {
        return res.status(400).json({ error: 'Parameter detection is required' });
    }

    try {
        const data = await detectAI(detection);
        
        return res.json({
            "texte analysé": detection,
            "score IA": data.score || 0,
            "probabilité IA": data.score ? `${(data.score * 100).toFixed(2)}%` : "0%",
            "verdict": data.score > 0.5 ? "Probablement généré par IA" : "Probablement écrit par un humain",
            "status": "success"
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.post('/summarize', async (req, res) => {
    const { text } = req.body;
    
    if (!text) {
        return res.status(400).json({ error: 'Parameter text is required in request body' });
    }

    try {
        const data = await summarizeText(text);
        
        return res.json({
            "texte original": text.substring(0, 100) + (text.length > 100 ? "..." : ""),
            "résumé": data.result || "Aucun résumé généré",
            "status": "success"
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Try: http://localhost:${PORT}/rephrase?sapling=hey wuts going on`);
    console.log(`Try: http://localhost:${PORT}/sapling_grammar?edite=Hi, How are you doing.`);
    console.log(`Try: http://localhost:${PORT}/autocomplete?sapling_phras=Hi how are`);
    console.log(`Try: http://localhost:${PORT}/ai?detection=This is sample text`);
    console.log(`Try POST: http://localhost:${PORT}/summarize with {"text": "your text here"}`);
});
