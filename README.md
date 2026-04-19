# FurniCo Online Webstore

Welcome to **FurniCo Online Webstore**, a premium, digitally native furniture shopping experience. FurniCo focuses on providing high-quality, modern, and comfortable furniture directly to consumers without showroom markups.

Here is a comprehensive overview of the website's structure, features, and technology stack.

## 🌟 Core Features

- **Premium Modern Design**: The UI features a clean, professional aesthetic built with plain HTML/CSS and JavaScript. It supports smooth scrolling, modern typography, and responsive layouts.
- **Dark Mode Support**: Users can toggle between light and dark themes seamlessly.
- **E-commerce Capabilities**: A complete frontend shopping experience, grouped by furniture categories, with a functional cart counter and checkout flow (`checkout.html`).
- **Interactive Gaming Hub**: An innovative 'Offers' section (`offers.html`, `brick-breaker.html`) where users can play an arcade-style Brick Breaker game to earn discount codes for their purchases.
- **Owner Contact Form**: A direct line to the founder/CEO for a personalized customer connection directly on the homepage.
- **Newsletter Subscription**: An interactive modal capturing emails to offer first-time purchase discounts.
- **Extensive Knowledge Base**: A dedicated `faq.html` section along with an expanded dataset of over 500 FAQs managed in `furnico_500_faqs.txt`.

## 📂 Project Structure

### Main Pages
- `index.html` - The high-converting landing page featuring hero banners, best-selling categories, a materials guide, and a trust section.
- `checkout.html` - The unified shopping cart and checkout interface.
- `thank-you.html` - Post-purchase confirmation page.

### Product Collections
FurniCo categorizes its offerings into dedicated catalog pages for detailed browsing:
- `sofas.html` - Luxury Sofas
- `beds.html` - Modern Beds
- `chairs.html` - Designer Chairs
- `dining-tables.html` - Dining Tables
- `side-tables.html` - Side Tables

### Content & Marketing
Engaging users through high-quality visual and educational content:
- `blog.html` - Main blog listing.
  - *Articles*: `choosing-right-sofa.html`, `small-space-living.html`, `sustainability-goals-2026.html`, `top-interior-trends.html`, `wood-furniture-care.html`.
- `video-marketing.html` - A dedicated video gallery to showcase furniture dynamically. (Video assets are stored in the `videos` directory).
- `affiliate-marketing.html` - For partners looking to join the FurniCo affiliate program.
- `offers.html` & `brick-breaker.html` - The 'Gaming Hub' offering a gamified approach to earn exclusive discounts.

### Help & Policies
Providing transparency and support for online shoppers:
- `help.html` - The central help and support center.
- `faq.html` - Frequently Asked Questions.
- `shipping.html` - Details about dispatch timelines and pan-India delivery logistics.
- `returns.html` - Information regarding the 7-day easy returns policy.
- `showroom.html` - Details regarding any physical showroom locations.
- `privacy.html`, `terms.html` - Standard legal, terms of service, and privacy policies.

### Core Assets & Configurations
- `style.css` - Custom unified stylesheet. Utilizes CSS variables for theming, Flexbox/Grid for complex modern layouts, and responsive media queries. All inline styles have been systematically refactored into this global file for optimized maintainability.
- `script.js` - Global application logic. Handles the shopping cart badge count, dark mode toggling, form interactions, modal behavior, and smooth internal page routing.
- `furnico_500_faqs.txt` - A large text repository containing comprehensive Q&A pairs for customer support context.

## 🛠️ Technology Stack

- **HTML5**: Leverages semantic tags and highly accessible forms.
- **CSS3**: Fully custom CSS architecture enforcing design tokens via Variables. Relies purely on Vanilla CSS (no external bloating frameworks like Tailwind or Bootstrap) to maintain maximum flexibility and control, adhering to rich aesthetic guidelines.
- **JavaScript (ES6+)**: Handles all frontend logic, DOM manipulation, local storage management (for retaining cart/theme states), and canvas-based game mechanics in the Brick Breaker module.
- **Third-Party Integrations**: 
  - `FontAwesome 6.0` for scalable vector icons.
  - `Jotform` embedded script integrations for advanced form functionality.

## 🚀 Getting Started

To run, preview, or develop this project locally:

1. Clone or download the repository to your local machine.
2. Since this uses a Vanilla HTML/CSS/JS stack, no complex bundlers or `npm install` processes are strictly required.
3. Use your preferred local development server. For instance, you can use the Live Server extension in VS Code, or Python's built-in HTTP server:
   ```bash
   python -m http.server 8000
   ```
4. Navigate to `http://localhost:8000/index.html` in your web browser to start exploring the webstore.
