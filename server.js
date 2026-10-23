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

app.get('/api/news/:id', (req, res) => {
    const { id } = req.params;
    
    const newsItem = aiNews.find(news => news.id === parseInt(id));
    
    if (!newsItem) {
        return res.status(404).json({
            success: false,
            message: 'News article not found'
        });
    }
    
    res.json({
        success: true,
        data: newsItem
    });
});

// User authentication API
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    
    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide username, email, and password'
        });
    }
    
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long'
        });
    }
    
    // Check if user already exists (in a real app, you'd check a database)
    const existingUser = users.find(user => user.email === email || user.username === username);
    
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'User with this email or username already exists'
        });
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        username,
        email,
        password, // In a real app, you'd hash this
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    // Remove password from response
    const userResponse = { ...newUser };
    delete userResponse.password;
    
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: userResponse
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    // Find user by email
    const user = users.find(user => user.email === email);
    
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
    
    // Check password (in a real app, you'd compare hashes)
    if (user.password !== password) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
    
    // Generate a simple token (in a real app, you'd use JWT)
    const token = Buffer.from(user.email + user.id).toString('base64');
    
    // Remove password from response
    const userResponse = { ...user };
    delete userResponse.password;
    
    res.json({
        success: true,
        message: 'Login successful',
        data: {
            user: userResponse,
            token
        }
    });
});

app.get('/api/user/:id', (req, res) => {
    const { id } = req.params;
    const userId = parseInt(id);
    
    const user = users.find(user => user.id === userId);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    // Remove password from response
    const userResponse = { ...user };
    delete userResponse.password;
    
    res.json({
        success: true,
        data: userResponse
    });
});

// Newsletter subscription
app.post('/api/subscribe', (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Please provide an email address'
        });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address'
        });
    }
    
    // Check if email already subscribed (in a real app, you'd check a database)
    const existingSubscription = subscribers.find(sub => sub.email === email);
    
    if (existingSubscription) {
        return res.status(400).json({
            success: false,
            message: 'This email is already subscribed'
        });
    }
    
    // Add to subscribers
    const newSubscription = {
        id: subscribers.length + 1,
        email,
        subscribedAt: new Date().toISOString(),
        isActive: true
    };
    
    subscribers.push(newSubscription);
    
    res.json({
        success: true,
        message: 'Successfully subscribed to our newsletter!',
        data: newSubscription
    });
});

// Admin routes
app.get('/admin', (req, res) => {
    res.render('admin', {
        title: 'Admin Dashboard - AI News',
        description: 'Manage AI news articles, users, and subscriptions',
        categories,
        news: aiNews,
        users: users.map(user => ({ ...user, password: undefined })),
        subscribers: subscribers
    });
});

// Initialize users and subscribers arrays
const users = [];
const subscribers = [];

// Render homepage
app.get('/', async (req, res) => {
    try {
        const [categoriesResponse, statsResponse] = await Promise.all([
            axios.get('/api/categories'),
            axios.get('/api/stats')
        ]);
        
        // Try to fetch external news, but use sample data if it fails
        let latestNews = [];
        try {
            const newsResponse = await axios.get('https://api.rss2json.com/api.json?rss_url=https://feeds.feedburner.com/oreilly/radar', { timeout: 5000 });
            latestNews = newsResponse.data && newsResponse.data.items ? newsResponse.data.items.slice(0, 6) : [];
        } catch (newsError) {
            console.error('Error fetching external news:', newsError);
        }
        
        res.render('index', {
            title: 'AI News | Latest Artificial Intelligence Technology News',
            description: 'Stay updated with the latest AI news, developments, and research in machine learning, deep learning, NLP, computer vision, and AI ethics.',
            news: latestNews.length > 0 ? latestNews : aiNews.slice(0, 6),
            categories: categoriesResponse.data.data,
            stats: statsResponse.data.data,
            canonicalUrl: 'https://ainews.example.com'
        });
    } catch (error) {
        console.error('Error loading homepage data:', error);
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