import Jsftp from "jsftp";
import Papa from "papaparse";
import { createReadStream, mkdirSync, existsSync, createWriteStream } from "fs";
import path from "path";

import { config } from "dotenv";
config();

const Ftp = new Jsftp({
  host: process.env.HH_FTP_HOST,
  port: 21,
  user: process.env.HH_FTP_USERNAME,
  pass: process.env.HH_FTP_PASSWORD,
});

Ftp.on("error", (err) => {
  console.error("FTP error:", err);
});

const remotePath = "/master.csv";
const localPath = "./inventory_updates/hh_updates.csv";

const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => resolve(results),
      error: (err) => reject(err),
    });
  });
};

export const fetchAndParseFile = async () => {
  try {
    const dir = path.dirname(localPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    if (!existsSync(localPath)) {
      // Попробуйте скачать файл
      try {
        console.log("Attempting to download file...");
        Ftp.get(remotePath, (err, socket) => {
          if (err) {
            console.error("There was an error retrieving the file.", err);
            return;
          }

          const fileStream = createWriteStream(localPath);

          socket.on("data", (data) => {
            fileStream.write(data);
          });

          socket.on("close", (err) => {
            if (err)
              console.error("There was an error retrieving the file.", err);
            fileStream.close();
            console.log("File copied successfully!");
          });

          socket.resume();
        });
      } catch (err) {
        console.error("An error occurred while downloading the file:", err);
        return;
      }
    }
    // Прочитать файл CSV
    const file = createReadStream(localPath);
    const results = await parseCSV(file);

    return results.data;
  } catch (err) {
    console.error("An error occurred:", err);
  }
};
