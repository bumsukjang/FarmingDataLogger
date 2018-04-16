//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
//import { HTTP } from '@ionic-native/http';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export class User{
	username: string;
	siteID: string;
	device: string;
	location: string;
	phone: string;
	ch1Name: string;
	ch1Unit: string;
	ch1High: number;
	ch1Low: number;
	ch2Name: string;
	ch2Unit: string;
	ch2High: number;
	ch2Low: number;
	
	constructor(username, siteId, device, location, phone, ch1Name, ch1Unit, ch1High, ch1Low, ch2Name, ch2Unit, ch2High, ch2Low){
		this.username = username;
		this.siteID = siteId;
		this.device =  device ;
		this.location =  location;
		this.phone = phone;
		this.ch1Name = ch1Name;
		this.ch1Unit = ch1Unit;
		this.ch1High = ch1High;
		this.ch1Low = ch1Low;
		this.ch2Name = ch2Name;
		this.ch2Unit = ch2Unit;
		this.ch2High = ch2High;
		this.ch2Low = ch2Low;
	}
	public getSiteId(){
		return this.siteID;
	}
	
	public getUsername(){
		return this.username;
	}
	
	public getDevice(){
		return this.device;
	}
	
	public getLocation(){
		return this.location;
	}
	
	public getPhone(){
		return this.phone;
	}
	
	public getCh1Name(){
		return this.ch1Name;
	}
	public getCh1Unit(){
		return this.ch1Unit;
	}
	public getCh1High(){
		return this.ch1High;
	}
	public setCh1High(data){
		this.ch1High = data;
	}
	public getCh1Low(){
		return this.ch1Low;
	}
	public setCh1Low(data){
		this.ch1Low = data;
	}
	
	public getCh2Name(){
		return this.ch2Name;
	}
	public getCh2Unit(){
		return this.ch2Unit;
	}
	public getCh2High(){
		return this.ch2High;
	}
	public setCh2High(data){
		this.ch2High = data;
	}
	public getCh2Low(){
		return this.ch2Low;
	}
	public setCh2Low(data){
		this.ch2Low = data;
	}
	
}

@Injectable()
export class AuthServiceProvider {
	
	currentUser: User;
  
  constructor(/*public http: HttpClient, private http: HTTP*/) {
    console.log('Hello AuthServiceProvider Provider');
  }

	public login(credentials, data) {
		let access = false;
		let jsonData;
		console.log('username' + credentials.username);
		console.log('data');
		console.log(data.data);
		jsonData = JSON.parse(data.data);
		console.log(jsonData);
		/*
		if(data.data.substr(data.data.indexOf("Farming")+8,3).indexOf(',') > 0){
			access = true;
			siteId = data.data.substr(data.data.indexOf("Farming")+8,3).split(',')[0];
		}
		*/
		if(jsonData['logFlag'] == true){
			access = true;
		}
		if (credentials.username === null || credentials.password === null) {
			return Observable.throw("Please insert credentials");
		} else {
			return Observable.create(observer => {
				
				// At this point make a request to your backend to make a real check!
				
				this.currentUser = new User(credentials.username, jsonData['siteId'], jsonData['device'], jsonData['location'], jsonData['phone'], jsonData['ch1_name'], jsonData['ch1_unit'], jsonData['ch1_high'], jsonData['ch1_low'], jsonData['ch2_name'], jsonData['ch2_unit'], jsonData['ch2_high'], jsonData['ch2_low']);
				console.log(this.currentUser);
				console.log('access : ' + access);
				observer.next(access);
				observer.complete();
			});
		}
	}
	 
	  	 
	public getUserInfo() : User {
		return this.currentUser;
	}
	 
	public logout() {
		return Observable.create(observer => {
			this.currentUser = null;
			observer.next(true);
			observer.complete();
		});
	}
}
