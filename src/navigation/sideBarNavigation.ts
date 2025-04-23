export const getRoute = (role = "admin") => {
  console.log(role);
  return [
    {
      name: "Xstore",
      children: [
        {
          name: "Functional Assistant",
          link: "/Customchatbot?storeCode=aspiresys-ai-xstore",
        },
        {
          name: "FRD Generation",
          link: "",
          children: [
            {
              name: "Requirement Capture",
              link: "/RequirementCapture?storeCode=aspiresys-ai-xstore",
            },
            {
              name: "Document Generation (Bedrock)",
              link: "/DocumentGeneration?storeCode=aspiresys-ai-xstore",
            },
            {
              name: "Document Generation",
              link: "/chats?storeCode=aspiresys-ai-xstore",
            },
          ],
        },
      ],
    },
    {
      name: "Digital Commerce",
      link: "",
      children: [
        {
          name: "Composable Commerce",
          link: "",
          children: [
            {
              name: "Functional Assistant",
              link: "/Customchatbot?param=composable-commerce&storeCode=aspiresys-ai-ecommerce",
            },
          ],
        },
      ],
    },
  ];
};
