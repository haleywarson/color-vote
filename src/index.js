const colorsUrl = "http://localhost:3000/colors/";

const colorCard = document.querySelector("#card-container");
const colorForm = document.querySelector("#color-form")

fetch(colorsUrl)
.then(response => response.json())
.then(colors => colors.forEach(color => renderCard(color)))

function renderCard(color) { 
    const cardDiv = document.createElement("div");
    cardDiv.className = "color-card";
    cardDiv.style.backgroundColor = color.hex

    const header = document.createElement("h2");
    header.textContent = color.name;

    const colorVotes = document.createElement("p");
    colorVotes.textContent = `${color.votes} Votes`;

    const voteButton = document.createElement("button"); 
    voteButton.textContent = "+1 Vote!";
    voteButton.addEventListener("click", () => increaseVotes(color, colorVotes))
        
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", () => deleteCard(color, cardDiv))

    cardDiv.append(header, colorVotes, voteButton, deleteButton);
    colorCard.append(cardDiv);
}

function increaseVotes(color, colorVotes) {  //doesnt patch for new cards
    color.votes++;
    colorVotes.textContent = `${color.votes} Votes`;
    fetch(colorsUrl + color.id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({
            votes: color.votes,
        }),
    })
    
};

function deleteCard(color, cardDiv) {
    cardDiv.remove()
    
    fetch(colorsUrl + color.id, {
        method: "DELETE",
        })
}

colorForm.addEventListener("submit", (event) => {//submit, render, post to back end
    event.preventDefault();
    const formData = new FormData(event.target);
    const textInput = formData.get("name"); //color name input
    const colorInput = formData.get("hex"); //color hex input

    const color = {
        name: textInput,
        hex: colorInput,
        votes: 0,
    };

    renderCard(color)

    fetch(colorsUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(color),
    });
})

