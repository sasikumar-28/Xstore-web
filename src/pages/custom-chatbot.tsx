import React, { useState } from "react";
import { getAccessToken } from "@/utils/getAccessToken";

export default function Customchatbot() {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { query: string; response: string }[]
  >([]);
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Loading state

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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "80vh",
      }}
    >
      {/* Logo */}
      <div style={styles.logoContainer}>
        <img
          src="/logo1.webp"
          alt="Aspire Logo"
          width={60}
          height={16}
          style={styles.logo}
        />
      </div>

      {/* Chat History */}
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          overflowY: "auto",
          marginBottom: "20px",
          height: "300px",
          msOverflowY: "scroll",
        }}
      >
        {chatHistory.map((chat, index) => (
          <div key={index}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <p
                style={{
                  fontSize: "14px",
                  color: "white",
                  backgroundColor: "#804C9E",
                  borderRadius: "15px 15px 0px 15px",
                  padding: "12px",
                  margin: "10px 0",
                  maxWidth: "75%",
                }}
              >
                {chat.query}
              </p>
            </div>
            <div style={{ marginTop: "10px" }}>
              <div
                style={{
                  fontSize: "14px",
                  color: "#232323",
                  backgroundColor: "white",
                  padding: "15px",
                  borderRadius: "15px 15px 15px 0px",
                  width: "100%",
                }}
                dangerouslySetInnerHTML={{ __html: chat.response }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Input field */}
      {chatHistory.length === 0 && (
        <h1 style={styles.heading}>What can I help you with?</h1>
      )}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "600px",
          marginBottom: "70px",
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
  heading: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "50px",
  },
};
