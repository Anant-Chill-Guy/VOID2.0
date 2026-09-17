import React, { useState, useEffect, useRef } from "react";
import fileService from "./../store/fileService";
import Navbar from "./../components/navbar";
import "./../index.css";

function TerminalComponent() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(null);
  const [authPhase, setAuthPhase] = useState(null); // null | "prompt"
  const [currentPath, setCurrentPath] = useState("/home/guest");
  const [user, setUser] = useState({ username: "guest" });
  const [isMatrixMode, setIsMatrixMode] = useState(false);
  const [isAquariumMode, setIsAquariumMode] = useState(false);
  const terminalRef = useRef(null);
  const matrixRef = useRef(null);
  const aquariumRef = useRef(null);

  useEffect(() => {
    // Set default user and initialize home directory
    setUser({ username: "guest" });
    fileService.createDirectory('/home', 'guest');
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Matrix effect functions
  const startMatrix = () => {
    if (!matrixRef.current) return;
    
    const canvas = matrixRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }
    
    const draw = () => {
      // Black background with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Green text
      ctx.fillStyle = '#00ff00';
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Reset drop to top randomly or when it reaches bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    
    const matrixInterval = setInterval(draw, 50);
    
    // Store interval for cleanup
    canvas.matrixInterval = matrixInterval;
  };
  
  const stopMatrix = () => {
    setIsMatrixMode(false);
    if (matrixRef.current && matrixRef.current.matrixInterval) {
      clearInterval(matrixRef.current.matrixInterval);
    }
  };

  // Aquarium effect functions
  const startAquarium = () => {
    if (!aquariumRef.current) return;
    
    const canvas = aquariumRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const fish = [];
    const bubbles = [];
    const seaweed = [];
    
    // Fish types with different ASCII art
    const fishTypes = [
      { art: '><(((*>', color: '#FFD700', size: 12 },
      { art: '<*)))><', color: '#FF6B6B', size: 12 },
      { art: '><(((°>', color: '#4ECDC4', size: 10 },
      { art: '°>><', color: '#45B7D1', size: 8 },
      { art: '><)))*>', color: '#96CEB4', size: 11 },
      { art: '~><(((º>', color: '#FFEAA7', size: 13 }
    ];
    
    // Initialize fish
    for (let i = 0; i < 8; i++) {
      const fishType = fishTypes[Math.floor(Math.random() * fishTypes.length)];
      fish.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height - 200) + 100,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 0.5,
        ...fishType
      });
    }
    
    // Initialize bubbles
    for (let i = 0; i < 15; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: canvas.height,
        vy: -Math.random() * 2 - 1,
        size: Math.random() * 3 + 1
      });
    }
    
    // Initialize seaweed
    for (let i = 0; i < 6; i++) {
      const x = Math.random() * canvas.width;
      const height = Math.random() * 100 + 80;
      seaweed.push({ x, height, sway: 0 });
    }
    
    const draw = () => {
      // Deep blue background
      ctx.fillStyle = '#001122';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw seaweed
      seaweed.forEach(weed => {
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 3;
        ctx.beginPath();
        weed.sway += 0.02;
        ctx.moveTo(weed.x, canvas.height);
        for (let i = 0; i < weed.height; i += 10) {
          const x = weed.x + Math.sin(weed.sway + i * 0.1) * (10 - i * 0.05);
          ctx.lineTo(x, canvas.height - i);
        }
        ctx.stroke();
      });
      
      // Draw sand/bottom
      ctx.fillStyle = '#8D6E63';
      ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
      
      // Draw fish
      fish.forEach(f => {
        f.x += f.vx;
        f.y += f.vy;
        
        // Boundary collision
        if (f.x < -50 || f.x > canvas.width + 50) f.vx *= -1;
        if (f.y < 50 || f.y > canvas.height - 80) f.vy *= -1;
        
        // Random direction changes
        if (Math.random() < 0.01) {
          f.vx += (Math.random() - 0.5) * 0.5;
          f.vy += (Math.random() - 0.5) * 0.2;
        }
        
        ctx.fillStyle = f.color;
        ctx.font = f.size + 'px monospace';
        ctx.fillText(f.art, f.x, f.y);
      });
      
      // Draw bubbles
      bubbles.forEach(bubble => {
        bubble.y += bubble.vy;
        bubble.x += Math.sin(bubble.y * 0.01) * 0.5;
        
        if (bubble.y < -10) {
          bubble.y = canvas.height;
          bubble.x = Math.random() * canvas.width;
        }
        
        ctx.fillStyle = 'rgba(135, 206, 235, 0.6)';
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw water effect lines
      for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = `rgba(64, 196, 255, ${0.1 + Math.sin(Date.now() * 0.001 + i) * 0.05})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 50 + i * 40);
        ctx.lineTo(canvas.width, 50 + i * 40);
        ctx.stroke();
      }
    };
    
    const aquariumInterval = setInterval(draw, 50);
    canvas.aquariumInterval = aquariumInterval;
  };
  
  const stopAquarium = () => {
    setIsAquariumMode(false);
    if (aquariumRef.current && aquariumRef.current.aquariumInterval) {
      clearInterval(aquariumRef.current.aquariumInterval);
    }
  };
  
  // Handle ESC key to exit matrix or aquarium
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        if (isMatrixMode) {
          stopMatrix();
          setHistory(prev => [...prev, { prompt: getPrompt(), command: 'cmatrix', output: 'Matrix mode exited.' }]);
        } else if (isAquariumMode) {
          stopAquarium();
          setHistory(prev => [...prev, { prompt: getPrompt(), command: 'asciiquarium', output: 'Aquarium closed.' }]);
        }
      }
    };
    
    if (isMatrixMode || isAquariumMode) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isMatrixMode, isAquariumMode]);

  const getPrompt = () => {
    if (!user) return "guest@kali:~$ ";
    const pathDisplay = currentPath === `/home/${user.username}` ? "~" : currentPath;
    return `${user.username}@kali:${pathDisplay}$ `;
  };

  const handleCommand = async (command) => {
    const parts = command.trim().split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output = "";

    switch (cmd) {
      case "help":
        output = `Available commands:
  ls [directory]     - List directory contents
  cd [directory]     - Change directory
  pwd                - Print working directory
  mkdir <name>       - Create directory
  rmdir <name>       - Remove directory
  touch <name>       - Create file
  cat <file>         - Display file contents
  nano <file>        - Edit file (simplified)
  echo <text>        - Display text
  whoami             - Display current user
  date               - Display current date
  clear              - Clear terminal
  cmatrix            - Matrix digital rain (press ESC to exit)
  asciiquarium       - ASCII aquarium with fish (press ESC to exit)
  exit               - Exit terminal`;
        break;

      case "ls":
        const lsPath = args[0] ? args[0] : currentPath;
        const lsResult = fileService.listDirectory(lsPath);
        if (lsResult.success) {
          if (lsResult.contents.length === 0) {
            output = "";
          } else {
            output = lsResult.contents.map(item => {
              const type = item.type === 'directory' ? 'd' : '-';
              const permissions = 'rwxr-xr-x';
              const size = item.size || 0;
              const date = new Date().toLocaleDateString();
              return `${type}${permissions} 1 ${user.username} ${user.username} ${size} ${date} ${item.name}`;
            }).join('\n');
          }
        } else {
          output = `ls: cannot access '${lsPath}': ${lsResult.message}`;
        }
        break;

      case "cd":
        const cdPath = args[0] || '/';
        let targetPath = cdPath;
        
        if (cdPath === '~' || cdPath === '') {
          targetPath = `/home/${user.username}`;
        } else if (cdPath === '..') {
          const pathParts = currentPath.split('/').filter(p => p);
          pathParts.pop();
          targetPath = '/' + pathParts.join('/') || '/';
        } else if (!cdPath.startsWith('/')) {
          targetPath = currentPath === '/' ? `/${cdPath}` : `${currentPath}/${cdPath}`;
        }

        const cdResult = fileService.changeDirectory(targetPath);
        if (cdResult.success) {
          setCurrentPath(cdResult.path);
          output = "";
        } else {
          output = `cd: ${cdResult.message}`;
        }
        break;

      case "pwd":
        output = currentPath;
        break;

      case "mkdir":
        if (args.length === 0) {
          output = "mkdir: missing operand";
        } else {
          const mkdirResult = fileService.createDirectory(currentPath, args[0]);
          output = mkdirResult.success ? "" : `mkdir: ${mkdirResult.message}`;
        }
        break;

      case "rmdir":
        if (args.length === 0) {
          output = "rmdir: missing operand";
        } else {
          const rmdirResult = fileService.removeDirectory(currentPath, args[0]);
          output = rmdirResult.success ? "" : `rmdir: ${rmdirResult.message}`;
        }
        break;

      case "touch":
        if (args.length === 0) {
          output = "touch: missing file operand";
        } else {
          const touchResult = fileService.createFile(currentPath, args[0], "");
          output = touchResult.success ? "" : `touch: ${touchResult.message}`;
        }
        break;

      case "cat":
        if (args.length === 0) {
          output = "cat: missing file operand";
        } else {
          const catResult = fileService.readFile(currentPath, args[0]);
          output = catResult.success ? catResult.content : `cat: ${catResult.message}`;
        }
        break;

      case "nano":
        if (args.length === 0) {
          output = "nano: missing file operand";
        } else {
          const fileName = args[0];
          const content = prompt(`Enter content for ${fileName}:`);
          if (content !== null) {
            const nanoResult = fileService.writeFile(currentPath, fileName, content);
            output = nanoResult.success ? `File ${fileName} saved` : `nano: ${nanoResult.message}`;
          } else {
            output = "";
          }
        }
        break;

      case "echo":
        output = args.join(' ');
        break;

      case "whoami":
        output = user.username;
        break;

      case "date":
        output = new Date().toString();
        break;

      case "clear":
        setHistory([]);
        return;

      case "cmatrix":
        setIsMatrixMode(true);
        output = "Starting Matrix digital rain... Press ESC to exit";
        setTimeout(() => {
          startMatrix();
        }, 1000);
        break;

      case "asciiquarium":
        setIsAquariumMode(true);
        output = "Starting ASCII Aquarium... Press ESC to exit";
        setTimeout(() => {
          startAquarium();
        }, 1000);
        break;

      case "exit":
        window.location.href = '/';
        return;

      case "voidb":
        setAuthPhase("prompt");
        setHistory((prev) => [...prev, { command, output: "" }]);
        return;

      default:
        output = `bash: ${cmd}: command not found`;
    }

    setHistory([...history, { command, output }]);
  };

  const handlePasswordSubmit = async (password) => {
    setInput("");
    setHistoryIndex(null);
    setAuthPhase(null);

    let resultLine = "";
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const body = await res.json();
        sessionStorage.setItem("void_admin_token", body.token);
        resultLine = "Access granted.";
        setHistory((prev) => [...prev, { command: "", output: resultLine }]);
        setTimeout(() => { window.location.href = "/panel-sight"; }, 600);
        return;
      }
      // Surface the real reason from the server instead of a generic message.
      try {
        const body = await res.json();
        resultLine = body.error || `Error ${res.status}.`;
      } catch {
        resultLine = `Error ${res.status}.`;
      }
    } catch {
      resultLine = "Network error.";
    }
    setHistory((prev) => [...prev, { command: "", output: resultLine }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authPhase === "prompt") {
      handlePasswordSubmit(input);
      return;
    }
    if (!input.trim()) return;
    handleCommand(input);
    setInput("");
    setHistoryIndex(null);
  };

  const handleKeyDown = (e) => {
    if (authPhase === "prompt") return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex === null) {
        setHistoryIndex(history.length - 1);
        setInput(history[history.length - 1]?.command || "");
      } else if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
        setInput(history[historyIndex - 1].command);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== null) {
        if (historyIndex < history.length - 1) {
          setHistoryIndex(historyIndex + 1);
          setInput(history[historyIndex + 1].command);
        } else {
          setHistoryIndex(null);
          setInput("");
        }
      }
    }
  };

  return (
    <div className="kali-terminal" ref={terminalRef}>
      {/* Matrix overlay */}
      {isMatrixMode && (
        <div className="matrix-overlay">
          <canvas ref={matrixRef} className="matrix-canvas" />
          <div className="matrix-text">
            <p>MATRIX MODE ACTIVATED</p>
            <p>Press ESC to exit</p>
          </div>
        </div>
      )}
      
      {/* Aquarium overlay */}
      {isAquariumMode && (
        <div className="aquarium-overlay">
          <canvas ref={aquariumRef} className="aquarium-canvas" />
          <div className="aquarium-text">
            <p>🐠 ASCII AQUARIUM 🐟</p>
            <p>Press ESC to exit</p>
          </div>
        </div>
      )}
      
      <div className="terminal-header">
        <div className="terminal-controls">
          <span className="control close"></span>
          <span className="control minimize"></span>
          <span className="control maximize"></span>
        </div>
        <span className="terminal-title">{user.username}@kali: {currentPath}</span>
      </div>
      
      <div className="terminal-content">
        <div className="terminal-welcome">
          Welcome to Kali Linux Terminal
          <br />
          Type 'help' for available commands
        </div>
        
        <div className="terminal-output">
          {history.map((item, idx) => (
            <div key={idx} className="terminal-line">
              <div className="command-line">
                <span className="prompt">{getPrompt()}</span>
                <span className="command">{item.command}</span>
              </div>
              {item.output && (
                <div className="command-output">{item.output}</div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="terminal-input-form">
          <span className="prompt">{authPhase === "prompt" ? "Password:" : getPrompt()}</span>
          <input
            type={authPhase === "prompt" ? "password" : "text"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="terminal-input"
          />
        </form>
      </div>
    </div>
  );
}

export default function TerminalPage() {
  return (
    <div className="terminal-page-container top-0 left-0 w-full h-full">
      <Navbar />
      <TerminalComponent />
    </div>
  );
}