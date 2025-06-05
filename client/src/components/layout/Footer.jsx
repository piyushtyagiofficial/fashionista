import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaYoutube, FaCreditCard, FaPaypal, FaApplePay, FaCcVisa, FaCcMastercard } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 mt-auto">
      <div className="container">
        {/* Footer Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">FASHIONISTA</h3>
            <p className="text-white/90 mb-4">
              Discover the latest trends in fashion with our curated collection of clothing and accessories.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-white hover:text-secondary-main transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-secondary-main transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-secondary-main transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-secondary-main transition-colors">
                <FaPinterest size={20} />
              </a>
              <a href="#" className="text-white hover:text-secondary-main transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Shop</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/?category=men" className="text-white/90 hover:text-secondary-main transition-colors">
                  Men's Fashion
                </Link>
              </li>
              <li>
                <Link to="/?category=women" className="text-white/90 hover:text-secondary-main transition-colors">
                  Women's Fashion
                </Link>
              </li>
              <li>
                <Link to="/?category=kids" className="text-white/90 hover:text-secondary-main transition-colors">
                  Kids' Fashion
                </Link>
              </li>
              <li>
                <Link to="/?category=accessories" className="text-white/90 hover:text-secondary-main transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/?sort=newest" className="text-white/90 hover:text-secondary-main transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/" className="text-white/90 hover:text-secondary-main transition-colors">
                  Sale Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-white/90 hover:text-secondary-main transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/90 hover:text-secondary-main transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/90 hover:text-secondary-main transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/90 hover:text-secondary-main transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/90 hover:text-secondary-main transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/90 hover:text-secondary-main transition-colors">
                  Gift Cards
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Stay Updated</h4>
            <p className="text-white/90 mb-4">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <form className="flex mb-4">
              <input
                type="email"
                placeholder="Your email address"
                className="py-2 px-3 rounded-l-md text-neutral-900 w-full focus:outline-none"
              />
              <button
                type="submit"
                className="bg-secondary-main text-primary-dark py-2 px-4 rounded-r-md font-medium hover:bg-secondary-dark transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-wrap justify-center gap-6 py-6 border-t border-b border-neutral-700">
          <div className="flex items-center text-white">
            <span className="mr-2 text-sm">We Accept:</span>
            <div className="flex gap-3">
              <FaCreditCard size={24} />
              <FaPaypal size={24} />
              <FaApplePay size={24} />
              <FaCcVisa size={24} />
              <FaCcMastercard size={24} />
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 text-center text-white/70 text-sm">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link to="#" className="hover:text-secondary-main transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-secondary-main transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="hover:text-secondary-main transition-colors">
              Shipping Policy
            </Link>
            <Link to="#" className="hover:text-secondary-main transition-colors">
              Returns Policy
            </Link>
          </div>
          <p>&copy; {currentYear} Fashionista. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;