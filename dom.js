let step = 0;
let editId = null;
let tempData = {};



document.getElementById("opretAfstemning_id").addEventListener("click", () => {

    step = 0;
    editId = null;
    tempData = {};

    document.getElementById("wizardContainer_id").style.display = "block";
    document.getElementById("detailContainer_id").style.display = "none";

    document.getElementById("opretAfstemning_id").style.display = "none";
    document.getElementById("afstemningContainer_id").style.display = "none";

    visStep();
});



function getStatus(a) {

    if (a.afsluttet) {
        return "Afsluttet";
    }

    let nu = new Date();
    let start = new Date(a.start);
    let slut = new Date(a.slut);

    if (nu < start) {
        return "Venter";
    }

    if (nu > slut) {
        return "Afsluttet";
    }

    return "Åben";
}



function visStep() {

    let c = document.getElementById("wizardContainer_id");

    let progress = `
        <div style="margin-bottom:10px;">
            <div style="background:lightgray; height:10px; width:100%;">
                <div style="background:green; height:10px; width:${(step / 4) * 100}%;"></div>
            </div>
        </div>
    `;

    let closeBtn = `
        <button onclick="lukWizard()" 
            style="position:absolute; top:10px; right:10px; border:none; background:lightgray; cursor:pointer;">
            ✕
        </button>
    `;

    let navButtons = `
        <div class="wizardNav">

            ${step > 0
                ? `<button class="tilbageBtn" onclick="prevStep()">Tilbage</button>`
                : `<div></div>`
            }

            ${step < 4
                ? `<button class="naesteBtn" onclick="nextStep()">Næste</button>`
                : `<button class="naesteBtn" onclick="gemAfstemning()">Opret</button>`
            }

        </div>
    `;



    // STEP 0
    if (step === 0) {

        c.innerHTML = `
            ${closeBtn}
            ${progress}

            <h3>Vælg en titel</h3>

            <input id="titelInput" value="${tempData.titel || ""}">

            ${navButtons}
        `;
    }



    // STEP 1
    if (step === 1) {

        c.innerHTML = `
            ${closeBtn}
            ${progress}

            <h3>Skriv en beskrivelse</h3>

            <textarea id="beskrivelseInput">${tempData.beskrivelse || ""}</textarea>

            ${navButtons}
        `;
    }



    // STEP 2
    if (step === 2) {

        c.innerHTML = `
            ${closeBtn}
            ${progress}

            <h3>Vælg tidspunkt og dato</h3>

            <span>Hvornår skal afstemningen åbne?</span>

            <input type="datetime-local" 
                   id="startInput" 
                   value="${tempData.start || ""}">

            <br><br>

            <span>Hvornår skal afstemningen lukke?</span>

            <input type="datetime-local" 
                   id="slutInput"
                   value="${tempData.slut || ""}">

            ${navButtons}
        `;
    }



    // STEP 3
    if (step === 3) {

        c.innerHTML = `
            ${closeBtn}
            ${progress}

            <h3>Vælg svar muligheder</h3>

            <input id="svarInput">

            <button 
                onclick="tilfoejSvar()"
                style="border:none; background:lightgray; padding:1%; cursor:pointer;">
                Tilføj
            </button>

            <ul id="liste"></ul>

            <br>

            <label>
                <input type="checkbox" id="friTekst"
                    ${tempData.friTekst ? "checked" : ""}>
                Tillad fri tekst
            </label>

            ${navButtons}
        `;

        opdaterListe();
    }



    // STEP 4
    if (step === 4) {

        c.innerHTML = `
            ${closeBtn}
            ${progress}

            <h3>Synlighed</h3>

            <select id="synlighedInput">

                <option value="alle"
                    ${tempData.synlighed === "alle" ? "selected" : ""}>
                    Alle
                </option>

                <option value="medlemmer"
                    ${tempData.synlighed === "medlemmer" ? "selected" : ""}>
                    Medlemmer
                </option>

            </select>

            ${navButtons}
        `;
    }
}




function nextStep() {

    // STEP 0
    if (step === 0) {

        let v = document.getElementById("titelInput").value.trim();

        if (!v) {
            alert("Du skal indtaste en titel");
            return;
        }

        tempData.titel = v;
    }



    // STEP 1
    if (step === 1) {

        let v = document.getElementById("beskrivelseInput").value.trim();

        if (!v) {
            alert("Du skal skrive en beskrivelse");
            return;
        }

        tempData.beskrivelse = v;
    }



    // STEP 2
    if (step === 2) {

        let start = document.getElementById("startInput").value;
        let slut = document.getElementById("slutInput").value;

        if (!start || !slut) {

            alert("Du skal vælge både start og slut tidspunkt");
            return;
        }

        if (new Date(start) >= new Date(slut)) {

            alert("Start skal være før slut");
            return;
        }

        tempData.start = start;
        tempData.slut = slut;
    }



    // STEP 3
    if (step === 3) {

        if (!tempData.svar || tempData.svar.length === 0) {

            alert("Du skal tilføje mindst én svar mulighed");
            return;
        }

        tempData.friTekst =
            document.getElementById("friTekst").checked;
    }


    step++;
    visStep();
}




