# AI News Website

A modern, responsive AI news website that collects and categorizes the latest artificial intelligence news and developments.

## Features

- **Latest AI News**: Real-time updates from various AI sources
- **Category Filtering**: Browse by Machine Learning, Deep Learning, NLP, Computer Vision, AI Ethics, Industry News, Research, and Tutorials
- **Advanced Search**: Search through articles by keywords, tags, and categories
- **Modern Design**: Responsive, mobile-friendly design with hover effects
- **SEO Optimized**: Proper meta tags, descriptions, and schema markup
- **Performance Optimized**: Fast loading times with lazy loading and compression
- **Multi-language Support**: English, Swedish, and German language options
- **Accessibility**: ARIA labels and keyboard navigation

## Technology Stack

- **Framework**: Node.js + Express
- **Template Engine**: EJS
- **Styling**: Modern CSS with CSS variables and responsive design
- **Data Fetching**: Axios for RSS feed integration
- **Security**: Helmet for security headers
- **Performance**: Compression middleware
- **Icons**: SVG icons inline

## Project Structure

```
├── src/
│   ├── templates/        # EJS templates
│   │   ├── index.ejs     # Homepage
│   │   ├── search.ejs    # Search results
│   │   ├── category.ejs  # Category page
│   │   ├── about.ejs     # About page
│   │   └── error.ejs     # Error page
│   ├── static/           # Static assets
│   │   ├── css/          # CSS files
│   │   │   └── main.css  # Main stylesheet
│   │   └── images/       # Images
└── server.js             # Main server file
├── package.json          # Dependencies and scripts
├── netlify.toml          # Netlify configuration
└── .gitignore            # Git ignore file
```

## API Endpoints

- `GET /api/news` - Get news with optional category and search filtering
- `GET /api/categories` - Get all available categories
- `GET /api/stats` - Get website statistics and popular tags

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Visit `http://localhost:3000`

### News Categories
- Browse articles by category
- Filter and sort functionality
- Category-based navigation

### Search
- Advanced search with filters
- Real-time search suggestions
- Search history and analytics

### About Page
- Company information
- Mission and values
- Contact information

## Design Philosophy

- **User-Centric**: Prioritize user experience and accessibility
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Performance**: Optimized for fast loading and smooth interactions
- **Maintainable**: Clean, well-documented code
- **Scalable**: Easy to extend with new features

## Accessibility

- Screen reader support
- Keyboard navigation
- ARIA labels and semantic HTML
- High contrast and focus states

## License

MIT License. Free to use and modify.
