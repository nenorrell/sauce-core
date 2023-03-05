import { Sauce, Controller } from "../../../core";

export class TestController extends Controller {
    constructor(Sauce :Sauce) {
        super(Sauce);
    }

    public index() :any {
        return this.responses.responseText(200, "success");
    }
}