function prevStep() {

    if (step > 0) {

        step--;
        visStep();
    }
}




function tilfoejSvar() {

    if (!tempData.svar) {
        tempData.svar = [];
    }

    let v = document.getElementById("svarInput").value.trim();

    if (!v) return;

    tempData.svar.push(v);

    document.getElementById("svarInput").value = "";

    opdaterListe();
}




function opdaterListe() {

    let ul = document.getElementById("liste");

    ul.innerHTML = "";

    tempData.svar.forEach(s => {

        let li = document.createElement("li");

        li.textContent = s;

        ul.appendChild(li);
    });
}




function gemAfstemning() {
    tempData.synlighed = document.getElementById("synlighedInput").value;
    
    // REDIGER
    if (editId) {
        currentUser.redigerAfstemning(editId, tempData);
    }
    // OPRET
    else {
        currentUser.opretAfstemning(tempData);
    }

    document.getElementById("wizardContainer_id").style.display = "none";
    document.getElementById("opretAfstemning_id").style.display = "block";
    document.getElementById("afstemningContainer_id").style.display = "block";
    visAfstemninger();
}




function visAfstemninger() {

    let c = document.getElementById("afstemningContainer_id");

    c.innerHTML = "";



    afstemninger.forEach(a => {

        let div = document.createElement("div");

        div.innerHTML = `
            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    padding:2.5%;
                    font-size:80%;
                    background:white;
                    border:2px solid #BFBFBF;
                "

                onmouseover="this.style.backgroundColor='#BFBFBF'"
                onmouseout="this.style.backgroundColor='white'"
            >

                <span>${a.titel}</span>

                <span>Oprettet af: ${a.oprettetAf}</span>

                <span>Status: ${getStatus(a)}</span>

            </div>
        `;

        div.style.marginTop = "5px";
        div.style.padding = "5px";
        div.style.cursor = "pointer";

        div.addEventListener("click", () => {
            visDetaljer(a.id);
        });

        c.appendChild(div);
    });
}




function visDetaljer(id) {

    let a = afstemninger.find(a => a.id === id);

    let c = document.getElementById("detailContainer_id");

    c.style.display = "block";



    let total = 10;



    let svarHtml = a.svar.map(s => {

        let stemmer = Math.floor(Math.random() * total);

        let procent = (stemmer / total) * 100;

        return `
            <div style="margin-bottom:10px;">

                <span>${s} (${stemmer})</span>

                <div style="background:lightgray; height:20px;">

                    <div
                        style="
                            background:blue;
                            height:20px;
                            width:${procent}%;
                        ">
                    </div>

                </div>

            </div>
        `;
    }).join("");



    c.innerHTML = `
        <button class="lukBtn" onclick="lukDetaljer()">✕</button>

        <h3>${a.titel}</h3>

        <p>${a.beskrivelse}</p>

        <p>Åbner: ${a.start}</p>

        <p>Lukker: ${a.slut}</p>

        <br>

        <span>Status: ${getStatus(a)}</span>

        <br><br>

        ${svarHtml}

        <div style="margin-top:15px;">

            <button
                onclick="startRediger(${a.id})"
                style="
                    background:lightgray;
                    border:none;
                    padding:1.5%;
                    cursor:pointer;
                ">
                Rediger
            </button>

            <button
                onclick="sletAfstemning(${a.id})"
                style="
                    background:lightgray;
                    border:none;
                    padding:1.5%;
                    cursor:pointer;
                ">
                Slet
            </button>

            <button
                onclick="afslut(${a.id})"

                ${getStatus(a) === "Afsluttet"
                    ? "disabled"
                    : ""
                }

                style="
                    background:lightgray;
                    border:none;
                    padding:1.5%;
                    cursor:pointer;
                ">
                Afslut
            </button>

        </div>
    `;
}




function startRediger(id) {

    let a = afstemninger.find(a => a.id === id);

    editId = id;

    step = 0;

    tempData = { ...a };

    document.getElementById("wizardContainer_id").style.display = "block";

    visStep();
}




function sletAfstemning(id) {

    currentUser.sletAfstemning(id);

    visAfstemninger();

    document.getElementById("detailContainer_id").style.display = "none";
}




function afslut(id) {

    currentUser.afslutAfstemning(id);

    visAfstemninger();

    visDetaljer(id);
}




function lukWizard() {

    document.getElementById("wizardContainer_id").style.display = "none";

    document.getElementById("opretAfstemning_id").style.display = "block";

    document.getElementById("afstemningContainer_id").style.display = "block";
}




function lukDetaljer() {

    document.getElementById("detailContainer_id").style.display = "none";
}