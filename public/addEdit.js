import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showEvents } from "./jobs.js";

let addEditDiv = null;
let eventName = null;
let description = null;
let date = null;
let location = null;
let eventType = null;
let addingEvent = null; 

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-event");
  eventName = document.getElementById("eventName");
  description = document.getElementById("description");
  date = document.getElementById("date");
  location = document.getElementById("location");
  eventType = document.getElementById("eventType");
  addingEvent = document.getElementById("adding-event");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingEvent) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/events";

        if (addingEvent.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/events/${addEditDiv.dataset.id}`;
        } 
     

        try {
          // console.log({
          //   eventName: eventName.value,
          //   description: description.value,
          //   date: date.value,
          //   location: location.value,
          //   eventType: eventType.value,
          // });

          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              eventName: eventName.value,
              description: description.value,
              date: date.value,
              location: location.value,
              eventType: eventType.value,
            }),
          });

          const data = await response.json();
          if (response.status === 201 || response.status === 200 ) {
            if (response.status === 200) {
              //200 is successful update
              message.textContent = "The event entry was updated.";
            } else if (response.status === 201) {
              // 201 is succesful create
              message.textContent = "The new event entry was created.";
            } 
           

            eventName.value = "";
            description.value = "";
            date.value = "";
            location.value = "";
            eventType.value = "conference";

            showEvents();
          } else { //if unsucessful
            message.textContent = data.msg;
          }
        } catch (err) { //if have error
          console.log(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        showEvents();
      }
    }
  });
};

export const showAddEdit = async (eventId) => {
  if (!eventId) {
    eventName.value = "";
    description.value = "";
    date.value = "";
    location.value = "";
    eventType.value = "conference";
    addingEvent.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/events/${eventId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        eventName.value = data.event.eventName;
        description.value = data.event.description;
        date.value = data.event.date;
        location.value = data.event.location;
        eventType.value = data.event.eventType;
        addingEvent.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = eventId;

        setDiv(addEditDiv);
      } else {
        message.textContent = "The event entry was not found";
        showEvents();
      }
    } catch (error) {
      console.log(error);
      message.textContent = "A communications error has occured.";
      showEvents();
    }
    enableInput(true);
  }
  message.textContent = "";
  setDiv(addEditDiv);
};
