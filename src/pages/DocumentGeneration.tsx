"use client";

import { Button } from "@/components/ui/button";
import botChatLogo from "@/assets/chat-page-image/bot-chat-logo.png";
import sendButtonIcon from "@/assets/chat-page-image/send-button-icon.png";
import chatPageRobot from "@/assets/chat-page-image/bot-chat-logo.png";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { Paperclip } from "lucide-react";
import { getDocumentGenerationBedRock } from "@/server/gen-ai";
import { getAccessToken } from "@/utils/getAccessToken";
import { useSearchParams, useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";

const formatStringToHtml = (str: string) => {
  return str
    .split("\n")
    .map((line, index) => {
      // Handle numbered points with decimals (e.g., 1.1, 2.3)
      const numberedPointWithDecimal = line.match(/^(\d+\.\d+)\s(.+)/);
      if (numberedPointWithDecimal) {
        return `<p key=${index} class="mb-2 ml-6"><strong>${numberedPointWithDecimal[1]}</strong> ${numberedPointWithDecimal[2]}</p>`;
      }

      // Handle regular numbered points (e.g., 1., 2.)
      const numberedPoint = line.match(/^(\d+)\.\s(.+)/);
      if (numberedPoint) {
        return `<p key=${index} class="mb-2"><strong>${numberedPoint[1]}.</strong> ${numberedPoint[2]}</p>`;
      }

      // Handle bullet points
      if (line.trim().startsWith("-")) {
        return `<p key=${index} class="mb-2 ml-6">• ${line
          .trim()
          .substring(1)}</p>`;
      }

      // Handle headers (lines without numbers or bullets but with content)
      if (line.trim() && !line.trim().startsWith("-") && !line.match(/^\d/)) {
        return `<p key=${index} class="mb-4 font-semibold">${line}</p>`;
      }

      // Handle empty lines
      return line.trim() ? `<p key=${index} class="mb-2">${line}</p>` : "<br/>";
    })
    .join("");
};

type FormValues = {
  query: string;
};

export default function DocumentGeneration() {
  const {
    register,
    handleSubmit,
    watch,
    // setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string>(``);
  const [key, setKey] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const storeCode = searchParams.get("storeCode") || "aspiresys-ai-sales";

  useEffect(() => {
    const customerId = localStorage.getItem("customerId");
    if (!customerId) {
      navigate("/login");
    }
  }, []);

  const { toast } = useToast();

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event, "file");
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null); // Clear the selected file
    setKey((p) => p + 1);
  };

  const onSubmit = async (data: FormValues) => {
    if (!selectedFile || !data.query) return;
    if (isLoading) return;

    setIsLoading(true);
    // setError(null);
    setResponse("");

    try {
      const res = await getDocumentGenerationBedRock(
        selectedFile,
        data.query,
        storeCode,
        localStorage.getItem("customerId") || ""
      );
      console.log(res);
      if (res && res.jobId) {
        setJobId(res.jobId);
      } else {
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to process request. Please try again.",
          variant: "destructive",
        });
      }
      return;
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log("Error:", errorMessage);
      setIsLoading(false);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

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
      if (response.status === "completed") {
        setResponse(response.data?.outputEvents?.["Event 1"]?.content);
        reset(); // Clear form only on success
        setSelectedFile(null);
        setKey((p) => p + 1);
        setJobId(null);
        setIsLoading(false);
      }
      if (response.status === "failed") {
        setResponse("Error processing content");
        reset(); // Clear form only on success
        setSelectedFile(null);
        setKey((p) => p + 1);
        setJobId(null);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching chat status:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(() => {
      getStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${
      sizes[i]
    }`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] w-full">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl flex flex-col items-center mx-auto p-4">
          <div className="flex items-center w-full justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center">
                <img
                  src={botChatLogo}
                  alt="AI Assistant Avatar"
                  width={65}
                  height={65}
                  className="rounded-full"
                />
              </div>
              <p className="text-[#232323] bg-[#FFFFFF] drop-shadow-[0_3px_6px_#00000029] px-7 py-3 text-sm rounded-r-xl rounded-bl-2xl">
                Enter your requirements and attach the transcript to generate
                the document
              </p>
              <input
                name="file"
                type="file"
                id="fileInput"
                className="hidden"
                accept=".txt, .csv"
                onChange={onFileChange}
                key={key}
              />
            </div>
          </div>

          {isLoading && (
            <div className="ml-20 animate-spin rounded-full h-6 w-6 border-b-2 border-purple-700" />
          )}

          {response && (
            <div
              className="prose prose-sm max-w-none text-sm text-[#232323] bg-[#FFFFFF] drop-shadow-[0_3px_6px_#00000029] ml-20 mb-24 px-7 py-4 text-[12px] rounded-r-xl rounded-bl-2xl"
              dangerouslySetInnerHTML={{
                __html: formatStringToHtml(response.replace(/\\n/g, "\n")),
              }}
            />
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="flex flex-col items-center"
          >
            {/* Chat Input */}
            <div className="absolute bottom-8 w-1/2 rounded-full drop-shadow-lg border bg-[#FFFFFF]">
              <div className="container mx-auto max-w-4xl px-5">
                {selectedFile && (
                  <div className="flex flex-wrap gap-2 mb-1 items-center px-7 py-1 w-10/12 rounded-full drop-shadow-lg">
                    <div className="flex flex-col">
                      <span className="text-sm text-ellipsis max-w-[200px] truncate">
                        {selectedFile.name}
                      </span>
                      <span className="text-xs ">
                        {formatFileSize(selectedFile.size)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="flex gap-2">
                  <textarea
                    placeholder={
                      errors.query
                        ? errors.query.message
                        : `Type your question here...`
                    }
                    className={`w-full px-7 pt-5 rounded-full drop-shadow-lg bg-transparent outline-none ${
                      errors.query ? "placeholder-red-500" : ""
                    }`}
                    {...register("query", { required: "Question is required" })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSubmit(onSubmit)();
                      }
                    }}
                  />

                  {/* File selection */}
                  <Button
                    className="absolute right-16 top-1/2 -translate-y-1/2 font-normal rounded-full bg-[#804C9E] hover:bg-[#804C9E] text-white"
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                    type="button"
                  >
                    <Paperclip />
                  </Button>
                  <button
                    type="submit"
                    className={`absolute right-6 top-1/2 -translate-y-1/2 transition-all duration-200 ${
                      !selectedFile ||
                      typeof watch("query") === "undefined" ||
                      isLoading
                        ? "opacity-60"
                        : ""
                    }`}
                    disabled={
                      !selectedFile ||
                      typeof watch("query") === "undefined" ||
                      isLoading
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit(onSubmit)();
                    }}
                    style={{
                      cursor:
                        !selectedFile ||
                        typeof watch("query") === "undefined" ||
                        isLoading
                          ? "not-allowed"
                          : "pointer",
                      filter:
                        !selectedFile ||
                        typeof watch("query") === "undefined" ||
                        isLoading
                          ? "grayscale(80%)"
                          : "none",
                    }}
                  >
                    <img src={sendButtonIcon} width={30} alt="Send" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bot Image */}
            <div className="fixed bottom-24 -right-7 pointer-events-none">
              <img
                src={chatPageRobot}
                alt="Decorative Robot"
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
