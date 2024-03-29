import ExcelJS from "exceljs";
import { parseISO, addMilliseconds } from "date-fns";
import { getTimezoneOffset } from "date-fns-tz";
import { readPostFeedDataJSONFile } from "./utils.js";
require("dotenv").config();

const domainURL = process.env.DOMAINURL;
const groupURL = `/group/${process.env.GROUP}`;
// This date calculation is used because excel doesn't handle dates w/timezone offsets.
const systemTimeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
const offset = getTimezoneOffset(systemTimeZone);

export default async () => {
  const dataJSON = await readPostFeedDataJSONFile("./postFeedData.json");
  const dataLength = dataJSON.feed.length + 1;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`Movie Data`);
  worksheet.columns = [
    { header: "Movie", key: "movie", width: 42 },
    { header: "Price", key: "price", width: 14 },
    { header: "Link", key: "link", width: 12 },
    { header: "Posted", key: "posted", width: 19 },
    { header: "Seller", key: "seller", width: 18 },
  ];
  dataJSON.feed.forEach((item, idx) => {
    worksheet.addRow({
      movie: item.text,
      price: item.cost,
      link: {
        text: "Link",
        hyperlink: `${domainURL}${groupURL}/members/profile/${
          dataJSON.postItems.get(item.postItemId)!.userId
        }`,
      },
      posted: addMilliseconds(
        parseISO(dataJSON.postItems.get(item.postItemId)!.createdAt.toString()),
        offset
      ),
      seller: dataJSON.users.get(
        dataJSON.postItems.get(item.postItemId)!.userId
      )!.name,
    });

    worksheet.getCell(`A${idx + 2}`).alignment = {
      vertical: "middle",
      horizontal: "left",
    };
    worksheet.getCell(`B${idx + 2}`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(`C${idx + 2}`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(`D${idx + 2}`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    worksheet.getCell(`D${idx + 2}`).numFmt = "m/d/yy h:mm AM/PM";
    worksheet.getCell(`E${idx + 2}`).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
  });
  worksheet.getCell("A1").alignment = { horizontal: "center" };
  worksheet.getCell("A1").font = { bold: true };
  worksheet.getCell("B1").alignment = { horizontal: "center" };
  worksheet.getCell("B1").font = { bold: true };
  worksheet.getCell("C1").alignment = { horizontal: "center" };
  worksheet.getCell("C1").font = { bold: true };
  worksheet.getCell("D1").alignment = { horizontal: "center" };
  worksheet.getCell("D1").font = { bold: true };
  worksheet.getCell("E1").alignment = { horizontal: "center" };
  worksheet.getCell("E1").font = { bold: true };
  worksheet.autoFilter = `A1:E${dataLength}`;
  worksheet.views = [{ state: "frozen", ySplit: 1, zoomScale: 150 }];
  await workbook.xlsx.writeFile("MovieData.xlsx");
  process.stdout.write(`\nExcel File Created!\n`);
};
