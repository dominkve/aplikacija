async function getData(PATH) {
    try {
        const response = await fetch(PATH);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
}

async function main() {
    const ID = localStorage.getItem("idPrograma");

    const programi = await getData("../public/programi.json");
    const bodovi = await getData("../public/bodovi.json");
    const prijave = await getData("../public/broj_prijava.json");

    const program = programi.filter((obj) => {
        return obj.idPrograma == ID;
    })[0];

    console.log(program)
    document.querySelector("h1.title").innerHTML = program.naziv;

    document.querySelector("div.card.bodovi > p").innerHTML= bodovi[`${program.naziv}, ${program.mjesto}`];
    document.querySelector("div.card.prijave > p").innerHTML = prijave.filter((obj) => {
        return obj.Studij == program.naziv && obj.Mjesto == program.mjesto;
    })[0]["Broj prijava"];
    console.log()
}

main();