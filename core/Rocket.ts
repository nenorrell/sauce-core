import {green, yellow} from 'chalk';

export class Rocket {
    public launch() {
        return `${green(`
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
|  / ${yellow(`( | )`)} \\  |
| /  ${yellow(`( | )`)}  \\ |
|/   ${yellow(`( | )`)}   \\|`)}${yellow(`
    ((   ))
   ((  :  ))
   ((  :  ))
    ((   ))
     (( ))
      ( )
       .
       `)}`;
    }
}
