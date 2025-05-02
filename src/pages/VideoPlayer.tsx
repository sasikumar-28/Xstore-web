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

  useEffect(() => {
    if (videoUrl) {
      const embed = getEmbedUrl(videoUrl);
      setEmbedUrl(embed);
    }
  }, [videoUrl]);

  return (
    <div style={{ padding: 20 }}>
      {embedUrl ? (
        <iframe
          width="100%"
          height="500"
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
