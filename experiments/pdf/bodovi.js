import PDFParser from "pdf2json";
import axios from "axios";
import fs from "fs";

async function extractText(filePath) {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(this, 1);

        pdfParser.on("pdfParser_dataError", (errData) => {
            console.error("PDF Parse Error:", errData.parserError);
            reject(errData.parserError);
        });

        pdfParser.on("pdfParser_dataReady", (pdfData) => {
            console.log("Data ready. Extracting text...");

            let text = "";

            text = pdfParser.getRawTextContent();
            
            resolve(text);
        });

        console.log(`Loadinf PDF: ${filePath}`);
        pdfParser.loadPDF(filePath);
    });
}

async function getPDF(path) {
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

        const writer = fs.createWriteStream(path);
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


async function clean_string(string) {
    let lines = string.split("\n");
    lines.shift(); // remove first line (header)

    lines = lines.filter(line => {
        return line.trim() !== "" && !line.includes("--");
    });

    return lines;
}

async function make_json(string) {
    let lines = await clean_string(string); // actualy returns an array caus eidk
    
    let bodovi = {};
    lines.forEach((line) => {
        const start = line.search(/\d/);

        if (start !== -1) {
            const key = line.substring(0, start);
            let value = line.substring(start);

            bodovi[key.trim()] = value.trim();
        } else {
            bodovi[line.trim()] = "Nema Podataka";
        }
    });

    return JSON.stringify(bodovi, null, 2);
}

async function main() {
    const PDFPath = './Bodovni-pragovi-2024.pdf';
    const JSONPath = "./bodovi.json";

    if (fs.existsSync(PDFPath)) {
        console.log('File exists');
    } else {
        console.log('File does not exist');
        await getPDF(PDFPath);
    }

    try {
        console.log("Extracting text from PDF...");
        const PDFText = await extractText(PDFPath);

        console.log("Extracted text sample:");
        console.log(PDFText.substring(0, 500) + "..."); // Show first 500 chars

        const json = await make_json(PDFText);

        fs.writeFile(JSONPath, json, "utf8", () => {
            console.log("Wrote to", JSONPath);
        });
    } catch (error) {
        console.error("Error exracting text:", error);
    }
}


main();