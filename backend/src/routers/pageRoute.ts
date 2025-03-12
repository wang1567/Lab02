import { Route } from "../abstract/Route"
import { PageController } from '../controller/pageController'
import { Controller } from '../abstract/Controller'

export class PageRoute extends Route{
    
    protected url: string;
    protected Controller = new PageController();

    constructor(){
        super()
        this.url = '/'
        this.setRoutes()
    }

    protected setRoutes(): void {
        this.router.get(`${this.url}`,(req, res)=>{
            this.Controller.sendPage(req, res);
        })
    }

}