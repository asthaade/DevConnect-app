import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      className="w-full flex flex-col md:flex-row items-center justify-between bg-purple-950 text-neutral-content p-4 fixed bottom-0 z-50 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.aside 
        className="flex items-center space-x-2 mb-2 md:mb-0"
        whileHover={{ scale: 1.02 }}
      >
        <motion.svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fillRule="evenodd"
          clipRule="evenodd"
          className="fill-current"
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <path
            d="M22.672 15.226l-2.432.811...z"
          ></path>
        </motion.svg>
        <motion.p 
          className="text-white text-sm md:text-base"
          whileHover={{
            backgroundPosition: '100% 50%',
            transition: { duration: 1.5 }
          }}
          style={{
            background: 'linear-gradient(to right, #fff 50%, #a5b4fc 100%)',
            backgroundSize: '200% 100%',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}
        >
          Copyright © {new Date().getFullYear()} - All rights reserved
        </motion.p>
      </motion.aside>

      <motion.nav 
        className="flex space-x-4"
        whileHover={{ scale: 1.02 }}
      >
        {[...Array(3)].map((_, idx) => (
          <motion.a
            key={idx}
            whileHover={{ y: -2, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current hover:fill-white transition-colors"
            >
              <path d={idx === 0 ? "M24 4.557c..." : idx === 1 ? "M19.615 3.184..." : "M9 8h..."} />
            </svg>
          </motion.a>
        ))}
      </motion.nav>
    </motion.footer>
  );
};

export default Footer;
