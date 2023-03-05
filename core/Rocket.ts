import {green, yellow} from "chalk";
import { SauceConfig } from "./resources/SauceConfig";
import { log } from "./Logger";

export class Rocket {
    constructor(protected config :SauceConfig) {}

    public launch() {
        return log(this.config, "debug", `${green(`
       ^
      / \\
     /___\\
    |=   =|
    |  A  |
    |  P  |
    |  O  |
    |  L  |
    |  L  |
    |  O  |
   /|##!##|\\
  / |##!##| \\
 /  |##!##|  \\
|  / ${yellow("( | )")} \\  |
| /  ${yellow("( | )")}  \\ |
|/   ${yellow("( | )")}   \\|`)}${yellow(`
    ((   ))
   ((  :  ))
   ((  :  ))
    ((   ))
     (( ))
      ( )
       .
       `)}`);
    }
}
