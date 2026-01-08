import { useEffect, useRef, useState } from 'react';

// Get WebSocket URL - always use current hostname at runtime
const getWebSocketUrl = () => {
  // Always use runtime hostname detection (ignores build-time env vars for hostname)
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const hostname = window.location.hostname;
  // Use port from URL if available, otherwise default to 5556
  const port = window.location.port === '5555' ? '5556' : (window.location.port || '5556');
  
  // Check if REACT_APP_WS_URL is set and valid (not empty, not just quotes, doesn't contain localhost)
  const envWsUrl = process.env.REACT_APP_WS_URL;
  if (envWsUrl && 
      envWsUrl.trim() !== '' && 
      envWsUrl !== '""' && 
      envWsUrl !== "''" &&
      !envWsUrl.includes('localhost') &&
      (envWsUrl.startsWith('ws://') || envWsUrl.startsWith('wss://'))) {
    return envWsUrl;
  }
  
  // Always construct URL from current hostname (runtime detection)
  const wsUrl = `${protocol}//${hostname}:${port}`;
  return wsUrl;
};

export function useWebSocket() {
  const [state, setState] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    
    // Get WebSocket URL dynamically at runtime
    const WS_URL = getWebSocketUrl();
    console.log('WebSocket URL:', WS_URL);
    console.log('Current location:', window.location.href);
    console.log('Hostname:', window.location.hostname);
    console.log('REACT_APP_WS_URL env:', process.env.REACT_APP_WS_URL);

    // Validate WebSocket URL before connecting
    if (!WS_URL || WS_URL.trim() === '' || WS_URL === '""' || WS_URL === "''") {
      console.error('ERROR: WebSocket URL is invalid:', WS_URL);
      return;
    }

    function connect() {
      try {
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('WebSocket connected');
          if (mounted) {
            setIsConnected(true);
          }
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            if (message.type === 'state_update' && mounted) {
              setState(message.data);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          if (mounted) {
            setIsConnected(false);
          }
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected');
          if (mounted) {
            setIsConnected(false);
            // Attempt to reconnect after 3 seconds
            reconnectTimeoutRef.current = setTimeout(() => {
              if (mounted) {
                connect();
              }
            }, 3000);
          }
        };
      } catch (error) {
        console.error('Error creating WebSocket:', error);
        if (mounted) {
          setIsConnected(false);
        }
      }
    }

    connect();

    return () => {
      mounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const sendMessage = (message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  };

  return { state, isConnected, sendMessage };
}

