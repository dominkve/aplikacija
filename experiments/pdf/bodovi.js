import { PDFParse } from "pdf-parse";
import axios from "axios";
import fs from "fs";

async function extractText(buffer) {
    const uint8Array = new Uint8Array(buffer);
    const parser = new PDFParse({data: uint8Array});
    const text = parser.getText();

    return text;
}

async function getPDF() {
    const PDFUrl = "https://www.srednja.hr/app/uploads/2025/01/Bodovni-pragovi-za-upis-na-fakultete-u-2024-35-51.pdf";
    try {
        console.log("Downloading PDF...");
        const response = await axios({
            method: 'GET',
            url: PDFUrl,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/pdf, */*'
            }
        });

        const writer = fs.createWriteStream('Bodovni-pragovi-2024.pdf');
        response.data.pipe(writer);
        
        // Handle completion
        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log('PDF downloaded successfully!');
                resolve();
            });
            writer.on('error', reject);
        });

    } catch (error) {
        console.error('Error downloading PDF:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
    }
}

async function readPDF() {
    const path = "./Bodovni-pragovi-2024.pdf";
    return new Promise((resolve, reject) => {
        const chunks = [];
        const stream = fs.createReadStream(path);

        stream.on("data", (chunk) => {
            chunks.push(chunk);
        });

        stream.on("end", () => {
            const buffer = Buffer.concat(chunks);
            resolve(buffer);
        });

        stream.on("error", (error) => {
            reject(error);
        });
    });
}

async function clean_string(string) {
    let lines = string.split("\n");
    lines.shift();
    
    lines.forEach((line) => {
        if (line.search("--") !== -1) {
            let i = lines.indexOf(line);
            lines.splice(i, 1);
        };
    });

    lines = lines.filter(line => line !== "");

    return lines;
}

async function make_json(string) {
    let lines = await clean_string(string); // actualy returns an array caus eidk
    
    let bodovi = {};
    lines.forEach((line) => {
        let start = line.search(/\d/);

        let key = line.substring(0, start);
        let value = line.substring(start);

        bodovi[key] = value;
    });

    return JSON.stringify(bodovi, null, 2);
}

async function main() {
    const path = './Bodovni-pragovi-2024.pdf';
    if (fs.existsSync(path)) {
        console.log('File exists');
    } else {
        console.log('File does not exist');
        await getPDF();
    }

    const PDFBuffer = await readPDF()
        .then((buffer) => {
            console.log("Read pdf of", buffer.length, "length.");
            return buffer;
        })
        .catch((error) => {
            console.log("Error reading pdf: ", error);
        })

    const PDFText = await extractText(PDFBuffer);
    let PDFString = PDFText.text;

    const json = await make_json(PDFString);
    fs.writeFile("./bodovi.json", json, "utf8", () => {
        console.log("Wrote to ./bodovi.json");
    });
}


main();