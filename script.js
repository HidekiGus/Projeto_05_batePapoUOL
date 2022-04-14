// requisita as mensagens, checa se as lengths do que já tem
// vs os dados novos e carrega só se tiver novos, e se chama 
//depois de 3000ms ou 3s
function requisitarMensagens() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promessa.then(loopMensagens);
}

function loopMensagens(response) {
    if (document.querySelectorAll(".mensagem").length !== response.data.length) {
        const area = document.querySelector(".area-mensagens");
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
    const nome = prompt("Qual é o seu nome?");
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", {name: nome});
    promessa.then(function () {
        console.log("deu certo");
        requisitarMensagens();
        setInterval(axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {name: nome}), 5000);
    })
    promessa.catch(function () {
        alert("Já tem alguém usando esse nome!")
        entrouNaSala();
    })
}


entrouNaSala();