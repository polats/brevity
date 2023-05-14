import { Anchor } from "../anchor";
import { Switch } from "../switch";

export const Footer = () => (
  <footer className="flex flex-col">
    <Switch />
    <div className="text-sm px-1.5">
      <Anchor href="https://github.com/polats/brevity">
        Source on github
      </Anchor>
      <span> | </span>
      <Anchor href="https://github.com/polats/brevity/issues/new/choose">
        report an issue
      </Anchor>
    </div>
  </footer>
);
