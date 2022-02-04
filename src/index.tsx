import { ActionPanel, Icon, List, getPreferenceValues } from "@raycast/api";
import React, { useEffect, useState } from "react";
import { exec } from "child_process";
import { BrowserName } from "./types";
import { Browser } from "./Browser";

interface Preferences {
  browserName: BrowserName;
}

export default function Command() {
  const preferences: Preferences = getPreferenceValues();
  const browser = new Browser(preferences.browserName);

  const [profiles, setProfiles] = useState<string[]>([]);
  useEffect(() => {
    exec("aws-vault list", (error, stdout, stderr) => {
      if (error) {
        console.error(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
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
