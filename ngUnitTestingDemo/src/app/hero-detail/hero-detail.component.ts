import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

import { Hero } from "../hero";
import { HeroService } from "../hero.service";

@Component({
  selector: "app-hero-detail",
  templateUrl: "./hero-detail.component.html",
  styleUrls: ["./hero-detail.component.css"],
})
export class HeroDetailComponent implements OnInit {
  @Input() hero: Hero;
  useDeBounce = true;
  usePromise = false;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get("id");
    this.heroService.getHero(id).subscribe((hero) => (this.hero = hero));
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    //Best to implement debounce using rxJS debounceTime operator, this debounce implemenation is not working well with angular
    //for the case of save just disable the button, to prevent further clicks
    if (!this.usePromise) {
      deBounce(
        () => {
          this.heroService.updateHero(this.hero).subscribe(() => {
            console.log(`Updated hero ${this.hero.name}`);
            this.goBack();
          });
        },
        250,
        !this.useDeBounce
      )();
    } else {
      var p = new Promise((resolve) => {
        this.heroService.updateHero(this.hero).subscribe(() => {
          this.goBack();
        });
        resolve();
      });
    }
  }
}

function deBounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
