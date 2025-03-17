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
              link: "/chats",
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
