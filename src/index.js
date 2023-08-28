const BASE_URL = "http://localhost:3000";

const quoteList = document.querySelector("#quote-list");
const newQuoteForm = document.querySelector("#new-quote-form");


document.addEventListener("DOMContentLoaded", () => {
    renderQuote();
})

function renderQuote() {
    quoteList.innerText = "";
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(resp => resp.json())
    .then(quotes => {
        quotes.forEach(quoteObject => {
            let likeCounter = quoteObject.likes.length;

            const quoteLine = document.createElement("li");
            quoteLine.innerHTML =`
                <li class="quote-card>
                    <blockquote class="blockquote">
                        <p class="mb-0">${quoteObject.quote}</p>
                        <footer class="blockquote-footer">${quoteObject.author}</footer>
                        <br>
                        <button class="bttn-success">Likes: <span>${likeCounter}</span></button>
                        <button class=bttn-danger">Delete</button>
                    </blockquote>
                </li>
            `;
            quoteList.appendChild(quoteLine);

            const deleteButton = quoteLine.querySelector(".bttn-danger");
            deleteButton.addEventListener("click", (e) => {
                e.stopPropagation()
                fetch(`${BASE_URL}/quotes/${quoteObject.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                .then(() => renderQuote());
            });

            const likeButton = quoteLine.querySelector(".bttn-success");
            likeButton.addEventListener("click", (e) => {
                e.stopPropagation();
                fetch(`${BASE_URL}/likes`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({quoteId: quoteObject.id})
                })
            })
            .then(resp => resp.json())
            .then(newLike => {
                const updatedLikeCounter = likeCounter + 1;
                likeButton.querySelector("span").textContent = updatedLikeCounter;
                likeCounter = updatedLikeCounter;
            })
        })
    })
};

newQuoteForm.addEventListener("submit", createNewQuote);

function createNewQuote(e) {
    e.preventDefault();
    const newQuoteObject = {
        quote: e.target.quote.value,
        author: e.target.author.value
    }
    addNewQuote(newQuoteObject)
};

function addNewQuote(newQuoteObject) {
    fetch(`${BASE_URL}/quotes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newQuoteObject)
    })
    .then(resp => resp.json())
    .then(quotes => {
        quoteList.textContent = ""
        renderList()
    })
}
