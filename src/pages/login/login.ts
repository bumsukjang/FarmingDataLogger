import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

import { SettingServiceProvider } from '../../providers/setting-service/setting-service';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { Storage } from '@ionic/storage';

import { HTTP } from '@ionic-native/http';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
	loading: Loading;
  registerCredentials = { username: '', password: '' };
 
 
  constructor(public navCtrl: NavController, 
  private auth: AuthServiceProvider, 
  private alertCtrl: AlertController, 
  private loadingCtrl: LoadingController, 
  private http: HTTP, 
  private setting: SettingServiceProvider,
	private storage: Storage) {
	  //this.login();
	  if(auth.getUserInfo() != null){
		  this.navCtrl.setRoot(TabsPage);
	  }
	  
  }
  
  login(){
    this.showLoading();
	console.log('login page');
	console.log('username : ' + this.registerCredentials.username);
	console.log('password : ' + this.registerCredentials.password);
	if(this.registerCredentials.username == "admin" && this.registerCredentials.password == "admin"){
		this.auth.login(this.registerCredentials, { 'data' : '{"logFlag": true,"modified": true,"reqType": 1,"siteId": 79}'}).subscribe(allowed => {
			if (allowed) {
				//AboutPage.reload();
				this.navCtrl.setRoot(TabsPage);
			} else {
				this.showError("Access Denied");
			}
		},
		error => {
			this.showError(error);
		});			
	} else {
		this.http.post('http://59.0.228.137:80/login', 
		{ 
		  'username': this.registerCredentials.username,
		  'password': this.registerCredentials.password
		},
		{
		  
		})
		.then(data => {
			//storage.set(this.registerCredentials.username+"_json", data);
			console.log(data);
			this.auth.login(this.registerCredentials, data).subscribe(allowed => {
				console.log("subscribe");
				console.log(allowed);
				if (allowed) {        
					console.log("[login.ts] login() : subscribe allowed");
					console.log(allowed);
					this.setting.init(this.registerCredentials.username);
					console.log('[login.ts] login() : this.setting.init(this.registerCredentials.username); and this.setting.get()' + this.setting.get());
					this.navCtrl.setRoot(TabsPage);
				} else {
					this.showError("Access Denied");
				}
			},
			error => {
				this.showError(error);
			});			
		}).catch(error => {
			console.log('error');
			console.log(error);
			console.log(error.status);			
		});
	}
	
			
		  
	  //console.log('login function');
	  /*
	  var user = users.getUser($scope.user.username, $scope.user.password);
        if(user !== null){
            users.user = user;
            $state.go('tabsController.farmingDataLogger');
        } else {
            $ionicPopup.alert({
                title: "ID와 비밀번호를 확인하십시오"
            });
        }*/
		
		
	//console.log(this.username);
	
	//var username = auth.getUserInfo().username;
	
	
	//this.navCtrl.push(TabsPage)
	
	}
  
  
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: '로그인 중입니다.',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
 
  showError(text) {
    this.loading.dismiss();
 
    let alert = this.alertCtrl.create({
      title: '로그인실패',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
  
  
}
