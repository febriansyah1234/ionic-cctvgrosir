import { Component, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserData } from '../../providers/user-data';
import { UserOptions } from '../../interfaces/user-options';
import {
  ToastController,
  Platform,
  LoadingController,
  ActionSheetController, 
} from '@ionic/angular';
import { HTTP, HTTPResponse } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { AlertController } from '@ionic/angular';
import { NgxCommunicateService } from 'ngx-communicate';
import { API_URL } from '../../providers/constant.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  // login: UserOptions = { username: '', password: '' };
  login : UserOptions = { 
    nama : '', 
    password: '', 
    email : '', 
    provinsi : '',
    kota:'',
    kecamatan:'',
    alamat:'',
    jk_pel : '', 
    confirm_password : '',
    no_telp : '',
    username: '',   
  };  
  actionSheet : any;
  submitted = false;
  loading : any;
  alert1 : any;
  hasil : any = {};
  constructor(
    private oneSignal: OneSignal,
    public platform : Platform,
    public userData: UserData,
    public router: Router,
    public loadingCtrl: LoadingController,
    private http: HTTP,
    public http2: HttpClient,
    private ngxXml2jsonService: NgxXml2jsonService,
    public alertController: AlertController,
    private communicate: NgxCommunicateService,
    public actionSheetController: ActionSheetController

  ) { 
    // http.setDataSerializer('json');
  }
  async alert(header, sub, msg){
    this.alert1 = await this.alertController.create({
      header: header,
      subHeader: sub,
      message: msg,
      buttons: ['OK']
    });  
    await this.alert1.present();  
  }
  ionViewDidEnter() {
    // this.platform.backButton.subscribe(hsl=>{
    //   this.keluar_aplikasi();
    // })
  }
  // async keluar_aplikasi() {
  //   this.actionSheet = await this.actionSheetController.create({
  //     header : 'Apakah anda yakin ingin keluar aplikasi ? ',
  //     buttons : [
  //       {
  //         text : 'Ya',
  //         handler : () => {
  //           navigator['app'].exitApp();
  //         }
  //       },
  //       {
  //         text : 'Tidak',
  //         role: 'cancel',
  //         handler : () =>{
            
  //         }
  //       }
  //     ]
  //   });
  //   await this.actionSheet.present();
  // }  
  async onLogin(form: NgForm) {
    console.log('login')
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.submitted = true;
    if (form.valid) {
      await this.loading.present(); 
      this.http2.post(API_URL + 'api_login', { email : this.login.username, password : this.login.password }, {} )
      .subscribe(( data ) => {
        console.log(data); 
        this.hasil = data;
        if(this.hasil.code==1){
          this.oneSignal.sendTag('id_pel', this.hasil.id_pel);
          this.userData.login(this.hasil).then(hasl => { 
            this.loading.dismiss();
            this.communicate.broadcast('login_success', 'login_success');
            this.router.navigateByUrl('/product');
          });
        }else{ 
          console.log('login b');
          this.loading.dismiss();
          this.alert('Maaf', '', this.hasil.msg);
        }
      })    
      // this.http.post(API_URL + 'login', { email : this.login.username, password : this.login.password }, {} )
      // .then(( data: HTTPResponse ) => {
      //   console.log(data); 
      //   const parser = new DOMParser();
      //   const json = parser.parseFromString(data.data, 'text/xml');
      //   const obj = this.ngxXml2jsonService.xmlToJson(json);
      //   this.hasil = obj;
      //   console.log(this.hasil['xml'], 'hasil')
      //   if(this.hasil['xml'].code!='0'){
      //     console.log('login a')
      //     this.userData.login(this.hasil['xml'].session).then(hasl => { 
      //       this.loading.dismiss();
      //       this.communicate.broadcast('login_success', 'login_success');
      //       this.router.navigateByUrl('/app/tabs/schedule');
      //     });
      //   }else{ 
      //     console.log('login b');
      //     this.loading.dismiss();
      //     this.alert('Error', 'You got error', this.hasil.xml.msg);
      //   }
      // })
      // .catch(error => {
      //   this.loading.dismiss();
      // });
    }

  }
  lupa_password(){
    this.router.navigateByUrl('/lupa-password');
  }
  onSignup() {
    this.router.navigateByUrl('/signup');
  }
}
