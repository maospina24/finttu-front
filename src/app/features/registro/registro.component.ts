import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CrudServiceService } from 'src/app/shared/backend/cruds/crud.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  registerForm!: FormGroup;
  registroForm!: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  registroExitoso = false; // Se activará cuando el usuario haga click en "Registrarme"
  otp: string[] = ["", "", "", "", "", ""]; // Código OTP vacío
  isLoading = false; // Variable para controlar el estado de carga

  timer: number = 60;
  isResendDisabled: boolean = true;
  interval: any;
  correoUsuario: String;

  passwordValid = {
    length: false,
    upperLower: false,
    number: false,
    special: false
  };

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    private crudServices: CrudServiceService,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      terminos: [false, Validators.requiredTrue],
      infoExperian: [false],
      tratamientoDatos: [false, Validators.requiredTrue]
    }, { validator: this.passwordsMatchValidator });

    this.registroForm = this.fb.group({
      tipoDocumento: ['', Validators.required],
      primerNombre: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      primerApellido: ['', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  ngOnInit() {
    this.registerForm.get('password')?.valueChanges.subscribe(value => {
      this.validatePassword(value);
    });
    this.otp = new Array(6).fill("");
  }

  registro() {
    const usuarioModel = {
      "tipo_documento": this.registroForm.get('tipoDocumento')?.value || "",
      "numero_documento": this.registroForm.get('numeroDocumento')?.value || "",
      "primerNombre": this.registroForm.get('primerNombre')?.value || "",
      "primerApellido": this.registroForm.get('primerApellido')?.value || "",
      "email": this.registroForm.get('correo')?.value || "",
      "celular": this.registroForm.get('celular')?.value || "",
      "password": this.registerForm.get('password')?.value || "",
      "enabled": true,
      "esGratuita": true
    };

    this.crudServices
      .createModelFree("api/usuarios/crear", JSON.stringify(usuarioModel))
      .subscribe(
        (genericResponse) => {
          console.log("genericResponse..." + JSON.stringify(genericResponse));
          if (genericResponse.code === 201) {
            this.isLoading = false;
            this.modalService.dismissAll();
            Swal.fire({
              title: '¡Registro exitoso!',
              text: 'Tu cuenta ha sido creada correctamente, ya puedes iniciar sesión.',
              icon: 'success',
              confirmButtonColor: '#5c0c87',
              confirmButtonText: 'Iniciar Sesión!'
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/login']);
              }
            });
          }
          if (genericResponse.code === 400) {
            console.log("genericResponse..." + JSON.stringify(genericResponse));
            this.isLoading = false;
            this.modalService.dismissAll();
            Swal.fire({
              title: '¡Error!',
              text: "Ya existe una cuenta creada con este correo " + this.registroForm.get('correo')?.value + ", inicia sesión o recupera tu contraseña.",
              icon: 'error',
              confirmButtonColor: 'rgba(45, 55, 72, 1);',
              confirmButtonText: 'Aceptar'
            }).then((result) => {
              if (result.isConfirmed) {

              }
            });
          }
        },
        (error) => {
          console.log("error..." + JSON.stringify(error));
          this.isLoading = false;
          this.modalService.dismissAll();
            Swal.fire({
              title: '¡Error!',
              text: error.error.answer?? "Comunicate con el administrador.",
              icon: 'error',
              confirmButtonColor: 'rgba(45, 55, 72, 1);',
              confirmButtonText: 'Reintentar'
            }).then((result) => {
              if (result.isConfirmed) {

              }
            });
        }
      );
  }

  validarYAbrirModal(content: any): void {
    this.registroForm.markAllAsTouched();
    if (this.registroForm.valid) {
      this.openModal(content);
    } else {
      console.log('El formulario de registro tiene errores', this.registroForm);
    }
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  validatePassword(password: string) {
    this.passwordValid.length = password.length >= 8 && password.length <= 15;
    this.passwordValid.upperLower = /[A-Z]/.test(password) && /[a-z]/.test(password);
    this.passwordValid.number = /\d/.test(password);
    this.passwordValid.special = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  registrar() {
    if (this.registerForm.valid) {
      console.log('Formulario válido, registrando usuario:', this.registerForm.value);
      this.registroExitoso = true;
      this.startResendTimer();
    } else {
      console.log('Formulario inválido');
    }
  }

  openModal(content: any) {
    this.registroExitoso = false;

    // Reinicializar el formulario al abrir el modal
    this.registerForm.reset({
      password: '',
      confirmPassword: '',
      terminos: false,
      infoExperian: false,
      tratamientoDatos: false
    });

    this.modalService.open(content, {
      centered: true,
      size: 'lg',
      windowClass: 'custom-modal-animated-registro'
    });
  }


  viewLogin() {
    this.router.navigate(['/login']);
  }

  codigoEnviado: string = "123456"; // Simula un código real

  validarOTP() {
    const codigoIngresado = this.otp.join("");

    this.isLoading = true; // Mostrar GIF de carga

    setTimeout(() => {

      if (codigoIngresado === this.codigoEnviado) {
        this.registro();
      } else {
        this.isLoading = false;
        Swal.fire({
          title: '¡Error!',
          text: 'El código es invalido, inténtalo de nuevo.',
          icon: 'error',
          confirmButtonColor: 'rgba(45, 55, 72, 1);',
          confirmButtonText: 'Reintentar'
        }).then((result) => {
          if (result.isConfirmed) {

          }
        });
      }
    }, 5000); // Simulación de espera (2 segundos)
  }

  focusNext(event: any, index: number) {
    setTimeout(() => {
      const inputs = document.querySelectorAll(".otp-input") as NodeListOf<HTMLInputElement>;
      let value = event.target.value;

      if (value.length > 1) {
        value = value.slice(0, 1);
        event.target.value = value;
      }

      this.otp[index] = value;

      if (index === 5 && value) {
        this.validarOTP();
        return;
      }

      if (value && index < 5) {
        inputs[index + 1]?.focus();
      }

      if (event.inputType === "deleteContentBackward") {
        this.otp[index] = "";
        if (index > 0) {
          setTimeout(() => {
            inputs[index - 1]?.focus();
            this.otp[index - 1] = "";
          }, 50);
        }
      }
    }, 50); // 🔥 Retrasamos un poco la ejecución para asegurarnos de que el DOM está listo.
  }

  startResendTimer() {
    this.isResendDisabled = true;
    this.timer = 60; // Reinicia el contador

    this.interval = setInterval(() => {
      this.timer--;
      if (this.timer === 0) {
        this.isResendDisabled = false;
        clearInterval(this.interval);
      }
    }, 1000);
  }

  reenviarCodigo() {
    console.log("Código reenviado"); // Aquí debes llamar a tu servicio para reenviar el OTP
    this.startResendTimer();
  }

}
