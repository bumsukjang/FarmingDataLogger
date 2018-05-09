import { Component, ViewChild  } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';

import { Chart } from 'chart.js';
//import 'hammerjs';
//import 'chartjs-plugin-zoom';
//import * as zoom from 'chartjs-plugin-zoom'

import { LocalNotifications } from '@ionic-native/local-notifications';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { SettingServiceProvider } from '../../providers/setting-service/setting-service';


import { HTTP } from '@ionic-native/http';
import { BackgroundMode } from '@ionic-native/background-mode';

import { Observable } from 'rxjs/Rx';

import { LoginPage } from '../login/login';
import { DomElementSchemaRegistry } from '@angular/compiler';

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
	ch: number[] = [1,2,3,4,5,6,7];
	msg_device: String;
	alive: String = "연결안됨";
	http: HTTP;
	setting;
	graphMinTime;
	graphMaxTime;
	constructor(public backgroundMode : BackgroundMode, 
	public navCtrl: NavController, 
	public alertCtrl: AlertController, 
	public plt: Platform, 
	public localNotifications: LocalNotifications, 
	public auth: AuthServiceProvider, 
	public httpd: HTTP, 
	private settingService: SettingServiceProvider	) {
		this.http = httpd;
		settingService.init(auth.getUserInfo().getUsername());

		plt.registerBackButtonAction(() => {
			backgroundMode.moveToBackground();
		});

		backgroundMode.setDefaults({
			title: "DAONRS",
			text: "Farming Data Logger",
			icon: 'icon', // this will look for icon.png in platforms/android/res/drawable|mipmap
			color: "F14F4D", // hex format like 'F14F4D'
			resume: true,
			hidden: false,
			bigText: false
		});
		
		this.updateData();
		Observable.interval(5 * 60 * 1000).subscribe(()=>{
			this.updateData();
		});
		backgroundMode.enable();	
	}

	ionViewWillEnter(){
		console.log('[sensor.ts] - ionViewWillEnter()');
		this.setting = this.settingService.get();
		console.log('[sensor.ts] - ionViewWillEnter() this.setting : ' + this.setting);
		console.log(this.setting);
	}

	updateData(){
		let currentTime = new Date()
		let month = currentTime.getMonth() + 1
		let day = currentTime.getDate()
		let year = currentTime.getFullYear()
		this.graphMinTime = new Date(day + "/" + month  + "/" + year + "00:00:00");
		this.graphMaxTime = new Date(day + "/" + month  + "/" + year + "23:59:59");
		console.log("updateData");
		let urls = ["temp_trend_json","humi_trend_json"];
		for(var urlIndex = 0; urlIndex < urls.length; urlIndex++){
			console.log("URL is");
			console.log('http://59.0.228.137:8080/'+urls[urlIndex]+'?site_id='+this.auth.getUserInfo().getSiteId()+'&req_type=1');
			this.http.get('http://59.0.228.137:8080/'+urls[urlIndex]+'?site_id='+this.auth.getUserInfo().getSiteId()+'&req_type=1', {}, {})
			.then(data => {
				let dataIndex = -1;		
				console.log(data);		
				this.json_data = JSON.parse(data.data);
				console.log(this.json_data);				
				if(this.json_data['columns'][1][0] == "Temperature"){
					dataIndex = 0;
				} else if(this.json_data['columns'][1][0] == "Humidity"){
					dataIndex = 1;
				}
				console.log('[sensor data] : trendData ' + dataIndex);
				
				let chartConfig = this.chartConfig;
				chartConfig.data.labels = [];
				chartConfig.data.datasets[dataIndex].data = [];
				/* let minTime;
				let maxTime; */
				for(var i = 0; i < this.json_data['columns'][0].length ; i++){
					let label = this.json_data['columns'][0][i];
					let dataset = this.json_data['columns'][1][i];
					console.log("label : " + label);
					console.log("dataset : " + dataset);
					
					if(label != null){
						let timeLabel = new Date(label.toString().split("GMT")[0]);
						/* if(i == 0){	
							maxTime = timeLabel;
						} else if(i == this.json_data['columns'][0].length - 1){
							minTime = timeLabel;
						} */
						chartConfig.data.labels.push(timeLabel);
						chartConfig.data.datasets[dataIndex].data.push(dataset);
					}
				}
				/* chartConfig.options.scales.xAxes[0] = {
					type: 'time',								
					time: {
						displayFormats: {
							quarter: 'MMM YYYY'
						},
						minUnit: 'minute',
						min: this.graphMinTime,
						max: maxTime
					},
					distribution: 'series',
					bounds: 'ticks',
					ticks:{
						source: 'auto'
					}						
				}; */
				if(this.lineChart == null){
					this.lineChart = new Chart(this.lineCanvas.nativeElement, chartConfig);
				}
				console.log(chartConfig);
				this.lineChart.update();					
			}).catch(error => {
				console.log('error');
				this.showAlert('접속 오류 : http://59.0.228.137:8080/'+urls[0]+'?site_id='+this.auth.getUserInfo().getSiteId()+'&req_type=1');
				console.log(error);
				console.log(error.status);			
			});
		}
		/* 
		
		this.http.get('http://59.0.228.137:8080/humi_trend_json?site_id='+this.auth.getUserInfo().getSiteId()+'&req_type=1', {}, {})
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
			console.log('[sensor.ts - updateData()] http://59.0.228.137:8080/humi_trend_json?site_id');
			this.showAlert("http://59.0.228.137:8080/humi_trend_json 접속 오류");
			console.log(error);
			console.log(error.status);			
		});		 */
		
		
		this.http.get('http://59.0.228.137:8080/data_json?site_id='+this.auth.getUserInfo().getSiteId()+'&req_type=1', {}, {})
		.then(data => {
			this.json_data = JSON.parse(data.data);
			this.date = this.json_data['msg_device'].split(' : ')[1];
			for(var i = 0; i < 8; i++){
				this.ch[i] = this.json_data['ch'+(i+1).toString()][2];	
			}
			if(this.setting != null){
				if(this.ch[0] > this.setting.ch1High || this.ch[0] < this.setting.ch1Low){
					this.showAlert("온도 이상(현재:"+this.ch[0]+")");
					console.log('[sensor.ts] updateData() : ch1(' + this.ch[0] +'),ch1High(' +this.setting.ch1High+'),ch1Low('+this.setting.ch1Low+')');
				}
				if(this.ch[1] > this.setting.ch2High || this.ch[1] < this.setting.ch1Low){
					this.showAlert("습도 이상(현재:"+this.ch[1]+")");
					console.log('[sensor.ts] updateData() : ch2(' + this.ch[1] +'),ch1High(' +this.setting.ch2High+'),ch1Low('+this.setting.ch2Low+')');
				}
			}
			this.siteID = this.json_data['num_site'];
			if(this.json_data['site_live']){
				this.alive = "정상작동";
			} else {
				this.alive = "연결안됨";
			}
			console.log('[sensor.ts] - updateData() http-get_data-then');
			this.setting = this.settingService.get();
			console.log('[sensor.ts] - updateData() http-get_data-then this.setting : ' + this.setting);
			console.log(this.setting);
		
		}).catch(error => {
			console.log('error');
			console.log('[sensor.ts - updateData()] http://59.0.228.137:8080/data_json?site_id=');
			this.showAlert("http://59.0.228.137:8080/data_json 접속 오류");
			console.log(error);
			console.log(error.status);			
		});
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
						},
						minUnit: 'minute',
						min: this.graphMinTime,
						max: this.graphMaxTime
					},
					distribution: 'linear',					
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
			},
			pan: {
				enabled: true,
				mode: 'x'
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
