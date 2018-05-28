//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
//import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

class SettingInfo{
	chNames: string[] = [];
	chUnits: string[] = [];
	chHighs: number[] = [];
	chLows: number[] = [];
	chDisplay: boolean[] = [];
	chRanges: any[] = [];
	constructor(chNames, chUnits, chDisplay, chHighs, chLows){
		this.chNames = chNames;
		this.chUnits = chUnits;
		this.chDisplay = chDisplay;
		this.chHighs = chHighs;
		this.chLows = chLows;
		this.chRanges = new Array();
		for(let i = 0 ; i < this.chHighs.length; i++){
			this.chRanges.push({
				lower: this.chLows[i],
				upper: this.chHighs[i]
			})
		}
	}
	
	setChNames(chNames){
		this.chNames = chNames;
	}
	
	getChNames(){
		return this.chNames;
	}
	
	setChUnits(chUnits){
		this.chUnits = chUnits;
	}
	
	getChUnits(){
		return this.chUnits;
	}
	
	setChDisplay(chDisplay){
		this.chDisplay = chDisplay;
	}
	
	getChDisplay(){
		return this.chDisplay;
	}
	
	setChHighs(chHighs){
		this.chHighs = chHighs;
		this.chRanges = new Array();
		for(let i = 0 ; i < this.chHighs.length; i++){
			this.chRanges.push({
				lower: this.chLows[i],
				upper: this.chHighs[i]
			})
		}
	}
	
	getChHighs(){
		return this.chHighs;
	}
	
	setChLows(chLows){
		this.chLows = chLows;
		this.chRanges = new Array();
		for(let i = 0 ; i < this.chHighs.length; i++){
			this.chRanges.push({
				lower: this.chLows[i],
				upper: this.chHighs[i]
			})
		}
	}
	
	getChLows(){
		return this.chLows;
	}
}

@Injectable()
export class SettingServiceProvider {
	 setting: SettingInfo;
	 username;
	 
	 constructor(private storage: Storage) {
		console.log('Hello SettingInfo Provider');
		/*
		this.setting = new SettingInfo(
				["온도","습도","온도","습도","온도","습도","온도","습도"], 
				["℃","RH","℃","RH","℃","RH","℃","RH"], 
				[true,true,true,true,true,true,true,true],
				15,
				35,
				40,
				80);
				*/
	}

	  init(username){
		  this.username = username;
		  this.storage.get(username).then((val) => {
			  console.log("[SettingServiceProvider.ts init()-sval");
			  console.log(val);
			if(val == null){
				val = new SettingInfo(
				["온도(1)","습도(2)","온도(3)","습도(4)","온도(5)","습도(6)","온도(7)","습도(8)"], 
				["℃","RH","℃","RH","℃","RH","℃","RH"], 
				[true,true,true,true,true,true,true,true],
				[35,80,35,80,35,80,35,80],
				[15,40,15,40,15,40,15,40]
				);
			}
			console.log("settings");
			console.log(JSON.stringify(val));
			this.setting = val;
			this.setting.chRanges = new Array();
			for(let i = 0 ; i < val.chNames.length; i++){
				this.setting.chRanges.push({
					lower: val.chLows[i],
					upper: val.chHighs[i]
				})
			}
			console.log(JSON.stringify(this.setting));
		  });
		  //console.log(this.setting);
	  }
	  
	  get(){
		  return this.setting;
	  }
	  
	  save(chNames, chUnits, chDisplay, chRanges){
		  /*
		  this.setting.setChNames(chNames);
		  this.setting.setChUnits(chUnits);
		  this.setting.setChDisplay(chDisplay);
		  this.setting.setCh1High(ch1High);
		  this.setting.setCh1Low(ch1Low);
		  this.setting.setCh2High(ch2High);
		  this.setting.setCh2Low(ch2Low);
		  */
		  this.setting.chNames = chNames;
		  this.setting.chUnits = chUnits;
		  this.setting.chDisplay = chDisplay;
		  for(let i = 0 ; i < chNames.length; i++){
			  this.setting.chHighs[i] = chRanges[i].upper;
			  this.setting.chLows[i] = chRanges[i].lower;
			}
		  console.log("setting save");
		  console.log(this.username);
		  console.log(this.setting);
		  this.storage.set(this.username,this.setting);
		  this.storage.get(this.username).then((val) =>{
			console.log("result");
		  
			console.log(JSON.stringify(this.setting));		  
		  });
		  
	  }
	  
	  save_json(data){		  
		  console.log("save json");
		  console.log(this.username+"_json");
		  console.log(data);
		  this.storage.set(this.username+"_json",data);
		  console.log("result");
		  //console.log(this.storage.getJson(this.username+"_json"));
	  }
}
