import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable, BehaviorSubject} from 'rxjs';
import {Auth0Service} from '../core/auth0.service';

@Injectable()
export class AuthGuardService implements CanActivate {
    /**
     * Observable for auth status in the form of a BehaviorSubject.
     * It's necessary to be an Observable because of CanActivate interface.
     * @type {BehaviorSubject<boolean>}
     * @private
     */
    private _authGuard$ = new BehaviorSubject<boolean>(false);

    /**
     * Check with Auth0 service if user is authenticated and next that value to our private Subject.
     * @param url URL that user attempted to visit.
     * @returns {BehaviorSubject<boolean>}
     */
    private checkLogin(url: string): Observable<boolean> {
        const status = this._auth0.isAuthenticated();
        this._authGuard$.next(status);

        if (!status) {
            // todo save url and redirect user to that url after login
            this._router.navigate(['/login']);
        }

        return this._authGuard$;
    }

    /**
     * Interface function used by Router to determine if route can be activated.
     * @param route URL that user attempted to visit.
     * @param state Router state if user visit the given URL.
     * @returns {Observable<boolean>}
     */
    public canActivate(route: ActivatedRouteSnapshot,
                       state: RouterStateSnapshot): Observable<boolean> {
        let url: string = state.url;
        return this.checkLogin(url);
    }

    /**
     * Default constructor.
     * @param _auth0 DI for Auth0Service
     * @param _router DI for Router
     */
    constructor(private _auth0: Auth0Service,
                private _router: Router) {
    }

}
