import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";

let eventsDiv = null;
let eventsTable = null;
let eventsTableHeader = null;

export const handleEvents = () => {
  eventsDiv = document.getElementById("events");
  const logoff = document.getElementById("logoff");
  const addEvent = document.getElementById("add-event");
  eventsTable = document.getElementById("events-table");
  eventsTableHeader = document.getElementById("events-table-header");

  eventsDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addEvent) {
        showAddEdit(null);
      } else if (e.target === logoff) {
        setToken(null);

        message.textContent = "You have been logged off.";

        eventsTable.replaceChildren([eventsTableHeader]);

        showLoginRegister();
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id); // Pass the event ID to the showAddEdit function
      } else if (e.target.classList.contains("deleteButton")) {
         message.textContent= ""; //clear any existing message
         showEvents();
        //  enableInput(false);

         try {
          const response = await fetch(`/api/v1/events/${e.target.dataset.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
          
          if (response.status === 204) {
          
          message.textContent = "The event is successfully deleted.";
          showEvents(); // Refresh the event list after deletion
        } else {
          const data = await response.json();
          message.textContent = data.msg || "Failed to delete the event.";
         }
      } catch (err) {
        console.log(err);
        message.textContent = "A communication error occurred.";
      }
      enableInput(true);
    }
}});
};

export const showEvents = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/events", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log("Events data:", data); //TODO: Delete
    let children = [eventsTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        eventsTable.replaceChildren(...children); // clear this for safety
      } else {
        for (let i = 0; i < data.events.length; i++) {
          let rowEntry = document.createElement("tr");

          let editButton = `<td><button type="button" class="editButton" data-id=${data.events[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.events[i]._id}>delete</button></td>`;
          let rowHTML = `
            <td>${data.events[i].eventName}</td>
            <td>${data.events[i].description}</td>
            <td>${data.events[i].date}</td>
            <td>${data.events[i].location}</td>
            <td>${data.events[i].eventType}</td>
            
            <div>${editButton}${deleteButton}</div>`;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        eventsTable.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(eventsDiv);
};
