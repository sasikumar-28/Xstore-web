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
              link: "/RequirementCapture?storeCode=aspiresys-ai-xstore-reqCapture",
            },
            {
              name: "Document Generation (Bedrock)",
              link: "/DocumentGeneration?storeCode=aspiresys-ai-xstore-docGen",
            },
            // {
            //   name: "Document Generation",
            //   link: "/chats?storeCode=aspiresys-ai-xstore",
            // },
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
    {
      name: "Codespell",
      link: "",
      children: [
        {
          name: "API Generation - Design Studio",
          link: "/VideoPlayer?url=https://www.youtube.com/watch?v=7Hfrwib4QPU&ab_channel=Codespell.ai",
        },
        {
          name: "API Test Script Generation - Design Studio",
          link: "/VideoPlayer?url=https://www.youtube.com/watch?v=TnqWOYTYR8E&ab_channel=Codespell.ai",
        },
        {
          name: "Coding Assistant Demo",
          link: "/VideoPlayer?url=https://www.youtube.com/watch?v=466Ztup066M&ab_channel=Codespell.ai",
        },
        {
          name: "Figma Plugin",
          link: "/VideoPlayer?url=./Figma Plugin V3.mp4",
        },
      ],
    },
    {
      name: "TANYA",
      link: "https://test-auras-react.vercel.app/?storeCode=footlocker",
    },
  ];
};
