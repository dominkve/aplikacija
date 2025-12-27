let ucilista = null;
console.log("Fetching ucilista.json");
fetch("./data/ucilista.json")
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data);
        ucilista = data;
        let selectUcilista = document.getElementById("Ucilista");

        // add default option
        let option = new Option('Sva visoka učilišta', "-1");
        selectUcilista.add(option);

        let name = null;
        let index = 1;
        for (let uciliste in ucilista) {
            console.log(uciliste);
            name = ucilista[uciliste].name;
            
            console.log("Name and id: ", name, uciliste);
            option = new Option(name, uciliste);
            selectUcilista.add(option, index++);
            /*
            // let sastavnice = ucilista[uciliste].sastavnice;
            // console.log(sastavnice);
            for (let sastavnica in sastavnice) {
                console.log(sastavnice[sastavnica]);
                id = sastavnice[sastavnica].id;
                name = sastavnice[sastavnica].name;
                option = new Option(name, value);
                selectUcilista.add(option);
            }
            */
            }
        document.getElementById("search-btn").addEventListener("click", scrapePrograms);
        document.getElementById("VrstaUcilista").addEventListener("change", function () {
            let vrsta = document.getElementById("VrstaUcilista").value;
            console.log("Selected vrsta: ", vrsta);

            let selectUcilista = document.getElementById("Ucilista");
            // clear select element
            selectUcilista.innerHTML = "";

            let ucilista_vrsta = null;
            // Find the new elements by vrsta
            if (vrsta == -1) {
                ucilista_vrsta = ucilista;
            } else {
                ucilista_vrsta =  Object.fromEntries(
                    Object.entries(ucilista).filter(([id, uciliste]) => uciliste.vrsta == vrsta)
                )
            }

            console.log("Ucilista i sastavnice:");
            console.log(ucilista_vrsta);

            // add default option
            let option = new Option('Sva visoka učilišta', "-1");
            selectUcilista.add(option);

            let id = null;
            let name = null;
            let index = 1;
            for (let uciliste in ucilista_vrsta) {
                console.log(uciliste);
                name = ucilista_vrsta[uciliste].name;
                
                console.log("Name and id: ", name, uciliste);
                option = new Option(name, uciliste);
                selectUcilista.add(option, index++);
                /*
                // let sastavnice = ucilista[uciliste].sastavnice;
                // console.log(sastavnice);
                for (let sastavnica in sastavnice) {
                    console.log(sastavnice[sastavnica]);
                    id = sastavnice[sastavnica].id;
                    name = sastavnice[sastavnica].name;
                    option = new Option(name, value);
                    selectUcilista.add(option);
                }
                */
            }
        });
    });

async function scrapePrograms() {
    const proxy = 'https://corsproxy.io/?url=';
    const url = "https://www.postani-student.hr/webservices/Pretraga.svc/PretraziPrograme";
    let payload = {
        Mjesto: "Sva mjesta",
        lista: [],
        page: 1,
        podrucje: "-1",
        polje: "-1",
        posebnaKvota: "-1",
        search: "",
        searchVisokaUcilista: "",
        usporedba: true
    }

const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'X-Requested-With': 'XMLHttpRequest',
    'Referer': 'https://www.postani-student.hr/Ucilista/Nositelji.aspx',
    'Origin': 'https://www.postani-student.hr',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    // Don't include cookies initially - try without first
    // 'Cookie': 'ASP.NET_SessionId=...' // Only add if request fails
};
    

    let TotalPages = null;
    try {
        let vrsta = document.getElementById("VrstaUcilista").value;
        console.log("Vrsta: ", vrsta);
        if (vrsta == -1) {
            let index = 0;
            payload.lista[index++] = vrsta;
            for (let uciliste in ucilista) {
                let sastavnice = ucilista[uciliste].sastavnice;
                console.log(sastavnice);
                for (let sastavnica in sastavnice) {
                    console.log(sastavnice[sastavnica]);
                    payload.lista[index++] = sastavnice[sastavnica].id;
                }
            }
            console.log(payload.lista);
            let original_lista = ["-1","67","71","70","35","249","56","261","51","275","206","10","31","38","59","251","11","286","256","84","205","232","54","290","291","16","37","73","39","108","269","242","103","53","52","278","240","105","63","267","272","89","243","271","293","270","225","83","237","230","216","106","13","28","66","23","44","50","107","32","61","14","65","77","148","47","69","80","36","263","95","109","9","268","210","274","81","29","96","110","265","78","64","294","72","85","262","183","181","21","215","192","184","185","20","186","187","193","255","231","190","180","22","188","189","247","220","194","195","196","191","207","197","254","198","201","199","202","200","203","34","40","182","246","82","93","97","58","12","57","98","62","75","68","112","264","218","99","100","288","25","287","125","223","289","48","49","258","30","239","260","116","113","224","94","114","42","101","117","118","119","292","213","280","136","277","281","144","146","282","147","120","279","122","124","142","126","115","150","152"];
            
            const originalIds = new Set(original_lista);
            const ids = new Set(payload.lista);

            const missing = [...originalIds].filter(id => !ids.has(id));

            const extra = [...ids].filter(id => !originalIds.has(id));

            console.log("Missing: ", missing);
            console.log("Extra: ", extra)
            // for testing, since I get 93 pages, and they get 94
            // payload.lista = ["-1","67","71","70","35","249","56","261","51","275","206","10","31","38","59","251","11","286","256","84","205","232","54","290","291","16","37","73","39","108","269","242","103","53","52","278","240","105","63","267","272","89","243","271","293","270","225","83","237","230","216","106","13","28","66","23","44","50","107","32","61","14","65","77","148","47","69","80","36","263","95","109","9","268","210","274","81","29","96","110","265","78","64","294","72","85","262","183","181","21","215","192","184","185","20","186","187","193","255","231","190","180","22","188","189","247","220","194","195","196","191","207","197","254","198","201","199","202","200","203","34","40","182","246","82","93","97","58","12","57","98","62","75","68","112","264","218","99","100","288","25","287","125","223","289","48","49","258","30","239","260","116","113","224","94","114","42","101","117","118","119","292","213","280","136","277","281","144","146","282","147","120","279","122","124","142","126","115","150","152"]
            console.log(payload);
        } else {
            let index = 0;
            payload.lista[index++] = "-1";
            let ucilista_vrsta = Object.fromEntries(
                Object.entries(ucilista).filter(([id, uciliste]) => uciliste.vrsta == vrsta)
            );
            console.log(ucilista_vrsta)
            for (let uciliste in ucilista_vrsta) {
                let sastavnice = ucilista[uciliste].sastavnice;
                console.log(sastavnice);
                for (let sastavnica in sastavnice) {
                    console.log(sastavnice[sastavnica]);
                    payload.lista[index++] = sastavnice[sastavnica].id;
                }
            }
            console.log(payload.lista);

            let original_lista = ["-1","275","251","148","246","75","292","213","280","277","281","144","146","282","147","126","150"];
            const originalIds = new Set(original_lista);
            const ids = new Set(payload.lista);

            const missing = [...originalIds].filter(id => !ids.has(id));

            const extra = [...ids].filter(id => !originalIds.has(id));

            console.log("Missing: ", missing);
            console.log("Extra: ", extra)
        }
        axios.post(proxy + url, payload)
        .then((response) => {
            console.log("First request!")
            console.log(response.data);
            TotalPages = response.data.d.TotalPages;

        })
    } catch (error) {
        console.log(error);
    }
}