import {readdirSync, Dirent, readFileSync} from 'fs';
import {join} from 'path';

export class FileService {
  private readonly drawIoFileExtension = '.drawio';

  public getContentFromFiles(directory: string): string[] {
    const files = this.getAllChartFiles(directory);

    return files.map(file => readFileSync(file, 'utf-8'));
  }

  private getAllChartFiles(directory: string): string[] {
    const entries = readdirSync(directory, {withFileTypes: true});
    const files: string[] = [];

    for (const entry of entries) {
      this.collectChartFiles(directory, entry, files);
    }

    return files;
  }

  private collectChartFiles(
    directory: string,
    entry: Dirent,
    files: string[],
  ): void {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...this.getAllChartFiles(fullPath));
    } else if (this.isDrawIoFile(entry)) {
      files.push(fullPath);
    }
  }

  private isDrawIoFile(entry: Dirent): boolean {
    return entry.isFile() && entry.name.endsWith(this.drawIoFileExtension);
  }
}
