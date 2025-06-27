import {FileService} from './file-service';
import * as fs from 'fs';

jest.mock('fs', () => ({
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
}));
jest.mock('path', () => ({
  join: jest.fn(),
}));

type FileServiceFake = {
  readonly drawIoFileExtension: string;
  getContentFromFiles(directory: string): string[];
  getAllChartFiles(directory: string): string[];
  collectChartFiles(directory: string, entry: fs.Dirent, files: string[]): void;
  isDrawIoFile(entry: fs.Dirent): boolean;
};

describe('FileService', () => {
  let fileService: FileServiceFake;

  beforeEach(
    () => (fileService = new FileService() as unknown as FileServiceFake),
  );

  describe('getContentFromFiles', () => {
    it('should get no content if no files are found', () => {
      jest.spyOn(fileService, 'getAllChartFiles').mockReturnValue([]);
      const readFileSyncSpy = jest.spyOn(fs, 'readFileSync');

      const result = fileService.getContentFromFiles('');

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
      expect(readFileSyncSpy).not.toHaveBeenCalled();
    });

    it('should get contents if files are found', () => {
      jest.spyOn(fileService, 'getAllChartFiles').mockReturnValue(['', '']);
      const readFileSyncSpy = jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue('');

      const result = fileService.getContentFromFiles('');

      expect(result).toEqual(['', '']);
      expect(result.length).toBe(2);
      expect(readFileSyncSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('getAllChartFiles', () => {
    it('should return an empty array if no files are found in the directory', () => {
      jest.spyOn(fs, 'readdirSync').mockReturnValue([]);

      const files = fileService.getAllChartFiles('');

      expect(files).toHaveLength(0);
    });

    it('should return files if files are found in the directory', () => {
      const mockDirent = {
        name: 'test.drawio',
      } as unknown as fs.Dirent<Buffer>;

      jest.spyOn(fs, 'readdirSync').mockReturnValue([mockDirent]);
      const collectChartFilesSpy = jest
        .spyOn(fileService, 'collectChartFiles')
        .mockImplementation(jest.fn());

      const files = fileService.getAllChartFiles('');

      expect(files).toHaveLength(0);
      expect(collectChartFilesSpy).toHaveBeenCalled();
    });
  });

  describe('collectChartFiles', () => {
    it('should not collect any charts if only directories and no drawio files are found', () => {
      const files: string[] = [];
      const direntMock = {
        name: 'test.drawio',
        isDirectory: jest.fn().mockReturnValue(false),
      } as unknown as fs.Dirent;

      jest.spyOn(fileService, 'isDrawIoFile').mockReturnValue(false);

      fileService.collectChartFiles('', direntMock, files);

      expect(files).toHaveLength(0);
    });

    it('should collect one chart if one drawio file is found', () => {
      const files: string[] = [];
      const mockEntry = {
        name: 'test.drawio',
        isDirectory: jest.fn().mockReturnValue(false),
      } as unknown as fs.Dirent;

      jest.spyOn(fileService, 'isDrawIoFile').mockReturnValue(true);

      fileService.collectChartFiles('', mockEntry, files);

      expect(files).toHaveLength(1);
    });

    it('should collect multiple charts if a directory contains two drawio files', () => {
      const files: string[] = [];
      const mockEntry = {
        name: 'test.drawio',
        isDirectory: jest.fn().mockReturnValue(true),
      } as unknown as fs.Dirent;

      jest.spyOn(fileService, 'getAllChartFiles').mockReturnValue(['', '']);

      fileService.collectChartFiles('', mockEntry, files);

      expect(files).toHaveLength(2);
    });
  });

  describe('isDrawIoFile', () => {
    it('should return false if entry is not a file', () => {
      const mockEntry = {
        name: 'test.drawio',
        isFile: jest.fn().mockReturnValue(false),
      } as unknown as fs.Dirent;

      const result = fileService.isDrawIoFile(mockEntry);

      expect(result).toEqual(false);
    });

    it('should return false if entry is a file but does not have a drawio extension', () => {
      const mockEntry = {
        name: 'test.txt',
        isFile: jest.fn().mockReturnValue(true),
      } as unknown as fs.Dirent;

      const result = fileService.isDrawIoFile(mockEntry);

      expect(result).toEqual(false);
    });

    it('should return true if entry is a file with drawio extension', () => {
      const mockEntry = {
        name: 'test.drawio',
        isFile: jest.fn().mockReturnValue(true),
      } as unknown as fs.Dirent;

      const result = fileService.isDrawIoFile(mockEntry);

      expect(result).toEqual(true);
    });
  });
});
