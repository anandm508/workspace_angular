import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { Hero } from "../hero";

@Component({
  selector: "app-hero",
  templateUrl: "./hero.component.html",
  styleUrls: ["./hero.component.css"],
})
export class HeroComponent implements OnInit {
  ngOnInit(): void {
    console.log("Inside ngOnInit of HeroComponent");
  }
  @Input() hero: Hero;
  @Output() delete = new EventEmitter();

  onDeleteClick($event): void {
    $event.stopPropagation();
    this.delete.next();
  }
}
