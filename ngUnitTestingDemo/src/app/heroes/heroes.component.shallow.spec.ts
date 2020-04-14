import { HeroService } from "./../hero.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroesComponent } from "./heroes.component";
import {
  NO_ERRORS_SCHEMA,
  Component,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { of } from "rxjs";
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";

@Component({
  selector: "app-hero",
  template: `<div></div>`,
})
class FakeHeroComponent {
  @Input() hero: Hero;
}
describe("HeroesComponent (Shallow Tests)", () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  beforeEach(() => {
    HEROES = [
      { id: 1, name: "Shaktiman", strength: 10 },
      { id: 2, name: "WonderWoman", strength: 95 },
      { id: 3, name: "Thor", strength: 85 },
    ];
    mockHeroService = jasmine.createSpyObj([
      "getHeroes",
      "addHero",
      "deleteHero",
    ]);
    TestBed.configureTestingModule({
      declarations: [HeroesComponent, FakeHeroComponent],
      //schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: HeroService, useValue: mockHeroService }],
    });
    fixture = TestBed.createComponent(HeroesComponent);
  });

  it("should set heroes correctly from the service", () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();

    expect(fixture.componentInstance.heroes.length).toEqual(3);
  });

  it("should create one li for each hero", () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css("li")).length).toEqual(3);
  });
});
