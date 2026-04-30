import React from 'react';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="header">
        <nav className="nav">
          <a href="#features" className="nav-link">Features</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#testimonials" className="nav-link">Testimonials</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>
        <div className="hero">
          <h1>Welcome to Tabbly</h1>
          <p>Revolutionize your dining experience with our NFC chips and software. Let your customers see the menu, order, and pay effortlessly.</p>
          <a href="#contact" className="btn">Get Started</a>
        </div>
      </header>

      <section id="features" className="features">
        <div className="feature">
          <h3>NFC Chips</h3>
          <p>Our durable and easy-to-install NFC chips allow customers to access your menu with a simple tap of their smartphone.</p>
        </div>
        <div className="feature">
          <h3>Digital Menu</h3>
          <p>Update your menu in real-time. Add new items, change prices, or highlight specials without reprinting menus.</p>
        </div>
        <div className="feature">
          <h3>Order & Pay</h3>
          <p>Customers can place orders and pay directly from their table, reducing wait times and increasing table turnover.</p>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>Step 1: Install NFC Chips</h3>
            <p>Place our NFC chips on your tables. They are easy to install and blend seamlessly with your decor.</p>
          </div>
          <div className="step">
            <h3>Step 2: Customize Your Menu</h3>
            <p>Use our intuitive software to create and customize your digital menu. Add photos, descriptions, and prices.</p>
          </div>
          <div className="step">
            <h3>Step 3: Let Customers Order & Pay</h3>
            <p>Customers tap the NFC chip, browse the menu, place their order, and pay—all from their phone.</p>
          </div>
        </div>
      </section>

      <section id="testimonials" className="testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonial">
          <p>Tabbly transformed our restaurant. Our customers love the convenience, and we have seen a 30% increase in table turnover!</p>
          <p><strong>— Jane Doe, Restaurant Owner</strong></p>
        </div>
      </section>

      <section id="contact" className="cta">
        <h2>Ready to Get Started?</h2>
        <p>Contact us today to learn more about how Tabbly can help your restaurant.</p>
        <a href="mailto:contact@tabbly.com" className="btn">Contact Us</a>
      </section>

      <footer className="footer">
        <p>&copy; 2026 Tabbly. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;