import React, { useEffect, useRef, useState } from "react";
import { getAccessToken } from "@/utils/getAccessToken";
import { Icon } from "@iconify/react";

const formatStringToHtml = (str: string) => {
  return str
    .split("\\n")
    .map((line, index) => {
      const numberedPoint = line.match(/^(\d+)\.\s(.+)/);
      if (numberedPoint) {
        return `<p key=${index} class="mb-2"><strong>${numberedPoint[1]}.</strong> ${numberedPoint[2]}</p>`;
      }
      return line.trim() ? `<p key=${index} class="mb-2">${line}</p>` : "<br/>";
    })
    .join("");
};

export default function Customchatbot() {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { query: string; response: string }[]
  >([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [jobId, setJobId] = useState<string>("");

  const getChatData = async () => {
    setLoading(true); // Start loading
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Failed to fetch token");

      const URL = `${
        import.meta.env.VITE_SERVER_BASE_URL
      }/api/web-bff/chatStream`;
      const response = await fetch(URL, {
        signal: AbortSignal.timeout(60000),
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
      }).then((res) => res.json());
      setJobId(response.jobId);
      setChatHistory((prev) => [...prev, { query: input, response: "" }]);
      setInput("");
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
    }
  };

  const getStatus = async () => {
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Failed to fetch token");

      const URL = `${
        import.meta.env.VITE_SERVER_BASE_URL
      }/api/web-bff/chatStream/${jobId}`;
      const response = await fetch(URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json());
      if (response.status === "completed") {
        setJobId("");
        setLoading(false);
        setChatHistory((prevChatHistory) => {
          const updatedChatHistory = [...prevChatHistory];
          updatedChatHistory[prevChatHistory.length] = {
            ...updatedChatHistory[prevChatHistory.length],
            response: response.data.outputEvents["Event 1"].content,
          };
          return updatedChatHistory;
        });
      }
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      getStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: chatHistory.length > 0 ? "space-between" : "center",
        width: "100vw",
        // minHeight: "80vh",
        height: "65%",
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
      {chatHistory.length > 0 && (
        <div
          ref={chatContainerRef}
          style={{
            width: "100%",
            maxWidth: "600px",
            overflowY: "auto",
            marginBottom: "20px",
            height: "100%",
            msOverflowY: "scroll",
            scrollBehavior: "smooth",
            padding: "20px",
          }}
        >
          {chatHistory.map((chat, index) => (
            <div key={index}>
              {chat.query && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "15px",
                  }}
                >
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
              )}
              {chat.response && (
                <div style={{ marginTop: "10px" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#232323",
                      backgroundColor: "white",
                      padding: "15px",
                      borderRadius: "15px 15px 15px 0px",
                      width: "100%",
                      lineHeight: "1.5",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: formatStringToHtml(chat?.response),
                    }}
                  >
                    {/* {chat.response} */}
                  </div>
                  <div className="w-full h-[1px] mt-2 bg-slate-300"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input field */}
      {chatHistory.length === 0 && (
        <h1 style={styles.heading}>What can I help you with?</h1>
      )}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "600px",
          marginBottom: "5px",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything"
          style={styles.inputField}
        />
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pr-2">
          {loading ? (
            <Icon
              icon="line-md:loading-loop"
              width="40"
              height="40"
              color="#804C9E"
            />
          ) : (
            <button
              onClick={getChatData}
              style={styles.submitButton}
              disabled={loading}
            >
              ➤
            </button>
          )}
        </div>
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
  chatMessage: {
    marginBottom: "12px",
    lineHeight: "1.5",
  },
  paragraph: {
    marginBottom: "8px",
  },
};
