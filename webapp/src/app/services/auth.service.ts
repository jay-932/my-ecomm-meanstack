import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000/auth'; // ✅ Ensure this is correct

  constructor() {}
  http = inject(HttpClient);
  //ye api teen tareeke se karenge 

  //1-ye direct object pass karke hai 

  // public register(data: any) {
  //   let headers = new HttpHeaders();
  //   headers.append('Content-Type', 'application/json');

  //   return this.http.post(this.baseUrl + '/register', data, {
  //     headers: headers,
  //   });
  // }

  //2-Properly Defined API Call → name, email, password ko explicitly method parameters me define karna
  public register(name: string, email: string, password: string) {
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
  
    const data = { name, email, password }; 
  
    return this.http.post(this.baseUrl + '/register', data, {
      headers: headers,
    });
  }

 

  //-3
//   import { HttpClient } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   private baseUrl = 'http://localhost:3000/auth';
//   http = inject(HttpClient);

//   constructor() {}

//   register(name: string, email: string, password: string) {
//     return this.http.post(this.baseUrl + '/register', {
//       name, 
//       email, 
//       password
//     });
//   }
// }

public login(email: string, password: string) {
  let headers = new HttpHeaders();
  headers.append('Content-Type', 'application/json');

  const data = { email, password }; 

  return this.http.post(this.baseUrl + '/login', data, {
    headers: headers,
  });
}

//isko aise bhi kar sakte hai 
//headers.append('Content-Type', 'application/json'); Ka Matlab Kya Hai?
//Yeh HTTP request headers ka ek part hai jo server ko batata hai ki jo data hum bhej rahe hain, woh JSON format me hai.

//Agar aap API request kar rahe hain, to server ko batana padta hai ki request ka content kis format me hai.

// public login(email: string, password: string) {
//   let headers = new HttpHeaders({ 'Content-Type': 'application/json' }); // ✅ Correct Way

//   const data = { email, password }; 

//   return this.http.post(this.baseUrl + '/login', data, { headers });
// }
get isLoggedIn(){
  let token = localStorage.getItem('token');
  if(token){
    return true
  }
  return false
}

get isAdmin(){
  let userData = localStorage.getItem('user');
  if(userData){
    return JSON.parse(userData).isAdmin;
  }
  return null
}

get userName(){
  let userData = localStorage.getItem('user');
  if(userData){
    return JSON.parse(userData).name;
  }
  return null
}

logout(){
  localStorage.removeItem('token');
  localStorage.removeItem('user');

}
  
}
