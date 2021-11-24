import { Apollo, Controller } from "../../../core";

export class TestController extends Controller {
    constructor(Apollo :Apollo) {
        super(Apollo);
    }

    public index() :any {
        return this.responses.responseText(200, "success");
    }
}
