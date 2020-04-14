import { HeroService } from "./../hero.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroesComponent } from "./heroes.component";
import { HeroComponent } from "../hero/hero.component";
import { Hero } from "../hero";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";

describe("HeroesComponent (Deep Tests)", () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES: Hero[];

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
      declarations: [HeroesComponent, HeroComponent],
      providers: [{ provide: HeroService, useValue: mockHeroService }],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(HeroesComponent);
  });

  it("should render each hero as a hero component", () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    //run ngOnit
    fixture.detectChanges();

    const heroComponentDEs = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );
    expect(heroComponentDEs.length).toBe(3);
    HEROES.forEach((hero, index) => {
      expect(heroComponentDEs[index].componentInstance.hero.name).toEqual(
        hero.name
      );
    });
  });
});
