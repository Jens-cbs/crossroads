let afstemninger = [];


class Afstemning {

    constructor(
        id,
        titel,
        beskrivelse,
        start,
        slut,
        oprettetAf,
        svar,
        friTekst,
        synlighed
    ) {

        this.id = id;
        this.titel = titel;
        this.beskrivelse = beskrivelse;
        this.start = start;
        this.slut = slut;
        this.oprettetAf = oprettetAf;
        this.svar = svar;
        this.friTekst = friTekst;
        this.synlighed = synlighed;
        this.afsluttet = false;
    }


    redigerAfstemning(titel, beskrivelse, start, slut, svar) {

        if (titel) {
            this.titel = titel;
        }

        if (beskrivelse) {
            this.beskrivelse = beskrivelse;
        }

        if (start) {
            this.start = start;
        }

        if (slut) {
            this.slut = slut;
        }

        if (svar) {
            this.svar = svar;
        }
    }


    afslutAfstemning() {
        this.afsluttet = true;
    }
}



class Medarbejder {

    constructor(navn) {
        this.navn = navn;
    }


    opretAfstemning(data) {

        let nyAfstemning = new Afstemning(
            Date.now(),
            data.titel,
            data.beskrivelse,
            data.start,
            data.slut,
            this.navn,
            data.svar || [],
            data.friTekst || false,
            data.synlighed
        );

        afstemninger.push(nyAfstemning);

        return nyAfstemning;
    }


    redigerAfstemning(id, data) {

        let a = afstemninger.find(a => a.id === id);

        if (!a) return;

        a.redigerAfstemning(
            data.titel,
            data.beskrivelse,
            data.start,
            data.slut,
            data.svar
        );
    }


    sletAfstemning(id) {

        afstemninger = afstemninger.filter(a => a.id !== id);
    }


    afslutAfstemning(id) {

        let a = afstemninger.find(a => a.id === id);

        if (!a) return;

        a.afslutAfstemning();
    }
}


// "Logget ind" medarbejder
let currentUser = new Medarbejder("Jonas");