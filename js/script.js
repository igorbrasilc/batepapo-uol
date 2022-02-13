let lastMessageLoop;
let lastMessageArray;
let username;

function enterSite() {
    // document.addEventListener("keypress", function(e) {
    //     if(e.key === 'Enter') {
    //         let input = document.querySelector("nav input");
    //         input.click();
    //     }
    // })

    const navText = document.querySelector("nav p");
    navText.innerHTML = "Solicitando entrada ao servidor...";

    username = document.querySelector("nav input").value;
    const newUser = {
        name: username
    };

    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", newUser);
    promise.then(permittedEntry);
    promise.catch(deniedEntry);

    setInterval(() => checkIfUserOnline(newUser), 5000);
    getMessages();
    setInterval(getMessages, 3000);
}

function permittedEntry(response) {   
    const nav = document.querySelector("nav");
    nav.classList.add("hidden");
    
    const header = document.querySelector("header");
    header.innerHTML = `
    <img src="./img/logo 1.png" alt="Logo Header" />
        <ion-icon name="people" onclick="checkAside()"></ion-icon>
    `;

    const footer = document.querySelector("footer");
    footer.innerHTML = `
    <input type="text" placeholder="Escreva aqui...">
    <button>
    <ion-icon name="send-outline"></ion-icon>
    </button>
    `
}

function deniedEntry(error) {
    console.log(error);

    const navText = document.querySelector("nav p");
    navText.innerHTML = "No momento já existe um usuário online com o seu nome. Troque de nome ou espere!";
}

function checkIfUserOnline(User) {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", User);
    promise.catch(isOffline);
}

function isOffline(error) {
    alert("Usuário offline!");
    window.location.reload();
}

function getMessages() {
    const promiseMessage = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promiseMessage.then(getMessagesOK);
    promiseMessage.catch(didntGetMessages);
}

function getMessagesOK(response) {
    const messages = response.data;
    const containerMessages = document.querySelector(".container-messages");
    let startMessageCount = 0;
    lastMessageArray = `${messages[messages.length - 1].from}`;

// checka se o nome da ultima mensagem recebido pelo servidor é o mesmo que o ultimo array gerado, se for, atualiza o feed e scrolla até o final:

    if (lastMessageArray !== lastMessageLoop) {
        containerMessages.innerHTML = "";
    while(startMessageCount < messages.length) {
    const from = messages[startMessageCount].from;
    const to = messages[startMessageCount].to;
    const text = messages[startMessageCount].text;
    const type = messages[startMessageCount].type;
    const time = messages[startMessageCount].time;

        if (type === "status") {
            containerMessages.innerHTML += `
            <article class="msg-enter-exit">
            <p><span>
                    (${time})
                </span>
                <strong>${from}</strong> ${text}
            </p>
            </article>
            `;
        } else if (type === "message") {
            containerMessages.innerHTML += `
            <article class="msg-all">
            <p><span>
                    (${time})
                </span>
                <strong>${from}</strong> para <strong>Todos</strong>: ${text}
            </p>
            </article>
            `;
        } else if (type === "private_message" && to === username) {
            containerMessages.innerHTML += `
            <article class="msg-pvt">
            <p><span>
                    (${time})
                </span>
                <strong>${from}</strong> para <strong>${to}</strong>: ${text}
            </p>
            </article>
            `;
        }
        startMessageCount++;
    }
    const lastElement = [...document.querySelectorAll("article")];
    lastMessageLoop = lastElement[messages.length - 1].querySelector("strong").innerText;
    lastElement[messages.length - 1].scrollIntoView();
}
}

function didntGetMessages(error) {
    console.log(error);
    alert("Deu xabu com as mensagens, tente reiniciar");
}

function checkAside() {
    const aside = document.querySelector("aside");
    aside.classList.remove("hidden");
}

function uncheckAside() {
    const aside = document.querySelector("aside");
    aside.classList.add("hidden");
}