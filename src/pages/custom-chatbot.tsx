import React, { useEffect, useRef, useState } from "react";
import { getAccessToken } from "@/utils/getAccessToken";
import { Icon } from "@iconify/react";
import { useSearchParams } from "react-router";
import { useAppSelector } from "@/redux/hooks";
import {
  selectCustomerId,
  selectIsCustomerIdSelected,
} from "@/redux/slices/userSlice";
import { useToast } from "@/hooks/use-toast";

const formatStringToHtml = (str: string) => {
  return str.split("\\n").map((line, index) => {
    const numberedPoint = line.match(/^(\d+)\.\s(.+)/);
    if (numberedPoint) {
      return (
        <p key={index} className="mb-2">
          <strong>{numberedPoint[1]}.</strong> {numberedPoint[2]}
        </p>
      );
    }
    return line.trim() ? (
      <p key={index} className="mb-2">
        {line}
      </p>
    ) : (
      <br />
    );
  });
  // .join("");
};

export default function Customchatbot() {
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { query: string; response: string }[]
  >([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const param = searchParams.get("param");
  const storeCode = searchParams.get("storeCode") || "aspiresys-ai-xstore";
  const selectedEmail = useAppSelector(selectCustomerId);
  const isEmailSelected = useAppSelector(selectIsCustomerIdSelected);
  const { toast } = useToast();

  const fetchWithToken = async (url: string, options = {}) => {
    const token = await getAccessToken();
    if (!token) throw new Error("Failed to fetch token");
    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        // ...(options.headers || {}),
      },
    }).then((res) => res.json());
  };

  const suggestions = [
    "What is Auras?",
    "What is Composable Commerce?",
    "How To migrate to Composable Commerce?",
  ];

  useEffect(() => {
    setChatHistory([]);
    setInput("");
    setJobId(null);
    setLoading(false);
  }, [param, storeCode]);

  const getChatData = async () => {
    if (!input.trim()) return;
    if (!isEmailSelected) {
      toast({
        title: "Name Required",
        description: "Please select a name before submitting",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const flowId =
        param === "composable-commerce" ? "IS00QDXMCO" : "3VUX9NHM6Z";
      const flowAliasId =
        param === "composable-commerce" ? "A9BPVK1C3R" : "2PGRJZR3RB";
      const response = await fetchWithToken(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/web-bff/chatStream`,
        {
          method: "POST",
          body: JSON.stringify({
            flowId,
            flowAliasId,
            input: {
              input: input.trim(),
              storeCode: storeCode,
            },
            customerId: selectedEmail,
          }),
        }
      );

      if (response.jobId) {
        setJobId(response.jobId);
        setChatHistory((prev) => [...prev, { query: input, response: "" }]);
        setInput("");
      } else {
        throw new Error("Invalid job ID received");
      }
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      setLoading(false);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatus = async () => {
    if (!jobId) return;

    try {
      const response = await fetchWithToken(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/web-bff/chatStream/${jobId}`
      );

      if (response.status === "completed") {
        console.log(
          formatStringToHtml(response.data?.outputEvents?.["Event 1"]?.content),
          "the job id"
        );
        setChatHistory((prev) =>
          prev.map((chat, index) =>
            index === prev.length - 1
              ? {
                  ...chat,
                  response:
                    response.data?.outputEvents?.["Event 1"]?.content ||
                    "No response",
                }
              : chat
          )
        );
        setJobId(null);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching chat status:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(() => {
      getStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="flex justify-center w-full">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: chatHistory.length > 0 ? "space-between" : "center",
          // minHeight: "80vh",
        }}
        className="flex h-5/6 w-5/6"
      >
        {/* Logo */}
        {chatHistory.length == 0 && (
          <div style={styles.logoContainer}>
            <img
              src="/logo1.webp"
              alt="Aspire Logo"
              width={60}
              height={16}
              style={styles.logo}
            />
          </div>
        )}

        {/* Chat History */}
        {chatHistory.length > 0 && (
          <div
            ref={chatContainerRef}
            style={{
              width: "100%",
              overflowY: "auto",
              marginBottom: "20px",
              height: "100%",
              msOverflowY: "scroll",
              scrollBehavior: "smooth",
              padding: "20px",
            }}
          >
            <div style={styles.logoContainer}>
              <img
                src="/logo1.webp"
                alt="Aspire Logo"
                width={60}
                height={16}
                style={styles.logo}
              />
            </div>
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
                      // dangerouslySetInnerHTML={{
                      // __html: formatStringToHtml(chat?.response),
                      // }}
                    >
                      {formatStringToHtml(chat.response)}
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
            marginBottom: "5px",
          }}
          className="max-w-[700px]"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything"
            style={styles.inputField}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                getChatData();
              }
            }}
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
                style={{
                  ...styles.submitButton,
                  backgroundColor:
                    loading || !isEmailSelected ? "#cccccc" : "purple",
                  cursor:
                    loading || !isEmailSelected ? "not-allowed" : "pointer",
                  opacity: loading || !isEmailSelected ? 0.6 : 1,
                }}
                disabled={loading || !isEmailSelected}
                title={!isEmailSelected ? "Please select a name first" : "Send"}
              >
                ➤
              </button>
            )}
          </div>
          <div className="flex flex-wrap absolute gap-2 mt-2">
            {param === "composable-commerce" &&
              suggestions.map((s, i) => (
                <div
                  key={i}
                  className="p-2 rounded-full text-sm ring-2 ring-[#804C9E] bg-[#804C9E0D] cursor-pointer"
                  onClick={() => setInput(s)}
                >
                  {s}
                </div>
              ))}
          </div>
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
    transition: "all 0.2s ease",
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
