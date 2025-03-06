import React, { useRef, useState } from "react";
import { getAccessToken } from "@/utils/getAccessToken";

export default function Customchatbot() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { query: string; response: string }[]
  >([]);
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const handleAddFileClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleRemoveFile = () => setSelectedFile(null);

  const getChatData = async () => {
    setLoading(true); // Start loading
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Failed to fetch token");

      const URL = `${
        import.meta.env.VITE_SERVER_BASE_URL
      }api/web-bff/chatStream`;
      const response = await fetch(URL, {
        signal: AbortSignal.timeout(30000),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          flowId: "3VUX9NHM6Z",
          flowAliasId: "2PGRJZR3RB",
          input: input,
        }),
      });

      if (!response.body) throw new Error("Readable stream not supported");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      setChatHistory((prev) => [...prev, { query: input, response: "" }]);
      setInput("");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data:")) {
            try {
              const parsedData = JSON.parse(line.slice(5).trim());
              const newText = parsedData.index === 0 ? parsedData.data : "";

              setCurrentResponse((prev) => prev + newText);

              setChatHistory((prev) => {
                const updatedHistory = [...prev];
                updatedHistory[updatedHistory.length - 1].response = newText;
                return updatedHistory;
              });
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        }
      }

      setCurrentResponse("");
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* Header Section */}
      <div style={styles.header}>
        <div style={{ flex: 1 }}></div>
        <div style={styles.logoContainer}>
          <img
            src="/logo1.webp"
            alt="Aspire Logo"
            width={60}
            height={16}
            style={styles.logo}
          />
        </div>
      </div>
      {/* Chat History Display */}
      <div className="w-[600px]">
        {chatHistory.map((chat, index) => (
          <div key={index}>
            <div className="flex justify-end">
              <p className="text-sm text-[white] bg-[#804C9E] rounded-l-xl p-3 m-3 mb-4 rounded-br-xl inline-block max-w-[75%]">
                {chat.query}
              </p>
            </div>
            <div className="mt-4">
              <div
                className="text-sm text-[#232323] bg-[#FFFFFF] px-7 py-4 rounded-r-xl rounded-bl-2xl w-full"
                dangerouslySetInnerHTML={{ __html: chat.response }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section with Textarea and Button */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "600px",
          marginBottom: "100px",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything"
          style={styles.inputField}
        />
        <button
          onClick={getChatData}
          style={styles.submitButton}
          disabled={loading}
        >
          {loading ? <span style={styles.loader} /> : "➤"}
        </button>
      </div>
    </div>
  );
}

// Styles Object
const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: "900px",
    padding: "2px",
    alignItems: "center",
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    marginRight: "400px",
    marginBottom: "1px",
  },
  inputField: {
    width: "100%",
    padding: "14px",
    border: "1px solid #ddd",
    borderRadius: "25px",
    outline: "none",
    fontSize: "14px",
    paddingRight: "50px", // Space for the button inside input
  },
  submitButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "purple",
    color: "white",
    padding: "8px 15px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "36px",
    width: "36px",
  },
  loader: {
    width: "18px",
    height: "18px",
    border: "3px solid white",
    borderTopColor: "transparent",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 1s linear infinite",
  },
};
