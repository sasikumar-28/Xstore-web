import aspiresLogo from "../assets/aspire-systems-logo/aspire-systems-log-2x.png";

const Footer = () => {
  return (
    <footer className="bg-[#1D1B1B] text-white w-full py-1 px-6 flex justify-between items-center fixed bottom-0 h-16">
      <img src={aspiresLogo} alt="Aspire Systems" width={130} />
      <div className="text-sm">
        <p>123 Main Street,</p>
        <p>Suite 100, San Francisco,</p>
        <p>CA 94158</p>
      </div>
    </footer>
  );
};

export default Footer;
