import { app as appConfig, isProd } from "@zerp/global-configs";
import v8 from "v8";
import path from "path";
import fs from "fs";

/**
 * Creates a heap snapshot and saves it to a file.
 *
 * The snapshot file is saved in the `./tmp/heapdump` directory within the application's root directory.
 * The filename ends with `.heapsnapshot` to ensure compatibility with Chrome DevTools.
 *
 * @returns {string} The file path of the created heap snapshot.
 */
function createHeapSnapshot(): string {
    const snapshotStream = v8.getHeapSnapshot();
    // It's important that the filename end with `.heapsnapshot`,
    // otherwise Chrome DevTools won't open it.
    const dir = path.resolve(appConfig.rootDir, "./tmp/heapdump");
    fs.mkdirSync(dir, { recursive: true });
    const fileName = path.join(dir, `./snapshot-${Date.now()}.heapsnapshot`);
    const fileStream = fs.createWriteStream(fileName);
    snapshotStream.pipe(fileStream);
    return fileName;
}

export {
    createHeapSnapshot,
};
