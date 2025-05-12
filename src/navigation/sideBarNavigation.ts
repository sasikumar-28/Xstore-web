export const getRoute = (role = "admin") => {
  console.log(role);
  return [
    {
      name: "Xstore",
      children: [
        {
          name: "Functional Assistant",
          link: "/Customchatbot?storeCode=aspiresys-ai-sales",
        },
        {
          name: "FRD Generation",
          link: "",
          children: [
            {
              name: "Requirement Capture",
              link: "/RequirementCapture?storeCode=aspiresys-ai-sales-reqCapture",
            },
            {
              name: "Document Generation (Bedrock)",
              link: "/DocumentGeneration?storeCode=aspiresys-ai-sales-docGen",
            },
            // {
            //   name: "Document Generation",
            //   link: "/chats?storeCode=aspiresys-ai-sales",
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
    {
      name: "QA Automation",
      link: "",
      children: [
        {
          name: "Xstore UARM Demo Video",
          link: "/VideoPlayer?url=./UArm-Demo-Tap-Insert-Swipe-Actions_With Reports.mp4",
        },
        {
          name: "MFCS Item Order creation",
          link: "/VideoPlayer?url=./MFCS_Item_Order_Creation.mp4",
        },
        {
          name: "Order Creation Fulfillment",
          link: "/VideoPlayer?url=./eCom_Order_Creation_MAO_Order_Fulfillment.mp4",
        },
        {
          name: "Order Creation MAO Cancellation",
          link: "/VideoPlayer?url=./eCom_Order Creation_MAO_Order_Cancellation.mp4",
        },
        {
          name: "POS Lab Offshore",
          link: "/VideoPlayer?url=./POS LAB OFFSHORE.jpg",
        },
      ],
    },
  ];
};
