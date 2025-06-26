const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content p-6 text-center">
      <p className="text-sm">
        © {new Date().getFullYear()} CarManager. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
