import * as fs from "fs";
import { promisify } from "util";
import stream from "stream";
import path from "path";
import axios from "axios";


export function checkFileExists(filepath) {
    return new Promise((resolve, reject) => {
        fs.access(filepath, fs.constants.F_OK, error => {
            resolve(!error);
        });
    });
}

export const getFileFromURL = async (fileUrl: string) => {
    const dir = "./tmp/downloads/";
    try {
        fs.mkdirSync(path.resolve(dir));
    } catch (e) {
    }

    const originalName = decodeURIComponent(decodeURI(path.basename(fileUrl)))
        .split("?")[0];

    const extension = originalName.split(".").pop() || null;

    const filePath = path.resolve(dir, originalName);
    if (await checkFileExists(filePath)) {
        return filePath;
    }

    const fileStream = fs.createWriteStream(filePath);

    await axios({
        method: "get",
        url: fileUrl,
        responseType: "stream",
    }).then((response) => {
        response.data.pipe(fileStream);
        return promisify(stream.finished)(fileStream);
    });
    return filePath;
};
