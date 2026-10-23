const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https://picsum.photos", "https://images.unsplash.com"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'", "https://api.rss2json.com", "https://newsapi.org", "https://news.google.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        }
    }
}));

app.use(compression());
app.use(morgan('combined'));

app.use(express.static(path.join(__dirname, 'src/static')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/templates'));

// Sample AI news data (in production, this would come from APIs)
const aiNews = [
    {
        id: 1,
        title: "OpenAI Announces GPT-5 Development",
        description: "OpenAI has revealed plans to develop GPT-5, the next generation of their language models, with enhanced capabilities and improved safety measures.",
        category: "Language Models",
        image: "https://picsum.photos/seed/openai/800/400",
        date: "2024-01-15",
        readTime: "5 min read",
        url: "#",
        tags: ["OpenAI", "GPT-5", "Language Models", "AI Research"]
    },
    {
        id: 2,
        title: "Google DeepMind's AlphaFold 3 Revolutionizes Protein Design",
        description: "DeepMind has released AlphaFold 3, enabling precise protein-ligand binding predictions and opening new possibilities in drug discovery.",
        category: "Machine Learning",
        image: "https://picsum.photos/seed/alphafold/800/400",
        date: "2024-01-14",
        readTime: "7 min read",
        url: "#",
        tags: ["DeepMind", "AlphaFold", "Protein Design", "Drug Discovery"]
    },
    {
        id: 3,
        title: "Tesla's Autopilot System Gets New Computer Vision Capabilities",
        description: "Tesla introduces enhanced computer vision algorithms for improved autonomous driving performance and safety.",
        category: "Computer Vision",
        image: "https://picsum.photos/seed/tesla/800/400",
        date: "2024-01-13",
        readTime: "4 min read",
        url: "#",
        tags: ["Tesla", "Autopilot", "Computer Vision", "Autonomous Driving"]
    },
    {
        id: 4,
        title: "EU AI Act Passes Final Approval",
        description: "The European Union has approved the AI Act, establishing comprehensive regulations for artificial intelligence systems and their deployment.",
        category: "AI Ethics",
        image: "https://picsum.photos/seed/eu/800/400",
        date: "2024-01-12",
        readTime: "6 min read",
        url: "#",
        tags: ["EU", "AI Act", "AI Ethics", "Regulation"]
    },
    {
        id: 5,
        title: "Anthropic Releases Claude 3 with Enhanced Reasoning",
        description: "Anthropic's latest Claude 3 model demonstrates superior reasoning capabilities and safety improvements over previous iterations.",
        category: "Language Models",
        image: "https://picsum.photos/seed/claude/800/400",
        date: "2024-01-11",
        readTime: "5 min read",
        url: "#",
        tags: ["Anthropic", "Claude 3", "Language Models", "AI Safety"]
    },
    {
        id: 6,
        title: "Neural Networks Achieve Human-Level Performance in Protein Folding",
        description: "Researchers demonstrate that AI systems can now solve protein folding problems at human expert levels, potentially revolutionizing biotechnology.",
        category: "Machine Learning",
        image: "https://picsum.photos/seed/protein/800/400",
        date: "2024-01-10",
        readTime: "8 min read",
        url: "#",
        tags: ["Protein Folding", "Deep Learning", "Bioinformatics", "AI Research"]
    }
];

// Categories for filtering
const categories = [
    "All",
    "Machine Learning",
    "Deep Learning", 
    "Language Models",
    "Computer Vision",
    "NLP",
    "AI Ethics",
    "Industry News",
    "Research",
    "Tutorials"
];

// API routes for news data
app.get('/api/news', (req, res) => {
    const { category, search } = req.query;
    
    let filteredNews = aiNews;
    
    // Filter by category
    if (category && category !== 'All') {
        filteredNews = filteredNews.filter(news => 
            news.category.toLowerCase().includes(category.toLowerCase())
        );
    }
    
    // Filter by search
    if (search) {
        const searchLower = search.toLowerCase();
        filteredNews = filteredNews.filter(news =>
            news.title.toLowerCase().includes(searchLower) ||
            news.description.toLowerCase().includes(searchLower) ||
            news.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
    }
    
    res.json({
        success: true,
        count: filteredNews.length,
        data: filteredNews
    });
});

app.get('/api/categories', (req, res) => {
    res.json({
        success: true,
        data: categories
    });
});

app.get('/api/stats', (req, res) => {
    const stats = {
        totalNews: aiNews.length,
        categories: [...new Set(aiNews.map(news => news.category))].length,
        latestNews: aiNews.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3),
        popularTags: Array.from(
            aiNews.flatMap(news => news.tags)
                .reduce((acc, tag) => {
                    acc[tag] = (acc[tag] || 0) + 1;
                    return acc;
                }, {})
                .sort((a, b) => b - a)
                .slice(0, 10)
                .keys()
        )
    };
    
    res.json({
        success: true,
        data: stats
    });
});

// Render homepage
app.get('/', async (req, res) => {
    try {
        const [newsResponse, categoriesResponse, statsResponse] = await Promise.all([
            axios.get('https://api.rss2json.com/api.json?rss_url=https://feeds.feedburner.com/oreilly/radar'),
            axios.get('/api/categories'),
            axios.get('/api/stats')
        ]);
        
        const latestNews = newsResponse.data && newsResponse.data.items ? newsResponse.data.items.slice(0, 6) : [];
        
        res.render('index', {
            title: 'AI News | Latest Artificial Intelligence Technology News',
            description: 'Stay updated with the latest AI news, developments, and research in machine learning, deep learning, NLP, computer vision, and AI ethics.',
            news: latestNews.length > 0 ? latestNews : aiNews.slice(0, 6),
            categories: categoriesResponse.data.data,
            stats: statsResponse.data.data,
            canonicalUrl: 'https://ainews.example.com'
        });
    } catch (error) {
        console.error('Error fetching external news:', error);
        res.render('index', {
            title: 'AI News | Latest Artificial Intelligence Technology News',
            description: 'Stay updated with the latest AI news, developments, and research in machine learning, deep learning, NLP, computer vision, and AI ethics.',
            news: aiNews.slice(0, 6),
            categories: categories,
            stats: {
                totalNews: aiNews.length,
                categories: [...new Set(aiNews.map(news => news.category))].length,
                latestNews: aiNews.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3),
                popularTags: Array.from(
                    aiNews.flatMap(news => news.tags)
                        .reduce((acc, tag) => {
                            acc[tag] = (acc[tag] || 0) + 1;
                            return acc;
                        }, {})
                        .sort((a, b) => b - a)
                        .slice(0, 10)
                        .keys()
                )
            },
            canonicalUrl: 'https://ainews.example.com'
        });
    }
});

app.get('/search', (req, res) => {
    const { q } = req.query;
    res.render('search', {
        title: `Search Results for "${q}" - AI News`,
        description: `Search results for AI news articles about ${q}`, 
        canonicalUrl: `https://ainews.example.com/search?q=${encodeURIComponent(q)}`,
        searchQuery: q || '',
        categories: categories
    });
});

app.get('/category/:categoryName', (req, res) => {
    const { categoryName } = req.params;
    res.render('category', {
        title: `${categoryName} - AI News Articles`,
        description: `Browse AI news articles in the ${categoryName} category`,
        canonicalUrl: `https://ainews.example.com/category/${categoryName}`,
        categoryName: categoryName,
        categories: categories
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About AI News | Latest Artificial Intelligence Updates',
        description: 'Learn about AI News, our mission to provide comprehensive artificial intelligence coverage, and our commitment to quality journalism in the AI field.',
        canonicalUrl: 'https://ainews.example.com/about',
        categories: categories
    });
});

// Error handling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).render('error', {
        title: 'Error - AI News',
        message: err.status === 404 ? 'Page Not Found' : 'Something Went Wrong',
        categories: categories
    });
});

app.listen(PORT, () => {
    console.log(`AI News Website running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});