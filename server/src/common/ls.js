import { promises as fs } from "fs";

import { parseXLSX } from "../ftp/index.js";
import { sendNotification } from "../routes/tg-notifications.js";

export const readLSCatalogFile = async () => {
  const localPath = `./additional_files/LS.xlsx`;
  try {
    const file = await fs.readFile(localPath);
    const results = await parseXLSX(file);
    return results;
  } catch (err) {
    sendNotification(`readLSCatalogFile Error: ${err}`);
    return false;
  }
};
