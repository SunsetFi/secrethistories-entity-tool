#!/usr/bin/env node
import { join } from "node:path";

import yargs from "yargs";

import { hideBin } from "yargs/helpers";

yargs(hideBin(process.argv))
  .scriptName("shet")
  .commandDir(join(__dirname, "./commands"), {
    visit(commandObject, pathToFile, filename) {
      return commandObject.default;
    },
  })
  .demandCommand()
  .help().argv;
