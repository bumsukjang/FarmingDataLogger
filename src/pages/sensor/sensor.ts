import { Component, ViewChild  } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';

import { Chart } from 'chart.js';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { HTTP } from '@ionic-native/http';
import { BackgroundMode } from '@ionic-native/background-mode';

import { Observable } from 'rxjs/Observable';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-sensor',
  templateUrl: 'sensor.html'
})
export class SensorPage {
	
	@ViewChild('lineCanvas') lineCanvas;
	
	lineChart: any;
	
	date: Date;
	data: String;
	siteID: String;
	json_data: JSON;
	temp: Number;
	humi: Number;
	msg_device: String;
	alive: String = "연결안됨";
	http: HTTP;
	
	constructor(public backgroundMode : BackgroundMode, public navCtrl: NavController, public alertCtrl: AlertController, public plt: Platform, public localNotifications: LocalNotifications, public auth: AuthServiceProvider, public httpd: HTTP ) {
		this.http = httpd;
		/*
		this.plt.ready().then((rdy)=>{
			this.localNotifications.on('click', (notification, state) => {
				let json = JSON.parse(notification.data);
			
				let alert = this.alertCtrl.create({
					title: notification.title,
					subTitle: json.mydata,
					buttons: ['OK']
				});
				alert.present();
			});
		});
		*/
		plt.registerBackButtonAction(() => {
			backgroundMode.moveToBackground();
		});
		
		//this.updateData(http);
		
		//console.log('interval test');
		//Observable.interval(10 * 1000).subscribe(()=>{
		//	this.updateData();
		//});
		//setInterval(()=>{
		//this.updateData();}, 3000);
		backgroundMode.setDefaults({
			title: "DAONRS",
			text: "Farming Data Logger 데이터 모니터링",
			icon: 'icon', // this will look for icon.png in platforms/android/res/drawable|mipmap
			color: "F14F4D", // hex format like 'F14F4D'
			resume: true,
			hidden: false,
			bigText: false
		});
		
		this.updateData();
		//let intervalTime = 15 * 1000;
		Observable.interval(5 * 60 * 1000).subscribe(()=>{
			this.updateData();
		});
		/*
		backgroundMode.on("activate").subscribe(()=>function(){
			Observable.interval(5 * 1000).subscribe(()=>{
				this.updateData();
			});
		});
		backgroundMode.on('deactivate').subscribe(()=>function(){
			Observable.interval(5 * 1000).subscribe(()=>{
				this.updateData();
			});
		});
		*/
		//backgroundMode.overrideBackButton();
		backgroundMode.enable();
		/*
		this.data = "tejksaldjg Farming data logger asdafds";
	  
		console.log(this.data);
		this.siteID = this.data.substr(this.data.indexOf("Farming[")+8,3).split(",")[0];
		console.log("siteID : " + this.siteID);
		console.log(this.data.substr(this.data.indexOf("Farming[")+8,3).split(",")[1]);
	
		console.log('JSON test');
		this.json_data = JSON.parse('{"ch1": [	true, "\uc628\ub3c4",21.45,"\u2103",32.0,-3.0,false,false],"ch2": [true,"\uc2b5\ub3c4",41.89,"RH",80.0,20.0,false,false]}');
		console.log(this.json_data['ch1'][1]);
		console.log(this.json_data['ch1'][2]);
		console.log(this.json_data['ch1'][3]);
	  
		console.log(this.json_data['ch1'][6]);
		console.log(this.json_data['ch1'][7]);
		this.date = new Date(new Date().getTime());
		console.log('JSON test');
	    this.json_data = JSON.parse('{"ch1": [	true, "\uc628\ub3c4",21.45,"\u2103",32.0,-3.0,false,false],"ch2": [true,"\uc2b5\ub3c4",41.89,"RH",80.0,20.0,false,false]}');
	    console.log(this.json_data);
		this.temp = this.json_data['ch1'][2];
		this.humi = this.json_data['ch2'][2];
		
		
		*/
		
		
		
		//this.scheduleNotification(() => console.log('notification done'));
	}
	updateData(){
		console.log("updateData");
		//let interval = true;
		//while(interval){
			this.http.get('http://59.0.228.137:8081/index_temp/temp_trend_json/?site_id='+this.auth.getUserInfo().getSiteId()+'&req_type=1', {}, {})
			.then(data => {
				//this.updateData();
				//console.log(data);
				//this.date = new Date(new Date().getTime());
				console.log('JSON test');
				this.json_data = JSON.parse(data.data);
				//console.log(this.json_data);
				//console.log(this.json_data['columns'][0].reverse());
				let chartConfig = this.chartConfig;
				chartConfig.data.labels = [];
				chartConfig.data.datasets[0].data = [];
				console.log("date parsing test");
				
				//console.log(new Date(this.json_data['columns'][0][0]));
				this.json_data['columns'][0].forEach(function(label){
					console.log(label);
					if(label != null){
						chartConfig.data.labels.push(new Date(label.toString().split("GMT")[0]));
					}
				});
				//this.chartConfig.data.labels.push(this.json_data['columns'][0].slice(1,10));
				console.log(this.json_data['columns'][1].reverse());
				//this.chartConfig.data.datasets[0].data.push(this.json_data['columns'][1].slice(1,10));
				this.json_data['columns'][1].forEach(function(data){
					console.log(data);
					chartConfig.data.datasets[0].data.push(data);
				});
				if(this.lineChart == null){
					this.lineChart = new Chart(this.lineCanvas.nativeElement, chartConfig);
				}
				console.log(chartConfig);
				this.lineChart.update();
				//this.json_data['columns'][1];		
						
			}).catch(error => {
				console.log('error');
				console.log(error);
				console.log(error.status);			
			});
			
			this.http.get('http://59.0.228.137:8081/index_humi/humi_trend_json/?site_id='+this.auth.getUserInfo().getSiteId()+'&req_type=1', {}, {})
			.then(data => {
				//this.updateData();
				console.log(data);
				this.date = new Date(new Date().getTime());
				console.log('JSON test');
				this.json_data = JSON.parse(data.data);
				console.log(this.json_data);
				console.log(this.json_data['columns'][0].slice(1,10));
				let chartConfig = this.chartConfig;
				
				//this.json_data['columns'][0].reverse().forEach(function(label){
					//chartConfig.data.labels.push(label);
				//});
				
				//this.chartConfig.data.labels.push(this.json_data['columns'][0][0]);
				console.log(this.json_data['columns'][1].slice(1,10));
				chartConfig.data.datasets[1].data = [];
				this.json_data['columns'][1].forEach(function(data){
					chartConfig.data.datasets[1].data.push(data);
				});
				//this.chartConfig.data.datasets[1].data.push(this.json_data['columns'][1][0]);
				if(this.lineChart == null){
					this.lineChart = new Chart(this.lineCanvas.nativeElement, this.chartConfig);
				}
				this.lineChart.update();
				//this.json_data['columns'][1];		
						
			}).catch(error => {
				console.log('error');
				console.log(error);
				console.log(error.status);			
			});		
			
			
			this.http.get('http://59.0.228.137:8081/index_temp/data_json/?site_id='+this.auth.getUserInfo().getSiteId()+'&req_type=1', {}, {})
			.then(data => {
				console.log(data);
				//this.date = new Date(new Date().getTime());
				console.log('JSON test');
				this.json_data = JSON.parse(data.data);
				console.log(this.json_data);
				this.date = this.json_data['msg_device'].split(' : ')[1];
				this.temp = this.json_data['ch1'][2];
				this.humi = this.json_data['ch2'][2];
				if(this.temp > this.auth.getUserInfo().getCh1High() || this.temp < this.auth.getUserInfo().getCh1Low()){
					this.showAlert("온도 이상");
				}
				if(this.humi > this.auth.getUserInfo().getCh2High() || this.humi < this.auth.getUserInfo().getCh2Low()){
					this.showAlert("습도 이상");
				}
				//this.showAlert("알람 테스트");
				this.siteID = this.json_data['num_site'];
				if(this.json_data['site_live']){
					this.alive = "정상작동";
				} else {
					this.alive = "연결안됨";
				}
				/*
				if (this.chartConfig.data.datasets.length > 0) {
					this.chartConfig.data.labels.push(new Date(new Date().getTime()).toString());

					this.chartConfig.data.datasets[0].data.push(this.temp.valueOf());
					this.chartConfig.data.datasets[1].data.push(this.humi.valueOf());
					if(this.lineChart == null){
						this.lineChart = new Chart(this.lineCanvas.nativeElement, this.chartConfig);
					}
					this.lineChart.update();
				}
				*/
			}).catch(error => {
				console.log('error');
				console.log(error);
				console.log(error.status);			
			});
			
			
		//}
	}
	
