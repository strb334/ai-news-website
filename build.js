const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Read the package.json to get app info
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

// Sample data for static generation
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

// Read template files
const templatesDir = path.join(__dirname, 'src/templates');
const staticDir = path.join(__dirname, 'src/static');

// Helper function to render EJS template with data
async function renderTemplate(templateName, data) {
    const templatePath = path.join(templatesDir, templateName);
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    return await ejs.render(templateContent, data);
}

// Build homepage
async function buildHomepage() {
    const html = await renderTemplate('index.ejs', {
        title: 'AI News | Latest Artificial Intelligence Technology News',
        description: 'Stay updated with the latest AI news, developments, and research in machine learning, deep learning, NLP, computer vision, and AI ethics.',
        news: aiNews.slice(0, 6),
        categories: categories,
        canonicalUrl: 'https://ainews.example.com'
    });
    
    fs.writeFileSync(path.join(distDir, 'index.html'), html);
    console.log('✓ Built homepage');
}

// Build search page
async function buildSearchPage() {
    const html = await renderTemplate('search.ejs', {
        title: 'Search - AI News',
        description: 'Search AI news articles by topic or technology',
        searchQuery: '',
        categories: categories
    });
    
    fs.writeFileSync(path.join(distDir, 'search.html'), html);
    console.log('✓ Built search page');
}

// Build category pages
async function buildCategoryPages() {
    // Create category directory
    const categoryDir = path.join(distDir, 'category');
    if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
    }
    
    for (const category of categories) {
        if (category === 'All') continue;
        
        const filteredNews = aiNews.filter(news => 
            news.category.toLowerCase().includes(category.toLowerCase())
        );
        
        const slug = category.toLowerCase().replace(/\s+/g, '-');
        const html = await renderTemplate('category.ejs', {
            title: `${category} - AI News Articles`,
            description: `Browse AI news articles in the ${category} category`,
            canonicalUrl: `https://ainews.example.com/category/${slug}`,
            categoryName: category,
            categories: categories
        });
        
        fs.writeFileSync(path.join(categoryDir, `${slug}.html`), html);
        console.log(`✓ Built category page: ${category}`);
    }
}

// Build about page
async function buildAboutPage() {
    const html = await renderTemplate('about.ejs', {
        title: 'About AI News | Latest Artificial Intelligence Updates',
        description: 'Learn about AI News, our mission to provide comprehensive artificial intelligence coverage, and our commitment to quality journalism in the AI field.',
        canonicalUrl: 'https://ainews.example.com/about',
        categories: categories
    });
    
    fs.writeFileSync(path.join(distDir, 'about.html'), html);
    console.log('✓ Built about page');
}

// Build article pages
async function buildArticlePages() {
    // Create article directory
    const articleDir = path.join(distDir, 'article');
    if (!fs.existsSync(articleDir)) {
        fs.mkdirSync(articleDir, { recursive: true });
    }
    
    for (const news of aiNews) {
        const html = await renderTemplate('article.ejs', {
            title: `${news.title} - AI News`,
            description: news.description,
            news: news,
            canonicalUrl: `https://ainews.example.com/article?id=${news.id}`,
            categories: categories
        });
        
        fs.writeFileSync(path.join(articleDir, `${news.id}.html`), html);
        console.log(`✓ Built article page: ${news.title}`);
    }
}

// Copy static files
function copyStaticFiles() {
    const staticDestDir = path.join(distDir, 'css');
    const imagesDestDir = path.join(distDir, 'images');
    
    // Create destination directories
    if (!fs.existsSync(staticDestDir)) {
        fs.mkdirSync(staticDestDir, { recursive: true });
    }
    if (!fs.existsSync(imagesDestDir)) {
        fs.mkdirSync(imagesDestDir, { recursive: true });
    }
    
    // Copy CSS files
    const cssFiles = fs.readdirSync(path.join(staticDir, 'css'));
    for (const file of cssFiles) {
        fs.copyFileSync(
            path.join(staticDir, 'css', file),
            path.join(staticDestDir, file)
        );
        console.log(`✓ Copied CSS: ${file}`);
    }
    
    // Copy images files
    if (fs.existsSync(path.join(staticDir, 'images'))) {
        const imageFiles = fs.readdirSync(path.join(staticDir, 'images'));
        for (const file of imageFiles) {
            fs.copyFileSync(
                path.join(staticDir, 'images', file),
                path.join(imagesDestDir, file)
            );
            console.log(`✓ Copied image: ${file}`);
        }
    }
    
    console.log('✓ Copied static files');
}

// Create 404 page
async function build404Page() {
    const html = await renderTemplate('error.ejs', {
        title: 'Page Not Found - AI News',
        message: 'Page Not Found',
        categories: categories
    });
    
    fs.writeFileSync(path.join(distDir, '404.html'), html);
    console.log('✓ Built 404 page');
}

// Create sitemap.xml
function createSitemap() {
    const sitemapPath = path.join(distDir, 'sitemap.xml');
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.4">\n';
    
    // Add main pages
    const pages = [
        { url: 'https://ainews.example.com/', changefreq: 'daily', priority: '1.0' },
        { url: 'https://ainews.example.com/search.html', changefreq: 'weekly', priority: '0.8' },
        { url: 'https://ainews.example.com/about.html', changefreq: 'monthly', priority: '0.6' }
    ];
    
    // Add category pages
    for (const category of categories) {
        if (category === 'All') continue;
        const slug = category.toLowerCase().replace(/\s+/g, '-');
        pages.push({
            url: `https://ainews.example.com/category/${slug}.html`,
            changefreq: 'weekly',
            priority: '0.7'
        });
    }
    
    // Add article pages
    for (const news of aiNews) {
        pages.push({
            url: `https://ainews.example.com/article/${news.id}.html`,
            changefreq: 'weekly',
            priority: '0.7'
        });
    }
    
    for (const page of pages) {
        sitemap += `  <url>\n`;
        sitemap += `    <loc>${page.url}</loc>\n`;
        sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
        sitemap += `    <priority>${page.priority}</priority>\n`;
        sitemap += `  </url>\n`;
    }
    
    sitemap += '</urlset>';
    fs.writeFileSync(sitemapPath, sitemap);
    console.log('✓ Created sitemap.xml');
}

// Main build function
async function build() {
    try {
        console.log('🚀 Starting build process...');
        await buildHomepage();
        await buildSearchPage();
        await buildCategoryPages();
        await buildAboutPage();
        await buildArticlePages();
        copyStaticFiles();
        await build404Page();
        createSitemap();
        
        console.log('\n✅ Build completed successfully!');
        console.log('📁 Files built to:', distDir);
        console.log('\n📋 Built files:');
        const files = fs.readdirSync(distDir);
        for (const file of files.sort()) {
            const stat = fs.statSync(path.join(distDir, file));
            if (stat.isFile()) {
                const size = (stat.size / 1024).toFixed(2);
                console.log(`  📄 ${file} (${size} KB)`);
            }
        }
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

// Run build
build();