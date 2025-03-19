import aspireLogo from "../assets/aspire-systems-logo/aspire-systems-log-2x.png";

const Header = () => {
  return (
    <>
      <header className="bg-[#804C9E] text-white px-9 flex justify-between items-center h-16">
        <img
          src={aspireLogo}
          alt="Aspire Systems"
          width={130}
          // className="h-8"
        />
        <div className="text-sm">
          <p>123-456-7890</p>
          <p>info@aspiresys.com</p>
        </div>
      </header>
    </>
  );
};

export default Header;
