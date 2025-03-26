import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { TokenStorageService } from 'src/app/shared/storage-services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  showConfirmPassword: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: [this.tokenStorage.getRememberPass() == 'activo' ? this.tokenStorage.getUsername() : '', [Validators.required, Validators.email]],
      password: [this.tokenStorage.getRememberPass() == 'activo' ? this.tokenStorage.getPassword() : '', [Validators.required]],
      acceptTerms: [false, Validators.requiredTrue],
      rememberPass: [this.tokenStorage.getRememberPass() == 'activo' ? true : false]
    });
  }

  ngOnInit() {
  }

  viewLogin() {
    this.router.navigate(['/login']);
  }

  viewRegistro() {
    this.router.navigate(['/registro']);
  }

  home() {
    this.router.navigate(['/home']);
  }

  validarForm(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.Login();
    } else {
      console.log('El formulario de login tiene errores', this.loginForm);
    }
  }

  viewRegister() {
    this.router.navigate(['/registro']);
  }

  async Login() {

    //this.canShowLoading = true;
    let oneDay = (1000 * 60 * 60 * 24);

    let passwordEncoded = this.loginForm.get('password')?.value;

    for (let i = 0; i < 5; i++) {
      passwordEncoded = btoa(passwordEncoded);
    }

    this.authService.attemptAuth('api/auth', {"email": this.loginForm.get('email')?.value, "password": passwordEncoded}).toPromise().then(
      data => {
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveIdentificacion(data.user.tipo_documento + " " + data.user.numero_documento);
        this.tokenStorage.saveTelefono(data.user.celular);
        this.tokenStorage.saveCompleteName(data.user.primerNombre + " " + data.user.primerApellido);
        this.tokenStorage.saveID(data.user.userId);
        this.tokenStorage.saveUsername(data.user.email);
        this.tokenStorage.saveTermsConditions(data.user.terminos_y_condifciones);
        this.tokenStorage.saveRememberPass(this.loginForm.get('rememberPass')?.value == true ? 'activo' : 'inactivo');
        this.tokenStorage.savePassword(this.loginForm.get('password')?.value);
        this.router.navigate(['/inicio-free']);
      }
    )
    .catch(error => {
      console.log("error...",error);
      this.toastr.error(error.error.answer, 'Ocurrió un error', {
        timeOut: 7000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-bottom-right',
        closeButton: true,
        tapToDismiss: false,
        disableTimeOut: false,
      });
    });
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
