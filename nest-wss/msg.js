const socket = io("ws://localhost:3000");


socket.addEventListener('messageToServer', (event) => {
    console.log('Connected to WebSocket server');
    socket.send('Hello, server!');
  });

  

document
  .getElementById("message-input")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const message = event.target.value;
      
      socket.emit('messageToServer', message)

      event.target.value = "";
    }
  });
