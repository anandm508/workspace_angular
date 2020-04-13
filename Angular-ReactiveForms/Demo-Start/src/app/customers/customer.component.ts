import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn,
  FormArray
} from "@angular/forms";

import { Customer } from "./customer";
import { debounceTime } from "rxjs/operators";

/*
//Range validator which works with hardcoded range
function ratingRange(c: AbstractControl): { [key: string]: boolean } | null {
  if (c.value !== null && (isNaN(c.value) || c.value < 1 || c.value > 5)) {
    return { range: true };
  }
  return null;
}*/
/**
 * Range validator factory function
 * @param minValue
 * @param maxValue
 *
 * @returns ValidatorFn, the range validator
 */
function ratingRange(minValue: number, maxValue: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (
      c.value !== null &&
      (isNaN(c.value) || c.value < minValue || c.value > maxValue)
    ) {
      return { range: true };
    }
    return null;
  };
}

function emailCompare(c: AbstractControl): { [key: string]: boolean } | null {
  const email = c.get("email");
  const confirmEmail = c.get("confirmEmail");
  if (
    !email.pristine &&
    !confirmEmail.pristine &&
    email.value !== "" &&
    confirmEmail.value !== "" &&
    confirmEmail.value !== email.value
  ) {
    return { match: true };
  }
  return null;
}

@Component({
  selector: "app-customer",
  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.css"]
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer = new Customer();
  emailMessage = "";

  get addresses(): FormArray {
    return <FormArray>this.customerForm.get("addresses");
  }

  private validationMessages = {
    required: "Please enter your email address.",
    email: "Please enter a valid email address."
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(3)]],
      lastName: ["", [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group(
        {
          email: ["", [Validators.required, Validators.email]],
          confirmEmail: ["", Validators.required]
        },
        { validators: emailCompare }
      ),
      phone: [""],
      notification: ["email"],
      rating: [null, ratingRange(1, 5)],
      sendCatalog: true,
      addresses: this.fb.array([this.buildAddresses()])
    });

    this.customerForm
      .get("notification")
      .valueChanges.subscribe(val => this.setNotification(val));

    const emailControl = this.customerForm.get("emailGroup.email");
    emailControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(val => this.setMessage(emailControl));

    /*this.customerForm = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(),
      sendCatalog: new FormControl(true)
    });*/
  }

  private setMessage(c: AbstractControl): void {
    this.emailMessage = "";
    if ((c.dirty || c.touched) && c.errors) {
      this.emailMessage = Object.keys(c.errors)
        .map(key => this.validationMessages[key])
        .join(" ");
    }
  }

  populateTestData(): void {
    this.customerForm.patchValue({
      firstName: "Anand",
      lastName: "Musaddi",
      // email: "anand.musaddi@wellsfargo.com",
      sendCatalog: true
    });
  }

  setNotification(notification: string): void {
    const phoneControl = this.customerForm.get("phone");
    if (notification === "text") {
      phoneControl.setValidators([Validators.required]);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  save() {
    console.log(this.customerForm);
    console.log("Saved: " + JSON.stringify(this.customerForm.value));
  }

  buildAddresses(): FormGroup {
    return this.fb.group({
      addressType: "home",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zip: null
    });
  }

  addAddress(): void {
    this.addresses.push(this.buildAddresses());
  }
}
