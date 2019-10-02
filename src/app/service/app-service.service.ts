import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  constructor(private http : HttpClient) { }

  getData(){
    return this.http.get('https://vast-shore-74260.herokuapp.com/banks?city=MUMBAI');
  }
}
