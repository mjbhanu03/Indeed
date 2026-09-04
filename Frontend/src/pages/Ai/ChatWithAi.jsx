import { useEffect, useRef, useState } from "react";
import { axiosClient } from "../../api/axiosClient";
import ReactMarkdown from "react-markdown"

const ChatWithAi = () => {
  const [prompt, setPrompt] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chats, loading]);

  const chatWithAi = async () => {
    if (!prompt.trim() || loading) return;
    
    const userMessage = prompt.trim();
    
    // Show user message immediately
    setChats((prev) => [
      ...prev,
      {
        type: "user",
        chat: userMessage,
      },
    ]);
    
    setPrompt("");
    setLoading(true);
    
    try {
      const response = await axiosClient.post(
        "http://localhost:5000/user/v1/ai-chat",{
            question: userMessage,
          }
      );
      
      // const data = await response.json();
      // console.log(data)
      console.log("HELo", response)
      console.log("HELo", response.data)
      setChats((prev) => [
        ...prev,
        {
          type: "admin",
          chat: response.data,
        },
      ]);
    } catch (error) {
      console.error(error.message);

      setChats((prev) => [
        ...prev,
        {
          type: "admin",
          chat: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chatWithAi();
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.aiIcon}>✦</div>

        <div>
          <h2 style={styles.title}>AI Assistant</h2>
          <div style={styles.status}>
            <span style={styles.onlineDot}></span>
            Online
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div style={styles.chatArea}>
        {chats.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.bigIcon}>✦</div>

            <h1 style={styles.welcomeTitle}>
              How can I help you?
            </h1>

            <p style={styles.welcomeText}>
              Ask me anything. I'm here to help.
            </p>
          </div>
        )}

        {chats.map((message, index) => (
          <div
            key={index}
            style={{
              ...styles.messageRow,
              justifyContent:
                message.type === "user"
                  ? "flex-end"
                  : "flex-start",
            }}
          >
            {message.type === "admin" && (
              <div style={styles.smallAiIcon}>✦</div>
            )}

            <div
              style={{
                ...styles.message,
                ...(message.type === "user"
                  ? styles.userMessage
                  : styles.aiMessage),
              }}
            >
              <ReactMarkdown>
              {typeof message.chat === "object"
                ? JSON.stringify(message.chat)
                : message.chat}
                </ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div style={styles.messageRow}>
            <div style={styles.smallAiIcon}>✦</div>

            <div style={styles.aiMessage}>
              <div style={styles.typing}>
                <span>.</span>
                <span>.</span>
                <span>typing</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={styles.inputContainer}>
        <div style={styles.inputBox}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Assistant..."
            rows={1}
            style={styles.input}
          />

          <button
            onClick={chatWithAi}
            disabled={!prompt.trim() || loading}
            style={{
              ...styles.sendButton,
              opacity:
                !prompt.trim() || loading ? 0.5 : 1,
              cursor:
                !prompt.trim() || loading
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            ↑
          </button>
        </div>

        <p style={styles.disclaimer}>
          AI can make mistakes. Check important information.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#f8fafc",
    color: "#0f172a",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  header: {
    height: "70px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 28px",
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    flexShrink: 0,
  },

  aiIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#111827",
    color: "#ffffff",
    fontSize: "20px",
  },

  title: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 600,
  },

  status: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "3px",
    fontSize: "12px",
    color: "#64748b",
  },

  onlineDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#22c55e",
  },

  chatArea: {
    flex: 1,
    overflowY: "auto",
    padding: "30px 20px",
    maxWidth: "900px",
    width: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
  },

  emptyState: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  bigIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "20px",
    background: "#111827",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    marginBottom: "20px",
  },

  welcomeTitle: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 650,
  },

  welcomeText: {
    marginTop: "10px",
    color: "#64748b",
    fontSize: "15px",
  },

  messageRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
    marginBottom: "18px",
  },

  smallAiIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "9px",
    background: "#111827",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    flexShrink: 0,
  },

  message: {
    maxWidth: "75%",
    padding: "12px 16px",
    borderRadius: "16px",
    fontSize: "14px",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },

  userMessage: {
    background: "#111827",
    color: "#ffffff",
    borderBottomRightRadius: "5px",
  },

  aiMessage: {
    background: "#ffffff",
    color: "#1e293b",
    border: "1px solid #e5e7eb",
    borderBottomLeftRadius: "5px",
  },

  typing: {
    display: "flex",
    gap: "4px",
    padding: "3px 2px",
  },

  inputContainer: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
    padding: "10px 20px 20px",
    boxSizing: "border-box",
  },

  inputBox: {
    display: "flex",
    alignItems: "flex-end",
    gap: "10px",
    background: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "16px",
    padding: "8px 8px 8px 16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
  },

  input: {
    flex: 1,
    border: "none",
    outline: "none",
    resize: "none",
    fontSize: "14px",
    lineHeight: 1.5,
    padding: "8px 0",
    background: "transparent",
    color: "#111827",
    fontFamily: "inherit",
    maxHeight: "120px",
  },

  sendButton: {
    width: "38px",
    height: "38px",
    border: "none",
    borderRadius: "11px",
    background: "#111827",
    color: "#ffffff",
    fontSize: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  disclaimer: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "11px",
    margin: "8px 0 0",
  },
};

export default ChatWithAi;
