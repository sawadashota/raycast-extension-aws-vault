import { BrowserName } from "./types";
import { exec } from "child_process";
import { showToast, ToastStyle } from "@raycast/api";

interface BrowserConfig {
  name: BrowserName;
  entrypoint: string;
}

export class Browser {
  readonly entrypoint: string;
  readonly browser: string;
  readonly profileArgFunc: (profile: string) => string;

  constructor(config: BrowserConfig) {
    this.browser = config.name;
    this.entrypoint = config.entrypoint;
    switch (config.name) {
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
        throw Error(`unknown browser: ${config.name}`);
    }
  }

  public open(profile: string): void {
    exec(`${this.entrypoint} login ${profile} --stdout`, (error, stdout, stderr) => {
      if (error) {
        showToast(
          ToastStyle.Failure,
          "Error while running aws-vault login",
          error.message,
        );
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
