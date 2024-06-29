import { impartApp } from "../../main";

class FileMessenger {
  public fileIndexed(amountIndexed: number, total: number) {
    impartApp.mainWindow?.webContents.send("file/fileIndexed", {
      amountIndexed,
      total,
    });
  }
}

export const fileMessenger = new FileMessenger();
