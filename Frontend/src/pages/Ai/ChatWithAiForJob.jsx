import { useEffect, useRef, useState } from "react";
import { axiosClient } from "../../api/axiosClient";
import ReactMarkdown from "react-markdown";
import { useUserProfile } from "../../hooks/user/userUser";

import "./ChatWithAi.css";
import { useLocation } from "react-router-dom";

const ChatWithAiForJob = () => {
  const location = useLocation()
  const jobId = location.state?.jobId
  const [prompt, setPrompt] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { data: userProfileData } = useUserProfile();
  // const [previousInteractionID, setPreviousInteractionID] = useState(null)
  const [error, setError] = useState(false)
  useEffect(()=>{
    fetchChat()
  }, [])
  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chats, loading]);
  const fetchChat = async () =>{
    const chats = await axiosClient.get(`http://localhost:5000/jobs/v1/chats/${jobId}`)
    // if(chats.status !== 200) setError(chats.message)
      console.log("chats", chats.data.data)
      
    setChats(chats.data.data)
  }
  const chatWithAi = async () => {
    if (!prompt.trim() || loading) return;
    setError(false)
    const userMessage = prompt.trim();

    // Show user message immediately
    if(!chats) setChats([{user_type: "user", message: userMessage}])
    else setChats((prev) => [
      ...prev,
      {
        user_type: "user", 
        message: userMessage,
      },
    ]);

    setPrompt("");
    setLoading(true);

    try {
      const response = await axiosClient.post(
        "http://localhost:5000/jobs/v1/ai-chat",
        { 
          job_id: jobId,
          question: userMessage,
        },
      );
      await fetchChat()
      // setPreviousInteractionID(response.data.id)
      // setChats((prev) => [
      //   ...prev,
      //   {
      //     type: "admin",
      //     chat: response.data.message,
      //   },
      // ]);
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
    <div className="ai-container">
      {/* Header */}
      <div className="header">
        <div className="aiIcon">✦</div>
        <div>
          <h2 className="title">AI Assistant</h2>
          <div className="status">
            <span className="onlineDot"></span>
            Online
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="chatArea">
        {!chats && (
          <div className="emptyState">
            <div className="bigIcon">✦</div>

            <h1 className="welcomeTitle">How can I help you?</h1>

            <p className="welcomeText">Ask me anything. I'm here to help.</p>
          </div>
        )}

        {chats && chats.map((chat, index) => (
          <div
            key={index}
            className="messageRow"
            style={{
              justifyContent:
                chat.user_type === "user" ? "flex-end" : "flex-start",
            }}
            
          >
            {chat.user_type === "admin" && 
            (
              <div className="smallAiIcon">✦</div>
            )}
            
            <div
              className={`
                message
                ${(chat.user_type === "user"
                  ? "userMessage"
                  : "aiMessage")}
              `}
              style={{
                color: error ? "red" : undefined
              }}
              >

              <ReactMarkdown>
                {typeof chat.message === "object"
                  ? JSON.stringify(chat.message)
                  : chat.message}
              </ReactMarkdown>



            </div>
                  {chat.user_type === "user" && (
                    <div className="smallUserIcon">{userProfileData.data.full_name[0]}</div>
                  )}
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="messageRow">
            <div className="smallAiIcon">✦</div>

            <div className="aiMessage">
              <div className="typing">
                <span>.</span>
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
      <div className="inputContainer">
        <div className="inputBox">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Assistant..."
            rows={1}
            className="input"
          />

          <button
            onClick={chatWithAi}
            disabled={!prompt.trim() || loading}
            className="sendButton"
          >
            ↑
          </button>
        </div>

        <p className="disclaimer">
          AI can make mistakes. Check important information.
        </p>
      </div>
    </div>
  );
};

export default ChatWithAiForJob;
