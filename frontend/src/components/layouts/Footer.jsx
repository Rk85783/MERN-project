import { Link } from "react-router";
import playStore from "/images/playstore.png";
import appStore from "/images/appstore.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-white font-semibold mb-3">Download Our App</h4>
          <p className="text-sm mb-3">Download App for Android and iOS mobile phone</p>
          <div className="flex gap-2">
            <img src={playStore} alt="Google Play" className="h-10" />
            <img src={appStore} alt="App Store" className="h-10" />
          </div>
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-2xl font-bold text-white mb-2">ShopEase</h1>
          <p className="text-sm">High Quality is our first priority</p>
        </div>

        <div className="text-center md:text-right">
          <h4 className="text-white font-semibold mb-3">Follow Us</h4>
          <div className="flex justify-center md:justify-end gap-4">
            <Link to="" className="hover:text-white transition text-sm">Instagram</Link>
            <Link to="" className="hover:text-white transition text-sm">Youtube</Link>
            <Link to="" className="hover:text-white transition text-sm">Facebook</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-sm">
        Copyrights 2026 &copy; ShopEase. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
