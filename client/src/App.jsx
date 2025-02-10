import React, { useEffect, useMemo, useState, useRef } from 'react';
import io from 'socket.io-client';
import {
  Container, Typography, Button, TextField, Stack, 
  Box, Paper, AppBar, Toolbar, 
  Card, CardContent, createTheme, ThemeProvider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7e57c2', // Deep Purple
      light: '#9c27b0', // Vibrant Purple
      dark: '#4a148c'  // Dark Purple
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e'
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#9e9e9e'
    }
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(126, 87, 194, 0.1)',
          }
        }
      }
    }
  }
});

const App = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [RoomID, setRoomID] = useState('');
  const [socketID, setSocketID] = useState('');
  const [roomName, setRoomName] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:3000');

    socketRef.current.on('connect', () => {
      console.log('connected to server', socketRef.current.id);
      setSocketID(socketRef.current.id);
    });

    socketRef.current.on('receive-message', ({ message, RoomID }) => {
      setMessages((prevmessages) => [...prevmessages, message]);
      console.log(message);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    socketRef.current.emit('message', { message, RoomID });
    setMessage('');
  };

  const joinRoomhandler = (e) => {
    e.preventDefault();
    socketRef.current.emit('join-room', roomName);
    setRoomName('');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        bgcolor: 'background.default',
        color: 'text.primary'
      }}>
        <AppBar position="static" sx={{ 
          bgcolor: 'primary.dark', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.2)' 
        }}>
          <Toolbar>
            <ChatBubbleOutlineIcon sx={{ mr: 2, color: 'primary.light' }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Prattgram
            </Typography>
            <Typography variant="body2" color="inherit" sx={{ 
              opacity: 0.7, 
              bgcolor: 'rgba(126, 87, 194, 0.2)', 
              px: 1, 
              py: 0.5, 
              borderRadius: 2 
            }}>
              {socketID}
            </Typography>
          </Toolbar>
        </AppBar>

        <Container sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          pt: 3, 
          pb: 3 
        }}>
          <Card sx={{ 
            maxWidth: 600, 
            width: '100%', 
            margin: 'auto', 
            bgcolor: 'background.paper',
            borderRadius: 4,
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
          }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2 
              }}>
                <Paper variant="outlined" sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(126, 87, 194, 0.05)', 
                  borderColor: 'primary.main' 
                }}>
                  <Typography variant="h6" gutterBottom color="primary.light">
                    Join a Room
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2 
                  }}>
                    <TextField
                      fullWidth
                      label="Room Name"
                      variant="outlined"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                    />
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={joinRoomhandler}
                      sx={{ borderRadius: 2 }}
                    >
                      Join
                    </Button>
                  </Box>
                </Paper>

                <Paper variant="outlined" sx={{ 
                  maxHeight: 300, 
                  overflowY: 'auto', 
                  p: 2,
                  bgcolor: 'rgba(0,0,0,0.2)',
                  borderColor: 'primary.dark'
                }}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Current Room: {RoomID || 'Not Selected'}
                  </Typography>
                  <Stack spacing={1}>
                    {messages.map((m, i) => (
                      <Typography 
                        key={i} 
                        variant="body1" 
                        sx={{
                          bgcolor: 'rgba(126, 87, 194, 0.2)',
                          p: 1,
                          borderRadius: 2,
                          color: 'text.primary'
                        }}
                      >
                        {m}
                      </Typography>
                    ))}
                  </Stack>
                </Paper>

                <Box 
                  component="form" 
                  onSubmit={handleSubmit} 
                  sx={{ 
                    display: 'flex', 
                    gap: 2 
                  }}
                >
                  <TextField
                    fullWidth
                    label="Message"
                    variant="outlined"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <TextField
                    label="Room ID"
                    variant="outlined"
                    value={RoomID}
                    onChange={(e) => setRoomID(e.target.value)}
                  />
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    endIcon={<SendIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Send
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;