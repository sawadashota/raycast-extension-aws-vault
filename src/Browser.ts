import { BrowserName } from "./types";
import { exec } from "child_process";

export class Browser {
  readonly browser: string;
  readonly profileArgFunc: (profile: string) => string;

  constructor(name: BrowserName) {
    this.browser = name;
    switch (name) {
      case "Google Chrome":
        this.profileArgFunc = (profile) =>
          `--user-data-dir=$HOME/Library/Application\\ Support/Google/Chrome/aws-vault/${profile}`;
        break;
      case "firefox":
        this.profileArgFunc = (profile) =>
          `--profile $HOME/Library/Application\\ Support/Firefox/Profiles/aws-vault/${profile}`;
        break;
      case "Brave Browser":
        this.profileArgFunc = (profile) =>
          `--user-data-dir=$HOME/Library/Application\\ Support/BraveSoftware/Brave-Browser/aws-vault/${profile}`;
        break;
      default:
        throw Error(`unknown browser: ${name}`);
    }
  }

  public open(profile: string): void {
    exec(`aws-vault login ${profile} --stdout`, (error, stdout, stderr) => {
      if (error) {
        console.error(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      exec(`open -na "${this.browser}" --args ${this.profileArgFunc(profile)} "${stdout}"`, console.log);
    });
  }
}
