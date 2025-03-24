import aspireLogo from "../assets/aspire-systems-logo/aspire-systems-log-2x.png";

const Header = () => {
  const images = [
    { url: "./images/logos/oracle.png", className: "h-3 mr-2" },
    { url: "./images/logos/salesforce.png", className: "h-12" },
    { url: "./images/logos/commercetools.png", className: "h-12" },
  ];
  return (
    <>
      <header className="bg-[#804C9E] text-white px-9 flex justify-between items-center h-16">
        <img
          src={aspireLogo}
          alt="Aspire Systems"
          width={130}
          // className="h-8"
        />
        <div className="text-sm flex items-center gap-2">
          {images.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={`Aspire AI ${index}`}
              className={image.className}
            />
          ))}
        </div>
      </header>
    </>
  );
};

export default Header;
