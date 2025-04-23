import aspireLogo from "../assets/aspire-systems-logo/aspire-systems-log-2x.png";
import { Select } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectCustomerId, setCustomerId } from "@/redux/slices/userSlice";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const dispatch = useAppDispatch();
  const selectedEmail = useAppSelector(selectCustomerId);
  const { toast } = useToast();

  const images = [
    { url: "./images/logos/oracle.png", className: "h-3 mr-2" },
    { url: "./images/logos/salesforce.png", className: "h-12" },
    { url: "./images/logos/commercetools.png", className: "h-12" },
  ];

  const emailOptions = [
    { value: "", label: "Select Email" },
    { value: "shailja.pathak@aspiresys.com", label: "Shailja Pathak" },
    { value: "iliyas.ahmed@aspiresys.com", label: "Iliyas Ahmed" },
    {
      value: "srinivas.kavampalli@aspiresys.com",
      label: "Srinivas Kavampalli",
    },
    { value: "chaitanya.rebbana@aspiresys.com", label: "Chaitanya Rebbana" },
    { value: "mohan.lingaiah@aspiresys.com", label: "Mohan Lingaiah" },
  ];

  const handleEmailChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const email = e.target.value;
    dispatch(setCustomerId(email));

    if (email) {
      toast({
        title: "Email Selected",
        description: `You've selected ${email}`,
      });
    }
  };

  return (
    <>
      <header className="bg-[#804C9E] text-white px-9 flex justify-between items-center h-16">
        <img src={aspireLogo} alt="Aspire Systems" width={130} />
        <Select
          options={emailOptions}
          value={selectedEmail}
          onChange={handleEmailChange}
          className="w-64 text-white bg-[#804C9E] border-white focus:border-white focus:ring-white focus:ring-offset-[#804C9E] rounded-md"
          placeholder="Select Email"
        />
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
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
        </div>
      </header>
    </>
  );
};

export default Header;
