// import qrcode, { QRCodeToFileOptions } from "qrcode";
// import fs from "fs";
//
// export const getQRcodeImage = async (data: string, id: string, dir: string = "./tmp/qr/user"): Promise<string> => {
//     const opts: QRCodeToFileOptions = {
//         errorCorrectionLevel: "H",
//         type: "png",
//         margin: 3,
//         color: {
//             dark: "#000",
//             light: undefined,
//         },
//     };
//
//     try {
//         fs.mkdirSync(dir);
//     } catch (e) {
//     }
//
//     const path = `${dir}/${id}.png`;
//     await qrcode.toFile(path, data, opts);
//
//     return path;
//
// };
