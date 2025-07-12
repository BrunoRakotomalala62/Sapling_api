
import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 5000;

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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Try: http://localhost:${PORT}/rephrase?sapling=hey wuts going on`);
});
