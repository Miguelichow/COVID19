import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CovidService {

    constructor(private http: HttpClient) {
    }

    getPaises() {
        return this.http.get('https://pomber.github.io/covid19/timeseries.json');
    }

    getPais(pais: string) {
        return this.http.get(`https://coronavirus-19-api.herokuapp.com/countries/${pais}`);
    }
}
