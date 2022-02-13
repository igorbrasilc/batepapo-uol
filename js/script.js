let lastMessageLoop = null;
let lastMessageArray = null;
let username;
let startMessageCount;

function enterSite() {
    // document.addEventListener("keypress", function(e) {
    //     if(e.key === 'Enter') {
    //         let input = document.querySelector("nav input");
    //         input.click();
    //     }
    // }) não deu certo, mas tentei aplicar

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
    <button onclick="postMessage()">
    <ion-icon name="send-outline"></ion-icon>
    </button>
    `;
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
    startMessageCount = 0;
    lastMessageArray = `${messages[messages.length - 1].from}`;

// checka se o nome da ultima mensagem recebido pelo servidor é o mesmo que o ultimo array gerado, se for, atualiza o feed e scrolla até o final:

    if (lastMessageArray !== lastMessageLoop || lastMessageLoop === username) {
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
                <strong>${from}</strong> para <strong>${to}</strong>: ${text}
            </p>
            </article>
            `;
        } else if ((type === "private_message" && to === username) || (type === "private_message" && from === username)) {
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

    const lastElement = document.querySelector("article:last-child");
    lastMessageLoop = lastElement.querySelector("strong").innerText;
    lastElement.scrollIntoView();
}
}

function didntGetMessages(error) {
    console.log(error);
    alert("Deu xabu com as mensagens, tente reiniciar");
}

function postMessage() {
    const messagePost = document.querySelector("footer input").value; //ok
    const messageTo = document.querySelector(".usersAll .check").parentNode.querySelector("span").innerHTML; //ok

    const messageVisibility = document.querySelector(".visibility .check").parentNode.querySelector("span").innerHTML;

    console.log(messageVisibility)
    let messageType;

    if (messageVisibility === "Público") {
        messageType = "message";
    } else if (messageVisibility === "Reservadamente") {
        messageType = "private_message";
    }
    console.log(messageType);

    const objectPost = {
        from: username,
        to: messageTo,
        text: messagePost,
        type: messageType
    };

    console.log(objectPost);

    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", objectPost);
    promise.then(postMessageOK);
    promise.catch(didntGetMessages);
}

function postMessageOK(response) {
    getMessages();
}

function checkAside() {
    const aside = document.querySelector("aside");
    aside.classList.remove("hidden");

    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    promise.then(showParticipants);
    promise.catch(() => {
        alert("Servidor não ta pegando os participantes não...");
    })
}

function uncheckAside() {
    const aside = document.querySelector("aside");
    aside.classList.add("hidden");
}


function checkOption(option) {
    const divPai = option.parentNode;
    const icon = option.querySelector(".hidden");

    icon.classList.add("check");

    const selected = [...divPai.querySelectorAll(".check")];
    console.log(selected);

    if (selected.length === 2) {
        for (let i = 0; i < selected.length; i++) {
            selected[i].classList.remove("check");
        }
        icon.classList.add("check");
    }
} 

function showParticipants(response) {
    const participants = response.data;
    const users = document.querySelector(".usersAll");

    for (let i = 0; i < participants.length; i++) {

        users.innerHTML += `
        <article class="user" onclick="checkOption(this)">
            <div class="icon-and-user">
                <ion-icon name="person-circle"></ion-icon>
                <span>${participants[i].name}</span>
            </div>
            <ion-icon name="checkmark" class=" hidden"></ion-icon>
        </article>
        `;
    }
}
