const socket = io("http://localhost:3000");

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get("username");
const room = urlSearch.get("join_room");

socket.emit(
  "join_room",
  {
    username,
    room,
  },
  (response) => {
    response.forEach((message) => {
      createMessage(message);
    });
  }
);

function createMessage(data) {
  const messageDiv = document.getElementById("messages");
  const date = new Date(data.createdAt);
  const formattedDate = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  messageDiv.innerHTML += `
    <div class="new-message">
        <label class="form-label">
            <strong>${data.username}</strong>: <span>${data.text} - ${formattedDate}</span>
        </label>
    </div>
    `;
}

document
  .getElementById("message-input")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const message = event.target.value;

      socket.emit("message", {
        username,
        room,
        message,
      });

      event.target.value = "";
    }
  });

socket.on("message", (data) => {
  createMessage(data);
});
