
import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pour parser le JSON
app.use(express.json());

// Route d'accueil avec guide d'utilisation
app.get('/', (req, res) => {
    const guideHTML = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Guide d'utilisation - API Sapling</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
                line-height: 1.6;
                background-color: #f5f5f5;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 {
                color: #333;
                text-align: center;
                border-bottom: 3px solid #4CAF50;
                padding-bottom: 10px;
            }
            h2 {
                color: #4CAF50;
                margin-top: 30px;
            }
            .endpoint {
                background: #f9f9f9;
                border-left: 4px solid #4CAF50;
                padding: 15px;
                margin: 15px 0;
                border-radius: 5px;
            }
            .method {
                font-weight: bold;
                color: #2196F3;
            }
            .url {
                background: #e8f5e8;
                padding: 5px 10px;
                border-radius: 3px;
                font-family: monospace;
            }
            .example {
                background: #fff3cd;
                padding: 10px;
                border-radius: 5px;
                margin-top: 10px;
                font-family: monospace;
            }
            .description {
                margin: 10px 0;
                color: #666;
            }
            .parameter {
                background: #e3f2fd;
                padding: 5px;
                border-radius: 3px;
                display: inline-block;
                margin: 2px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔧 Guide d'utilisation de l'API Sapling</h1>
            
            <p>Bienvenue sur l'API Sapling ! Cette API vous permet d'utiliser différents services d'intelligence artificielle pour traiter du texte.</p>
            
            <h2>📋 Endpoints disponibles</h2>
            
            <div class="endpoint">
                <h3><span class="method">GET</span> /rephrase</h3>
                <div class="description">Reformule un texte informel en texte formel</div>
                <div class="url">Paramètre : <span class="parameter">sapling</span> (texte à reformuler)</div>
                <div class="example">
                    Exemple : <a href="/rephrase?sapling=hey wuts going on" target="_blank">/rephrase?sapling=hey wuts going on</a>
                </div>
            </div>
            
            <div class="endpoint">
                <h3><span class="method">GET</span> /sapling_grammar</h3>
                <div class="description">Vérifie et corrige la grammaire d'un texte</div>
                <div class="url">Paramètre : <span class="parameter">edite</span> (texte à corriger)</div>
                <div class="example">
                    Exemple : <a href="/sapling_grammar?edite=Hi, How are you doing." target="_blank">/sapling_grammar?edite=Hi, How are you doing.</a>
                </div>
            </div>
            
            <div class="endpoint">
                <h3><span class="method">GET</span> /autocomplete</h3>
                <div class="description">Complète automatiquement une phrase incomplète</div>
                <div class="url">Paramètre : <span class="parameter">sapling_phras</span> (phrase incomplète)</div>
                <div class="example">
                    Exemple : <a href="/autocomplete?sapling_phras=Hi how are" target="_blank">/autocomplete?sapling_phras=Hi how are</a>
                </div>
            </div>
            
            <div class="endpoint">
                <h3><span class="method">GET</span> /ai</h3>
                <div class="description">Détecte si un texte a été généré par une IA</div>
                <div class="url">Paramètre : <span class="parameter">detection</span> (texte à analyser)</div>
                <div class="example">
                    Exemple : <a href="/ai?detection=This is sample text" target="_blank">/ai?detection=This is sample text</a>
                </div>
            </div>
            
            <div class="endpoint">
                <h3><span class="method">POST</span> /summarize</h3>
                <div class="description">Résume un texte long</div>
                <div class="url">Body JSON : <span class="parameter">{"text": "votre texte ici"}</span></div>
                <div class="example">
                    Exemple de requête cURL :<br>
                    curl -X POST -H "Content-Type: application/json" -d '{"text":"Alice was beginning to get very tired..."}' /summarize
                </div>
            </div>
            
            <h2>🚀 Comment utiliser</h2>
            
            <ol>
                <li><strong>Routes GET :</strong> Cliquez directement sur les liens d'exemple ci-dessus</li>
                <li><strong>Route POST :</strong> Utilisez un outil comme Postman, curl ou votre application</li>
                <li><strong>Réponses :</strong> Toutes les réponses sont au format JSON</li>
                <li><strong>Erreurs :</strong> En cas d'erreur, vous recevrez un message d'erreur détaillé</li>
            </ol>
            
            <h2>📄 Format des réponses</h2>
            
            <p>Toutes les réponses contiennent :</p>
            <ul>
                <li>Les données demandées (paraphrase, corrections, suggestions, etc.)</li>
                <li>Un champ <code>status</code> indiquant le succès</li>
                <li>En cas d'erreur : un champ <code>error</code> avec la description</li>
            </ul>
            
            <div style="text-align: center; margin-top: 40px; padding: 20px; background: #e8f5e8; border-radius: 5px;">
                <h3>🌟 Prêt à commencer ?</h3>
                <p>Testez les endpoints directement depuis cette page ou intégrez-les dans votre application !</p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    res.send(guideHTML);
});

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
