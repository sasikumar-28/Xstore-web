/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { getAccessToken } from "@/utils/getAccessToken";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getRequirementCapture } from "@/server/gen-ai";
import { Icon } from "@iconify/react/dist/iconify.js";

export const formatStringToHtml = (str: string) => {
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

export default function RequirementCapture() {
  const [input, setInput] = useState<File | null>(null);
  const [chatHistory, setChatHistory] = useState<
    { query: string; response: string }[]
  >([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [key, setKey] = useState(0);

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

  const getStatus = async () => {
    if (!jobId) return;

    try {
      const response = await fetchWithToken(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/api/web-bff/chatStream/${jobId}`
      );
      console.log("first");
      if (response.status === "completed") {
        console.log("second");

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
        setInput(null);
        setKey((p) => p + 1);
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

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    console.log(file.name, "the file");
    if (file) setInput(file);
  };

  const handleFileUpload = () => {
    if (!input) return;
    setLoading(true);
    getRequirementCapture(input)
      .then((res) => {
        setJobId(res.jobId);
        setChatHistory((prev) => [
          ...prev,
          { query: input.name, response: "" },
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: chatHistory.length > 0 ? "space-between" : "center",
        width: "100vw",
        // minHeight: "80vh",
        height: "70%",
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
                    // dangerouslySetInnerHTML={{
                    //   __html: formatStringToHtml(chat?.response),
                    // }}
                  >
                    {chat.response}
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
      <Card className="w-full max-w-md mx-auto shadow-md rounded-full">
        <CardContent className="p-4">
          <div className="relative flex items-center w-full gap-2">
            <div className="relative w-full">
              <Input
                type="file"
                onChange={(e) => handleFileChange(e)}
                placeholder="Ask me anything"
                className="pr-10  focus:border-purple-500 h-12 rounded-lg w-full rounded-full"
                style={{ border: "1px dashed gray" }}
                accept=".txt, .csv"
                id="fileInput"
                key={key}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleFileUpload();
                  }
                }}
              />
            </div>

            {loading ? (
              <Icon
                icon="line-md:loading-loop"
                width="40"
                height="40"
                color="#804C9E"
              />
            ) : (
              <Button
                onClick={() => handleFileUpload()}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white h-12 w-12 rounded-lg flex items-center justify-center rounded-full"
              >
                ➤
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
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
