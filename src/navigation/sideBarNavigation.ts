export const getRoute = (role = "admin") => {
  console.log(role);
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
              name: "Document Generation (Bedrock)",
              link: "/DocumentGeneration",
            },
            {
              name: "Document Generation",
              link: "/chats",
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
                  link: "/RequirementCapture",
                },
              ],
            },
          ],
        },
      ],
    },
  ];
};
