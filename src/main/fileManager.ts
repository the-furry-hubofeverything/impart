import { BrowserWindow, dialog } from "electron";
import { TaggableImage } from "./database/entities/TaggableImage";

class FileManager {
  private browserWindow?: BrowserWindow;

  public setBrowserWindow(w: BrowserWindow) {
    this.browserWindow = w;
  }

  public async indexDirectory() {
    if (!this.browserWindow) {
      throw new Error(
        "Tried to open a file dialog without access to the window"
      );
    }

    const result = dialog.showOpenDialogSync(this.browserWindow, {
      properties: ["openDirectory"],
    });

    console.log("Folder selection:", result);
  }

  public async getFiles() {
    const files = await TaggableImage.find();

    return files.map((f) => f.path);
  }
}

export const fileManager = new FileManager();
