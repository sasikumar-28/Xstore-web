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
    { value: "chaitanya.rebbana@aspiresys.com", label: "Chaitanya Rebbana" },
    { value: "iliyas.ahmed@aspiresys.com", label: "Iliyas Ahmed" },
    { value: "mohan.lingaiah@aspiresys.com", label: "Mohan Lingaiah" },
    { value: "shailja.pathak@aspiresys.com", label: "Shailja Pathak" },
    {
      value: "srinivas.kavampalli@aspiresys.com",
      label: "Srinivas Kavampalli",
    },
  ];

  const handleEmailChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const email = e.target.value;
    dispatch(setCustomerId(email));

    if (email) {
      toast({
        title: "Name Selected",
        description: `You've selected ${
          emailOptions.find((option) => option.value === email)?.label
        }`,
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
          placeholder="Select Your Name"
        />
        <div className="flex items-center gap-4">
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
