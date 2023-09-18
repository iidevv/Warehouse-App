import Jsftp from "jsftp";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  mkdirSync,
  existsSync,
  createWriteStream,
  promises as fsPromises,
  createReadStream,
} from "fs";
import path from "path";

import { config } from "dotenv";
import { sendNotification } from "../routes/tg-notifications.js";
config();

// helpers

export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => resolve(results),
      error: (err) => reject(err),
    });
  });
};

export const parseXLSX = async (buffer) => {
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Преобразовать лист в массив объектов
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    return jsonData;
  } catch (error) {
    throw error;
  }
};

// main

export const downloadInventoryFile = async (vendor, fileFormat = "csv") => {
  let remotePath = "";
  let Ftp;

  switch (vendor) {
    case "HH":
      Ftp = new Jsftp({
        host: process.env.HH_FTP_HOST,
        port: 21,
        user: process.env.HH_FTP_USERNAME,
        pass: process.env.HH_FTP_PASSWORD,
      });
      remotePath = `/masterv.csv`;
      break;
    case "LS":
      Ftp = new Jsftp({
        host: process.env.LS_FTP_HOST,
        port: 21,
        user: process.env.LS_FTP_USERNAME,
        pass: process.env.LS_FTP_PASSWORD,
      });
      remotePath = `/Updated Inventory.csv`;
      break;
    default:
      return false;
  }

  if (Ftp) {
    Ftp.on("error", (err) => {
      sendNotification(`${vendor}. FTP error: ${err}`);
    });
  } else {
    return false;
  }

  const localPath = `./inventory_updates/${vendor}_inventory.${fileFormat}`;

  const dir = path.dirname(localPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  // Delete the existing file, if any.
  try {
    if (existsSync(localPath)) {
      await fsPromises.unlink(localPath);
    }
  } catch (err) {
    sendNotification(`File deletion error: ${err}`);
    return false;
  }
  // Continue with the file download.
  try {
    await new Promise((resolve, reject) => {
      Ftp.get(remotePath, (err, socket) => {
        if (err) {
          sendNotification(`1. ${vendor}. DownloadInventoryFile Error: ${err}`);
          reject(err);
          return;
        }

        const fileStream = createWriteStream(localPath);

        socket.on("data", (data) => {
          fileStream.write(data);
        });

        socket.on("close", (err) => {
          if (err) {
            sendNotification(
              `2. ${vendor}. DownloadInventoryFile Error: ${err}`
            );
            reject(err);
          }
          fileStream.close();
          resolve();
        });

        socket.resume();
      });
    });
    return true;
  } catch (err) {
    sendNotification(`3. ${vendor}. DownloadInventoryFile Error: ${err}`);
    return false;
  }
};

export const readInventoryFile = async (vendor, fileFormat = "csv") => {
  const localPath = `./inventory_updates/${vendor}_inventory.${fileFormat}`;
  try {
    const file = createReadStream(localPath);
    const results = await parseCSV(file);
    return results.data;
  } catch (err) {
    sendNotification(`readInventoryFile Error: ${err}`);
    return false;
  }
};
