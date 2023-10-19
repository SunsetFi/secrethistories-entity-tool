import { CommandModule } from "yargs";
import { readdirDeepSync } from "../fs";
import { parseFile } from "../parser/parser";

const command: CommandModule = {
  command: "validate",
  describe: "Validate content files",
  handler: async () => {
    const files = readdirDeepSync(process.cwd()).filter((x) =>
      x.endsWith(".json")
    );
    console.log("Found", files.length, "files");
    for (const file of files) {
      console.log(file);
      await parseFile(file);
    }
  },
};

export default command;
