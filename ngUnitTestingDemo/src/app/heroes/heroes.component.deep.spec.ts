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

  it(`should call heroService.deleteHero when the
    Hero Component's delete button is clicked`, () => {
    spyOn(fixture.componentInstance, "delete");
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    //run ngOnit
    fixture.detectChanges();

    const heroComponentDEs = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );

    //First way of emitting event
    //Uses click event triggering
    heroComponentDEs[0]
      .query(By.css("button"))
      .triggerEventHandler("click", { stopPropagation: () => {} });

    //Second way of emitting event
    //Using directly the emitter in the component
    //Preferred way of using child bindings in a parent
    (<HeroComponent>heroComponentDEs[1].componentInstance).delete.emit(
      undefined
    );

    //Third way of emitting event
    heroComponentDEs[2].triggerEventHandler("delete", null);

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[1]);
    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[2]);
    expect(mockHeroService.deleteHero).toHaveBeenCalled();
  });

  it("should add a new hero to the hero list when the add button is clicked", () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    //run ngOnit
    fixture.detectChanges();
    const name = "Ironman";
    mockHeroService.addHero.and.returnValue(
      of({ id: 4, name: name, strength: 89 })
    );
    const input = fixture.debugElement.query(By.css("input")).nativeElement;
    const button = fixture.debugElement.query(By.css("button"));

    input.value = name;
    button.triggerEventHandler("click", null);

    fixture.detectChanges();

    //Using nativeElement
    let heroText = fixture.nativeElement.querySelector("ul").textContent;
    expect(heroText).toContain(name);

    //Using debugElement
    heroText = fixture.debugElement.query(By.css("ul")).nativeElement
      .textContent;
    expect(heroText).toContain(name);

    //Using HeroComponent Directive
    const addedHeroComponent: HeroComponent = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    )[3].componentInstance;
    expect(addedHeroComponent.hero.name).toEqual(name);
  });
});
