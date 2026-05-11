export const config = {
  api: {
    bodyParser: false,
  },
};

import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    const file = files.file;

    const dataBuffer = fs.readFileSync(file.filepath);
    const pdf = await pdfParse(dataBuffer);

    const text = pdf.text;

    const filmsMatch = text.match(/Film Title:(.*)/);
    const films = filmsMatch ? filmsMatch[1].split(",") : [];

    const termMatch = text.match(/(\d+).*years/);
    const term = termMatch ? termMatch[1] : null;

    res.json({
      films: films.map(f => f.trim()),
      term: term,
      raw: text.slice(0, 1000)
    });
  });
}
