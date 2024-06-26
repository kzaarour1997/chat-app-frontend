import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Fab from "@mui/material/Fab";
import SendIcon from "@mui/icons-material/Send";
import io from "socket.io-client";

const ChatSection = styled(Grid)({
  width: "100%",
  height: "80vh",
});

const BorderRight500 = styled(Grid)({
  borderRight: "1px solid #e0e0e0",
});

const MessageArea = styled(List)({
  height: "70vh",
  overflowY: "auto",
});

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const socket = io("https://72e4-194-126-140-34.ngrok-free.app"); // Adjust the URL based on your server configuration

  useEffect(() => {
    // Event listeners for socket.io events
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("connect_error", (err) => {
      console.log("Connection error:", err);
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });

    // Listen for incoming messages from the server
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const sendMessage = () => {
    // Emit a new message to the server
    socket.emit("message", inputMessage);

    // Clear the input field after sending the message
    setInputMessage("");
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" className="header-message">
            Chat
          </Typography>
        </Grid>
      </Grid>
      <ChatSection container component={Paper}>
        <BorderRight500 item xs={3}>
          {/* Users list */}
        </BorderRight500>
        <Grid item xs={9}>
          <MessageArea className="messageArea">
            {/* Display messages */}
            {messages.map((message, index) => (
              <ListItem key={index}>
                <ListItemText align="left" primary={message} />
              </ListItem>
            ))}
          </MessageArea>
          <Divider />
          <Grid container style={{ padding: "20px" }}>
            <Grid item xs={11}>
              <TextField
                id="outlined-basic-email"
                label="Type Something"
                fullWidth
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
            </Grid>
            <Grid item xs={1} align="right">
              <Fab color="primary" aria-label="add" onClick={sendMessage}>
                <SendIcon />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </ChatSection>
    </div>
  );
};

export default Chat;
