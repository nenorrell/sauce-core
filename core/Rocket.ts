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
    |  S  |
    |  A  |
    |  U  |
    |  C  |
    |  E  |
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
