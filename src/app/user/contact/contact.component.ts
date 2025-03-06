import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContactRequest } from './../../models/general.model';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GeneralService } from '../../services/general/genera.service';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  isLoading = signal<boolean>(false);
  generalService = inject(GeneralService);
  toast = inject(ToastrService);
  destroyRef = inject(DestroyRef);

  form = new FormGroup({
    message: new FormControl('', [
      Validators.required,
      Validators.maxLength(500),
    ]),
    name: new FormControl('', [Validators.maxLength(50), Validators.required]),
    subject: new FormControl('', [
      Validators.maxLength(200),
      Validators.required,
    ]),
    email: new FormControl('', [Validators.maxLength(50), Validators.required]),
  });

  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return control ? control.invalid && control.touched : false;
  }

  contactUs(): void {
    if (this.form.invalid) {
      this.toast.error('Please provide the required values');
      return;
    }

    const model: ContactRequest = {
      message: this.form.value.message!,
      name: this.form.value.name!,
      subject: this.form.value.subject!,
      email: this.form.value.email!,
    };

    this.isLoading.set(true);

    this.generalService
      .contact(model)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.toast.success(
              res.message ||
                'Thanks for contacting us, we will get back to you.'
            );
            this.form.reset({});
            this.isLoading.set(false);
          }
        },
        error: (error) => {
          this.isLoading.set(false);

          this.toast.error(
            error.error.message ||
              "We couldn't process your request, please try again."
          );
          console.log(error);
        },
      });
  }
}
