import {UseInterceptors, NestInterceptor, ExecutionContext, CallHandler} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";


export class SerializeInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        
        // Run someething before a request is handled
        // by the request handler
        console.log("I'm running before the handler", context)

        return next.handle().pipe(
            map((data: any) => {
                // Run something before the response is ent out
                console.log("I'm running before response is sent out", data)
            })
        )

    }
}