import { readdirSync } from "fs";
import { join } from "path";
import inquirer from "inquirer";
import { spawn } from "child_process";

const scriptsDir = join(__dirname, ".");
const files = readdirSync(scriptsDir).filter(f => f.endsWith(".ts"));

async function main() {
  const { selectedScript } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedScript",
      message: "Which script do you want to run?",
      choices: files,
    },
  ]);

  const scriptPath = join(scriptsDir, selectedScript);
  const child = spawn("pnpm", ["tsx", scriptPath], { stdio: "inherit" });

  child.on("close", (code) => {
    console.log(`\n✅ Script finished with exit code ${code}`);
  });
}

main();
