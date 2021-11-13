import {green, yellow} from "chalk";
import { ApolloConfig } from "./resources/ApolloConfig";
import { log } from "./Logger";

export class Rocket {
    constructor(protected config :ApolloConfig) {}

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
