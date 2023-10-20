import { CommandModule } from "yargs";
import { JsonObject } from "type-fest";

import { readdirDeepSync } from "../fs";
import { parseFile, getLocation } from "../parser";
import { isJsonArray, isJsonObject } from "../types";
import { applyMergeProps } from "../merge-props";
import { writeFileSync } from "fs";

const compilePrefix = "0__compiled__";

const command: CommandModule = {
  command: "compile",
  describe: "Compile all content files into a single prefixed file",
  handler: async () => {
    const files = readdirDeepSync(process.cwd())
      .filter((x) => x.endsWith(".json") && !x.startsWith(compilePrefix))
      .sort();
    console.log("Found", files.length, "files");

    const entityData = new Map<string, Map<string, JsonObject>>();
    function getEntitiesByType(type: string): Map<string, JsonObject> {
      if (!entityData.has(type)) {
        entityData.set(type, new Map());
      }
      return entityData.get(type)!;
    }

    for (const file of files) {
      console.log(file);
      const root = await parseFile(file);
      if (!isJsonObject(root)) {
        throw new Error(`${file}: Root must be an object.`);
      }

      const [type, additional] = Object.keys(root);
      if (additional !== undefined) {
        throw new Error(
          `${file}: Only one type of entity should be in each file.`
        );
      }

      const entities = getEntitiesByType(type);

      const entitiesInFile = root[type];
      if (!isJsonArray(entitiesInFile)) {
        throw new Error(`${file}: Entities must be in an array.`);
      }

      for (const entity of entitiesInFile) {
        const location = getLocation(entity as any)?.startLine ?? "<unknown>";

        if (!isJsonObject(entity)) {
          throw new Error(`${file}: Entity at ${location} must be an object.`);
        }

        const id = entity.id;
        if (typeof id !== "string" || id === "") {
          throw new Error(
            `${file}: Entity at ${location} must have a string id.`
          );
        }

        console.log(`-- ${id}`);
        if (!entities.has(id)) {
          entities.set(id, entity);
        } else {
          const previous = entities.get(id)!;
          const merged = applyMergeProps(previous, entity) as JsonObject;
          entities.set(id, merged);
        }
      }
    }

    for (const entityType of entityData.keys()) {
      let entityStr = `{\"${entityType}\": [`;
      for (const entity of entityData.get(entityType)!.values()) {
        entityStr += JSON.stringify(entity, null, 2) + "\n";
      }
      entityStr += "]}";

      writeFileSync(`${compilePrefix}${entityType}.json`, entityStr);
    }
  },
};

export default command;
