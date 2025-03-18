export const getRoute = (role = "admin") => {
  return [
    {
      name: "Xstore",
      children: [
        { name: "Functional Assistant", link: "/Customchatbot" },
        {
          name: "FRD Generation",
          link: "",
          children: [
            {
              name: "Requirement Capture",
              link: "/RequirementCapture",
            },
            {
              name: "Document Generation",
              link: "/chats",
            },
          ],
        },
      ],
    },
  ];
};