	/*
	randomNumber(min:number, max:number){
		let seed = this._seed;
		min = min === undefined ? 0 : min;
		max = max === undefined ? 1 : max;
		this._seed = (seed * 9301 + 49297) % 233280;
		return min + (this._seed / 233280) * (max - min);
	}*/
	
	setData(data: String){
		this.data = data;
		
	}
	
	scheduleNotification(text){
		this.localNotifications.schedule({
			id: 1,
			title: 'Farming Data Logger 알람',
			text: text,		  
			data: {mydata: 'My hidden message this is' }
		});
	} 
	
	showAlert(text) {	
		if(this.backgroundMode.isActive()){
			this.scheduleNotification(text);
		} else {						
			let alert = this.alertCtrl.create({
			  title: '알람',
			  subTitle: text,
			  buttons: ['OK']
			});
			alert.present();
		}	
		
	  }
	  
	chartConfig = { 
		type: 'line',
		/*
		data: {
			labels: ["January", "February", "March", "April", "May", "June", "July"],
			datasets: [
				{
					label: "My First dataset",
					fill: false,
					lineTension: 0.1,
					backgroundColor: "rgba(75,192,192,0.4)",
					borderColor: "rgba(75,192,192,1)",
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: "rgba(75,192,192,1)",
					pointBackgroundColor: "#fff",
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: "rgba(75,192,192,1)",
					pointHoverBorderColor: "rgba(220,220,220,1)",
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 65, 59, 80, 81, 56, 55, 40],
					spanGaps: false,
				}
			]
		},*/
		data: {
			labels: [],
			datasets: [{
				label: '온도',
				backgroundColor: "rgba(75,192,192,0.4)",
				borderColor: "rgba(75,192,192,1)",
				data: [],
				fill: false,
				yAxisID: 'y-axis-1',
			}, {
				label: '습도',
				backgroundColor: "rgba(53, 102, 255, 0.4)",
				borderColor: "rgba(53, 102, 255, 1)",
				fill: false,
				data: [],
				yAxisID: 'y-axis-2',
			}]
		},
		options: {
			scales: {
				xAxes: [{
					type: 'time',
					
					time: {
						displayFormats: {
							quarter: 'MMM YYYY'
						}
					},
					distribution: 'series'
				}],
				yAxes: [{
					type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
					display: true,
					position: 'left',
					id: 'y-axis-1',
				}, {
					type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
					display: true,
					position: 'right',
					id: 'y-axis-2',

					// grid line settings
					gridLines: {
						drawOnChartArea: false, // only want the grid lines for one axis to show up
					},
				}]
			},
			title: {
				display: false
			},
			zoom: {
				enabled: true,
				drag: true,
				mode: 'x',
				limits: {
					max: 10,
					min: 0.5
				}
			}			
		},
		
	};
	ionViewDidLoad() { 
        this.lineChart = new Chart(this.lineCanvas.nativeElement, this.chartConfig);
		/*
		let chartConfig = this.chartConfig;
		["Mon, 09 Apr 2018 03:45:07 GMT","Mon, 09 Apr 2018 03:50:07 GMT"].forEach(function (label){
			chartConfig.data.labels.push(new Date(label.split("GMT")[0]));
		});
		
		["47.95","48.15"].forEach(function (data){
			chartConfig.data.datasets[1].data.push(data);
		});
		this.lineChart.update();
		
		
		
		
		this.chartConfig.data.labels.push("Mon, 09 Apr 2018 03:40:07 GMT");
		this.chartConfig.data.datasets[1].data.push("47.95");
		this.lineChart.update();
		
		this.chartConfig.data.labels.push("Mon, 09 Apr 2018 03:35:07 GMT");
		this.chartConfig.data.datasets[1].data.push("47.95");
		this.lineChart.update();
		*/
	}
	logout(){
		this.auth.logout().subscribe(succ => {
			this.backgroundMode.disable();
			this.navCtrl.parent.viewCtrl._nav.setRoot(LoginPage);
		});
	}
		
}
