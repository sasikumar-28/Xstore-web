import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

function getEmbedUrl(youtubeUrl: string): string | null {
  try {
    const url = new URL(youtubeUrl);
    const videoId = url.searchParams.get("v");
    const listId = url.searchParams.get("list");
    if (!videoId) return null;

    let embedUrl = `https://www.youtube.com/embed/${videoId}`;
    if (listId) {
      embedUrl += `?list=${listId}`;
    }

    return embedUrl;
  } catch {
    return null;
  }
}

const VideoPlayer = () => {
  const [searchParams] = useSearchParams();
  const videoUrl = searchParams.get("url");
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);
  useEffect(() => {
    if (videoUrl) {
      if (videoUrl.includes("jpg") || videoUrl.includes("png")) {
        setIsImage(true);
      } else {
        setIsImage(false);
        if (videoUrl.includes("mp4")) {
          setEmbedUrl(videoUrl);
        } else {
          const embed = getEmbedUrl(videoUrl);
          setEmbedUrl(embed);
        }
      }
    }
  }, [videoUrl]);

  return (
    <div style={{ padding: 20 }}>
      {isImage ? (
        <img src={videoUrl as string} alt="Video" />
      ) : embedUrl ? (
        <iframe
          width="300%"
          height="90%"
          src={embedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <p>Invalid or missing video URL</p>
      )}
    </div>
  );
};

export default VideoPlayer;
