const API_URL =
  "https://appointment-booking-app-3u1r.onrender.com/api/ai";

export const getHealthGuidance = async (
  message,
  onChunk
) => {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message
    })
  });

  if (!response.ok) {
    let errorMessage =
      "Unable to get AI health guidance.";

    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorMessage;
    } catch {
      // Ignore parsing error
    }

    throw new Error(errorMessage);
  }

  if (!response.body) {
    throw new Error("Streaming is not supported.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    const chunk = decoder.decode(value, {
      stream: true
    });

    onChunk(chunk);
  }
};