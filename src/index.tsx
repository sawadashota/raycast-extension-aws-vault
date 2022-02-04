import { ActionPanel, Icon, List, Detail, getPreferenceValues } from "@raycast/api";
import React, { useEffect, useState } from "react";
import { exec } from "child_process";
import { BrowserName } from "./types";
import { Browser } from "./Browser";

interface Preferences {
  browserName: BrowserName;
  entrypoint: string;
}

export default function Command() {
  const preferences: Preferences = getPreferenceValues();
  const browser = new Browser({
    name: preferences.browserName,
    ...preferences,
  });

  const [profiles, setProfiles] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  useEffect(() => {
    exec(`${preferences.entrypoint} list`, (error, stdout, stderr) => {
      if (error) {
        console.error(`error: ${error.message}`);
        setErrorMsg(error.message);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        setErrorMsg(stderr);
        return;
      }
      const lines: string[] = stdout.split(/\n/);
      setProfiles(
        lines
          .slice(2)
          .map((v) => v.split(" ")[0])
          .filter((v) => v.match(/^[a-zA-Z0-9]/))
      );
    });
  }, []);

  if (errorMsg !== "") {
    return <Detail markdown={errorMsg} />;
  }

  const onClick = (profile: string) => (): void => browser.open(profile);

  if (profiles.length === 0) {
    return (
      <List>
        <List.Item icon={Icon.Clock} title="Loading...." />
      </List>
    );
  }

  const list: React.ReactElement[] = [];
  profiles.forEach((profile, index) => {
    list.push(
      <List.Item
        key={index}
        icon="management-console.png"
        title={profile}
        actions={
          <ActionPanel>
            <ActionPanel.Item title="Open Browser" onAction={onClick(profile)} />
          </ActionPanel>
        }
      />
    );
  });

  return <List>{list}</List>;
}
