// requisita as mensagens, checa se as lengths do que já tem
// vs os dados novos e carrega só se tiver novos, e se chama 
//depois de 3000ms ou 3s
let nome = "";

function requisitarMensagens() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promessa.then(loopMensagens);
}

function loopMensagens(response) {
    let area = document.querySelector(".area-mensagens");
    let tamanho = Number(response.data.length);
    if (document.querySelectorAll(".horario")[tamanho-1] !== response.data[tamanho-1].time) {
        area.innerHTML = ``;
        for (i = 0; i < response.data.length; i++) {
            let remetente = response.data[i].from;
            let destinatario = response.data[i].to;
            let texto = response.data[i].text;
            let tipo = response.data[i].type;
            let hora = response.data[i].time;

            let estiloMensagem = "mensagem";

            if (tipo === "status") {
                estiloMensagem += " entrou"
                area.innerHTML += `
                <div class="${estiloMensagem}">
                    <div class="horario">
                        (${hora})
                    </div>
                    <span>${remetente} &nbsp;</span>
                    ${texto}
                </div>
                `        
            } else if (tipo === "reservado") {
                estiloMensagem += " reservado"
                area.innerHTML += `
                <div class="${estiloMensagem}">
                    <div class="horario">
                        (${hora})
                    </div>
                    <span>${remetente} &nbsp;</span>
                    reservadamente para &nbsp;
                    <span>${destinatario}</span>
                    : &nbsp; ${texto}
                </div>
                `
            } else {
                area.innerHTML += `
                <div class="${estiloMensagem}">
                    <div class="horario">
                        (${hora})
                    </div>
                    <span>${remetente} &nbsp;</span>
                    para &nbsp;
                    <span>${destinatario}</span>
                    : &nbsp; ${texto}
                </div>
                `
            }
                
            const elementoQueQueroQueApareca = document.querySelectorAll('.mensagem')[i];
            elementoQueQueroQueApareca.scrollIntoView(false);
        }
    }

    setTimeout(requisitarMensagens, 3000);
}

function entrouNaSala() {
    nome = prompt("Qual é o seu nome?");
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {name: nome});
    promessa.then(function () {
        requisitarMensagens();
        setInterval(function () {
            abstraida(nome);
        }, 5000);
    });
    promessa.catch(function () {
        alert("Já tem alguém usando esse nome!")
        window.location.reload();
    });
}

function abstraida(nome) {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {name: nome});
}

function mandarMensagem() {
    const mensagem = document.querySelector("input").value;
    console.log(mensagem);
    let objeto = {from: `${nome}`, to: "Todos", text: `${mensagem}`, type: "message"};
    let promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", objeto);
    promessa.then(function () {
        document.querySelector("input").value = '';
        requisitarMensagens();
    });
}

entrouNaSala();