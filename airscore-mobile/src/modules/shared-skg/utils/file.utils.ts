import {Subject} from "rxjs";

export class FileUtils {

  fileContent: Subject<string | ArrayBuffer | null> = new Subject();

  readFileTxtUtil(file: File) {
    let read: string | ArrayBuffer | null = '';
    let fileReader: FileReader = new FileReader();
    let self: FileUtils = this;
    fileReader.onloadend = function(x) {
      self.fileContent.next(fileReader.result);
    }
    fileReader.readAsText(file);
  }

}
