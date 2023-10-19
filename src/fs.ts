import { join } from "node:path";
import { readFile, readdirSync, statSync } from "node:fs";
import { promisify } from "node:util";

export const readFileAsync = promisify(readFile);

export function walkFiles(
  directoryPath: string,
  callback: (filePath: string) => void
) {
  const files = readdirSync(directoryPath);
  files.forEach((file) => {
    const filePath = join(directoryPath, file);

    const stats = statSync(filePath);
    if (stats.isDirectory()) {
      walkFiles(filePath, callback);
    } else {
      callback(filePath);
    }
  });
}

export function readdirDeepSync(path: string): string[] {
  const paths: string[] = [];
  walkFiles(path, (filePath) => {
    paths.push(filePath);
  });

  return paths;
}
