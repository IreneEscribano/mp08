console.clear();
console.log("CONNECTA 4 ");

// Aquests són els números que indiquen les columnes
let numeros= [" 1"," 2"," 3"," 4"," 5"," 6"," 7"];

// Es crea un array amb 7 columnes i 6 files on poder colocar les fitxes
let taulell = [
    ["  ","  ","  ","  ","  ","  ","  "],
    ["  ","  ","  ","  ","  ","  ","  "],
    ["  ","  ","  ","  ","  ","  ","  "],
    ["  ","  ","  ","  ","  ","  ","  "],
    ["  ","  ","  ","  ","  ","  ","  "],
    ["  ","  ","  ","  ","  ","  ","  "],
  
];

// El jugador 1 sempre començarà la partida
let jugador = 1;

// Mentre no hi hagi un guanyador, s'executaràn les comandes següents
while (no_hi_ha_guanyador(taulell)) {
    // Es neteja la pantalla cada vegada que un jugador realitza la seva jugada
    console.clear();
    console.log("Taulell: ");
    // S'utilitza la funció de pintar el taulell
    pintar_taulell(taulell, numeros);
    // Es pregunta al jugador la posició de la fitxa
    // S'emmagatzema la posició de la nova fitxa
    var readlineSync=require('readline-sync')
    var fila = readlineSync.question("On vols col·locar la teva fitxa, jugador "+jugador+":");
    if (processar_moviment(fila, jugador, taulell)) {
        // En cas que el moviment sigui correcte, es pinta el taulell amb la fitxa nova
        pintar_taulell(taulell, numeros, jugador);
        // Si el jugador és el 1, doncs el jugador 2 tindrà el seu torn
        jugador == 1 ? jugador = 2 : jugador = 1;
    }
}

jugador == 1 ? jugador = 2 : jugador = 1;

// S'imprimeix un missatge per felicitar al guanyador 
console.log(`Felicitats, jugador ${jugador}! Has guanyat! `);

// Aquesta funció serveix per processar els moviments que els jugadors demanen al joc
function processar_moviment(columna, jugador, taulell) {
    if (columna == '1' || columna == '2' || columna == '3' || columna == '4' || columna == '5' || columna == '6' || columna == '7') {
        var num_col = parseInt(columna);
        // En cas que existeixi la columna demanada, poden passar dues coses:
        // Que la columna estigui plena i que el jugador es vegi obligat a escollir una altra posició
        if (taulell[0][num_col - 1] != 0) {
            console.log('Columna plena, presiona [ENTER] per continuar: ');
            return false;
        }
        // O que no hi ha hagut cap error i que es gravi el moviment
        gravar_moviment(num_col, jugador, taulell);
        return true;
    } else {
        // Si la columna desitjada no existeix, el joc avisarà al jugador, obligant-lo a escollir una altra columna
        readline('La casella no existeix, presiona [ENTER] per continuar: ');
        return false;
    }
}
// La següent funció consisteix en gravar els moviments dels jugadors
function gravar_moviment(num_col, jugador, taulell) {
    // Generem una variable global que es farà servir per al futur bucle
    taulell;
    // Començem des del final de l'array per buscar la posició demanada
    num_col--;  
    
    for (var c = 5; c >= 0; c--) {
        // Si al taulell hi ha un espai en blanc a la casella solicitada, vol dir que es pot ficar una fitxa
        if (taulell[c][num_col] == "  ") {
            // En cas que el jugador que ha demanat la posició sigui el 1, al taulell es colocaria la seva fitxa, que és la blanca
            if (jugador == 1) {
                taulell[c][num_col] = "⚪";
            } else if (jugador == 2) {
                // En cas contrari es retornaria la vermella, que és la del jugador 2
                taulell[c][num_col] = "🔴";
            }
            c = -1;
            return;
        }
    }

}

// Pintem el taulell d'acord amb els canvis que anirà rebent durant la partida
function pintar_taulell(taulell, numeros) {
    taulell=taulell;
    numeros=numeros;
    console.clear();
    console.log("ღƪ(ˆ◡ˆ)ʃ♡ 𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐚 𝟒 ♡ƪ(ˆ◡ˆ)ʃ♪ ");

    // Aquest bucle imprimeix per pantalla els números de les columnes a sobre del taulell
    for (var i = 0; i < 7; i++) { 
        process.stdout.write("|"+numeros[i]);
    }
    console.log("|");

    // S'imprimeix el taulell
    for (var t = 0; t < 6; t++) {
        for (var tt = 0; tt < 7; tt++) {
            process.stdout.write("|" + taulell[t][tt]);
        }
        process.stdout.write("|\n");
    }
    process.stdout.write("\n");
}

// Es comprova que no hi ha un guanyador
function no_hi_ha_guanyador(taulell) {
    // Els bucles següents busquen si s'han posat quatre fitxes seguides d'un sol color al taulell
    // Aquest d'aquí les busca per files
    for (var t = 0; t < 6; t++) {
        var n_uns = 0;
        var n_dos = 0;
        for (var tt = 0; tt < 7; tt++) {
            if (taulell[t][tt] == "⚪") {
                n_uns++;
                n_dos = 0;
                if (n_uns == 4) return false;
            } else if (taulell[t][tt] == "🔴") {
                n_dos++;
                n_uns = 0;
                if (n_dos == 4) return false; 
            }
        }
    }

    // Aquest per columnes
    for (var t = 0; t < 7; t++) {
        var n_uns = 0;
        var n_dos = 0;
        for (var tt = 0; tt < 6; tt++) {
            if (taulell[tt][t] == "⚪") {
                n_uns++;
                n_dos = 0;
                if (n_uns == 4) return false;
            } else if (taulell[tt][t] == "🔴") {
                n_dos++;
                n_uns = 0;
                if (n_dos == 4) return false;    
            }
        }
    }

    // I els últims bucles busquen les fitxes per diagonals, un per a la dreta i un altre per a la esquerra del taulell
    for (var t = -3; t < 3; t++) { 
        var n_uns = 0;
        var n_dos = 0;
        for (var tt = 0; tt < 7; tt++) {  
            if ((t + tt) >= 0 && (t + tt) < 6 && tt >= 0 && tt < 7) {
                if(taulell[t + tt][tt] == "⚪"){
                    n_uns++;
                    n_dos = 0;
                    if (n_uns >= 4) return false;
                }else if(taulell[t + tt][tt] == "🔴"){
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
                if(taulell[t - tt][tt] == "⚪") {
                    n_uns++;
                    if(n_uns >= 4) return false;
                } else if(taulell[t - tt][tt] == "🔴") {
                    n_dos++;
                    if (n_dos >= 4) return false;
                }
            }
        }
    }

    return true;
}