import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import mastercard from '../assets/images/payment.png';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__columns">
          <div className="footer__column">
            <h4>About Us</h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque leo at augue gravida, nec blandit nulla.</p>
          </div>
          <div className="footer__column">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/store">Store</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer__column">
            <h4>Support</h4>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shipping">Shipping</Link></li>
              <li><Link to="/returns">Returns</Link></li>
              <li><Link to="/order-tracking">Order Tracking</Link></li>
            </ul>
          </div>
          <div className="footer__column">
            <h4>Payment Methods</h4>
            <div className="footer__payments">
              <img src={mastercard} alt="MasterCard" />
            </div>
          </div>
          <div className="footer__column">
            <h4>Follow Us</h4>
            <div className="footer__social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
        <p><Link to="/privacy-policy">Privacy Policy</Link> | <Link to="/terms-of-service">Terms of Service</Link></p>
      </div>
    </footer>
  );
};

export default Footer;
