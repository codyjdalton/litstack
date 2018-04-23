import * as express from "express";

class Service {

    public app;

    constructor() {
        this.onInit();
    }
    
    /**
     * @function onInit
     * Initialize the application
     */
    private onInit(): void {
        this.app = express();
        this.app.listen(8000, () => console.log("Server running on 8000!"));
    }
}