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
          name: "Codespell Guide",
          link: "/VideoPlayer?url=https://www.youtube.com/watch?v=89CnAAg6LvY&list=PLWEj1vqQ3W4M7pIstI3t0WRZz5GBJruO0",
        },
        {
          name: "AI Code Assistant",
          link: "/VideoPlayer?url=https://www.youtube.com/watch?v=bp_IXRBBTf8&list=PLWEj1vqQ3W4PW-jjcG8-NndYFsuABRHHq",
        },
        {
          name: "Design Studio",
          link: "/VideoPlayer?url=https://www.youtube.com/watch?v=7Hfrwib4QPU&list=PLWEj1vqQ3W4PkkVzaSt5mRhBmx_u5pqUo",
        },
      ],
    },
    {
      name: "TANYA",
      link: "https://auras-react.vercel.app/?storeCode=foot",
    },
  ];
};
