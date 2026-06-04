import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (req,next) => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");

    if(access_token) {
        const clone = req.clone({
            headers: req.headers.set("Authorization",  `Bearer ${access_token}`)
        });
        return next(clone)
    }
    return next(req)

}