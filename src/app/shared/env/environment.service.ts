import { Injectable } from "@angular/core";
import { environment as localEnv} from "../../../environments/environment";

@Injectable()
export class EnvironmentService{

    env: Environment;

    constructor(){

        const serverEnv = (window as any).environment;
        if (serverEnv){
            this.env = new Environment(serverEnv);
        }else {
            this.env = new Environment(localEnv);
        }
    }
}

export class Environment {
    id: string
    name: string
    backendUrl: string
    apiUrl: string
    swaggerUrl: string
    swaggerJsonUrl: string
    productionUrl: string
    preproductionUrl: string

    constructor(environment: any){
        this.id = environment.id;
        this.name = environment.name;
        this.backendUrl = environment.backendUrl;
        this.apiUrl = environment.backendUrl + '/api';
        this.swaggerUrl = environment.backendUrl + '/swagger-ui.html';
        this.productionUrl = environment.productionUrl;
        this.preproductionUrl = environment.preproductionUrl;
    }
}