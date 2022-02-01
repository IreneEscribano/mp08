// Per defecte les caselles del taulell només tenen espais en blanc 
let taulell = [
    ["&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;"],
    ["&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;"],
    ["&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;"],
    ["&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;"],
    ["&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;"],
    ["&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;","&nbsp; &nbsp;"]
];
// El primer jugador que tindrà torn serà l'1
let jugador = 1;
// La partida comença amb l'estat 1
let estado = 1;
// Importem les eines necessàries per a utilitzar el http
var http = require('http');
// El mateix amb la url
var url = require('url');
// Aquesta variable ajudarà a reportar els possibles errors que es desenvolupin al joc
let error;
// Es crea un servidor per http
http.createServer(function(req,res) {
    // Es recull la url
    var q = url.parse(req.url, true).query;
    // Aquesta variable d'aquí emmagatzema el taulell imprés per la funció pintar_taulell
    let taulell_output=pintar_taulell(taulell);
    // S'escriu la capçelera de la pàgina, indicant que tindrà una estructura html
    res.writeHead(200, {'Content-Type': 'text/html'});
    // Definim l'estil de la nostra pàgina web
    res.write(`
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap');

body {  
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: fixed;
    text-shadow: 0 0 5px white;
    background-image: url("https://nebula.wsimg.com/03e92998a3f8ff1df6d92f5d7e8e873e?AccessKeyId=AE390C3BA3FA36C76872&disposition=0&alloworigin=1");
    background-size: cover;
    overflow-y: auto !important;
    font-family: 'Patrick Hand', cursive;
    font-size: 40px;
    color: white; 
    -webkit-mask-image: url("https://i.imgur.com/PuIhG0m.png");
    mask-image: url("https://i.imgur.com/PuIhG0m.png");
    -webkit-mask-size: 5%;
    mask-size: 5%;
    text-align: center;
    margin-top: 4%;
    line-height: 90%;
}
h1 {
    margin-top: 2%;
}
svg {
    filter: drop-shadow(0 0 2px white);
}
#creu {
    margin-left: 2px;
}
circle {
    stroke-dasharray: 280 280;
    stroke-dashoffset: 0;
    animation-duration: 2s;
    animation-name: draw;
}
.cross-1, .cross-2 {
    stroke-dasharray: 280 280;
    stroke-dashoffset: 0;
    animation-duration: 2s;
    animation-name: draw;
}
.cross-2 {
    animation-delay: 0.1s;
    animation-duration: 3s;
}
@keyframes draw {
    from {
      stroke-dashoffset: 280;
    }
  
    to {
      stroke-dashoffset: 0;
    }
}
    </style>
    `);
    // Imprimim el títol del joc
    res.write("<h1>Connecta 4 Node JS Web</h1><br>");
    // El joc seguirà el seu curs mentre no hi hagi guanyador i la columna tingui un valor diferent a undefined
    while (no_hi_ha_guanyador(taulell) && q.columna != undefined) {
        // Si la funció processar_moviment retorna true
        if (processar_moviment(q.columna, jugador, taulell)) {
            // Es guarda el taulell que retorna la funció pintar_taulell
            taulell_output = pintar_taulell(taulell);
            // Si el jugador actual és 1, passarà a ser el dos
            jugador == 1 ? jugador = 2 : jugador = 1;
            // Si l'estat és 1, passarà a ser 2
            estado == 1 ? estado = 2: estado = 2;
            // Aquesta variable tindrà el valor undefined per acabar el bucle
            q.columna = undefined;
        }
        else {
            // Si hi ha un error es mostra un missatge per avisar
            res.write(`
                ERROR: `+error+`
            <br>`)
            // Es guarda l'últim taulell que la funció pintar_taulell retorna
            taulell_output = pintar_taulell(taulell);
            jugador == 1 ? jugador = 2 : jugador = 1;
            estado == 1 ? estado = 2: estado = 2;
            q.columna = undefined;
        }

        /*
        res.write("Columna: "+q.columna+"<br>");
        jugador=(jugador==1?2:1);
        */
    }
    // Es mostra el taulell a la pàgina
    res.write(taulell_output);
    // Si hi ha un guanyador
    if(no_hi_ha_guanyador(taulell) == false){
        jugador == 1 ? jugador = 2 : jugador = 1;
        // Si el jugador és 1
        if(jugador == 1){
            // S'escriu un missatge de victòria per al jugador 1
            res.write(`
            <h1> FELICITATS, HAS GUANYAT JUGADOR 1!!! </h1>
        `)
        }else {
            // En cas contrari el missatge de victòria seria pel jugador 2
            res.write(`
            <h1> FELICITATS, HAS GUANYAT JUGADOR 2!!! </h1>
        `)
        }

    }else {
        // S'imprimirà un formulari on introduir els moviments mentre no hi hagi guanyador
        res.write(
            `<br><form action=connect4_web_server.js method="GET">
                Moviment del jugador `+jugador+`:<input type="number" size=2 min=1 max=8 name=columna>
                <input type="submit" value="Enviar">
            </form>`);    
    }
    // El servidor només farà cas al port 8000
}).listen(8000);
// Aquesta funció s'encarrega de pintar el taulell del joc
function pintar_taulell(taulell_a_pintar){
    let taulell_output="";

    // El bucle ajuda a imprimir la taula des d'una matriu
    // El primer correspon amb les 6 files que compón la taula
    for (t=0; t<6; t++){
        // El segon correspon amb les 7 columnes de la taula
        for (tt=0; tt<7; tt++){
            // S'imprimeix la taula amb el valor que tingui cadascuna de les seves cel·les
            taulell_output += "<span onclick='console.log('Hola')'>|"+taulell_a_pintar[t][tt]+"</span>"; 
        }
        // Deixa un espai per ajustar l'aparença de la taula
        taulell_output+="|<br>";
    }
    // Es retorna el taulell dins la variable taulell_output
    return taulell_output;
}
// La següent funció verifica que no hi hagi cap guanyador durant el transcurs de la partida
function no_hi_ha_guanyador(taulell) {
    // Els bucles següents busquen si s'han posat quatre fitxes seguides d'un sol color al taulell
    // Aquest d'aquí les busca per files
    for (var t = 0; t < 6; t++) {
        var n_uns = 0;
        var n_dos = 0;
        for (var tt = 0; tt < 7; tt++) {
            // Si a una cel·la del taulell hi ha un cercle marcat
            if (taulell[t][tt] == `<svg height="40" width="30">
                <circle cx="15" cy="25" r="8" stroke="white" stroke-width="3" fill="none"></circle>
              </svg>`) {
                // Es suma el número de fitxes que el jugador ha posat en línia
                n_uns++;
                n_dos = 0;
                // Si el jugador 1 té 4 o més fitxes acumulades es retornarà false
                if (n_uns >= 4) return false;
            // Si una de les cel·les té una creu marcada
            } else if(taulell[t][tt] == `<svg id="creu" height="35" width="24"><path cx="65" cy="25" class="cross-1" fill="none" d="M0 10 L20 30" stroke="white" stroke-width="3"/><path cx="15" cy="25" class="cross-2" fill="none" d="M20 10 L0 30" stroke="white" stroke-width="3"/></svg>`) {
                // El jugador 2 tindrà una fitxa més en línia
                n_dos++;
                n_uns = 0;
                // Si el jugador 2 té 4 o més fitxes en filera es retorna false
                if (n_dos >= 4) return false; 
            }
        }
    }

    // Aquest per columnes
    for (var t = 0; t < 7; t++) {
        var n_uns = 0;
        var n_dos = 0;
        for (var tt = 0; tt < 6; tt++) {
            if(taulell[tt][t] == `<svg height="40" width="30">
                <circle cx="15" cy="25" r="8" stroke="white" stroke-width="3" fill="none"></circle>
              </svg>`){
                n_uns++;
                n_dos = 0;
                if (n_uns >= 4) return false;
            }else if(taulell[tt][t] == `<svg id="creu" height="35" width="24"><path cx="65" cy="25" class="cross-1" fill="none" d="M0 10 L20 30" stroke="white" stroke-width="3"/><path cx="15" cy="25" class="cross-2" fill="none" d="M20 10 L0 30" stroke="white" stroke-width="3"/></svg>`){
                n_dos++;
                n_uns = 0;
                if (n_dos >= 4) return false;
            } 
        }
    }

    // I els últims bucles busquen les fitxes per diagonals, un per a la dreta i un altre per a la esquerra del taulell
    for (var t = -3; t < 3; t++) { 
        var n_uns = 0;
        var n_dos = 0;
        for (var tt = 0; tt < 7; tt++) {  
            if ((t + tt) >= 0 && (t + tt) < 6 && tt >= 0 && tt < 7) {
                if(taulell[t + tt][tt] == `<svg height="40" width="30">
                <circle cx="15" cy="25" r="8" stroke="white" stroke-width="3" fill="none"></circle>
              </svg>`){
                    n_uns++;
                    n_dos = 0;
                    if (n_uns >= 4) return false;
                }else if(taulell[t + tt][tt] == `<svg id="creu" height="35" width="24"><path cx="65" cy="25" class="cross-1" fill="none" d="M0 10 L20 30" stroke="white" stroke-width="3"/><path cx="15" cy="25" class="cross-2" fill="none" d="M20 10 L0 30" stroke="white" stroke-width="3"/></svg>`){
                    n_dos++;
                    n_uns = 0;
                    if (n_dos >= 4) return false;
                } 
            }    
        }
    }

    for(var t = 3; t < 9; t++) { 
        var n_uns = 0;
        var n_dos = 0;
        for(var tt = 0; tt < 7; tt++) { 
            if((t - tt) >= 0 && (t - tt) < 6 && tt >= 0 && tt < 7) {
                if(taulell[t - tt][tt] == `<svg height="40" width="30">
                <circle cx="15" cy="25" r="8" stroke="white" stroke-width="3" fill="none"></circle>
              </svg>`) {
                    n_uns++;
                    if(n_uns >= 4) return false;
                } else if(taulell[t - tt][tt] == `<svg id="creu" height="35" width="24"><path cx="65" cy="25" class="cross-1" fill="none" d="M0 10 L20 30" stroke="white" stroke-width="3"/><path cx="15" cy="25" class="cross-2" fill="none" d="M20 10 L0 30" stroke="white" stroke-width="3"/></svg>`) {
                    n_dos++;
                    if (n_dos >= 4) return false;
                }
            }
        }
    }

    return true;
}
// Aquesta funció s'encarrega d'enregistrar el moviment de l'últim jugador i mirar si és vàlid o no
function processar_moviment(columna, jugador, taulell) {
    if (columna == '1' || columna == '2' || columna == '3' || columna == '4' || columna == '5' || columna == '6' || columna == '7') {
        var num_col = parseInt(columna);
        // En cas que existeixi la columna demanada, poden passar dues coses:
        // Que la columna estigui plena i que el jugador es vegi obligat a escollir una altra posició
        if (taulell[0][num_col - 1] != "&nbsp; &nbsp;") {
            error="Aquesta columna es plena... ";
            return false;
        }
        // O que no hi ha hagut cap error i que es gravi el moviment
        gravar_moviment(num_col, jugador, taulell);
        return true;
    } else {
        // Si la columna desitjada no existeix, el joc avisarà al jugador, obligant-lo a escollir una altra columna
        error="La casella que vols no existeix...";
        return false;
    }
}
// La funció gravar_moviment coloca la fitxa del jugador a la posició demanada
function gravar_moviment(num_col, jugador, taulell) {
    // Generem una variable global que es farà servir per al futur bucle
    taulell;
    // Començem des del final de l'array per buscar la posició demanada
    num_col--;  
    // Aquest bucle busca la casella demanada
    for (var c = 5; c >= 0; c--) {
        // Si al taulell hi ha un espai en blanc a la casella solicitada, vol dir que es pot ficar una fitxa
        if (taulell[c][num_col] == "&nbsp; &nbsp;") {
            // En cas que el jugador que ha demanat la posició sigui el 1, al taulell es colocaria la seva fitxa, que és un cercle
            if (jugador == 1) {
                taulell[c][num_col] = `<svg height="40" width="30">
                <circle cx="15" cy="25" r="8" stroke="white" stroke-width="3" fill="none"></circle>
              </svg>`;
            } else if (jugador == 2) {
                // En cas contrari es retornaria una creu, que és la marca del jugador 2
                taulell[c][num_col] = `<svg id="creu" height="35" width="24"><path cx="65" cy="25" class="cross-1" fill="none" d="M0 10 L20 30" stroke="white" stroke-width="3"/><path cx="15" cy="25" class="cross-2" fill="none" d="M20 10 L0 30" stroke="white" stroke-width="3"/></svg>`;
            }
            c = -1;
            return;
        }
    }
}