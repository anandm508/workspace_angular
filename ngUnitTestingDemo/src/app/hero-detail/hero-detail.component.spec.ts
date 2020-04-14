import { FormsModule } from "@angular/forms";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { HeroService } from "./../hero.service";
import { HeroDetailComponent } from "./hero-detail.component";
import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  flush,
} from "@angular/core/testing";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";

describe("HeroDetailComponent", () => {
  let fixture: ComponentFixture<HeroDetailComponent>;
  let mockHeroService, mockActivatedRoute, mockLocation;
  beforeEach(() => {
    mockLocation = jasmine.createSpyObj(["back"]);
    mockActivatedRoute = {
      snapshot: { paramMap: { get: (id?: string) => 3 } },
    };
    mockHeroService = jasmine.createSpyObj(["getHero", "updateHero"]);
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [HeroDetailComponent],
      providers: [
        {
          provide: HeroService,
          useValue: mockHeroService,
        },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: Location,
          useValue: mockLocation,
        },
      ],
    });
    fixture = TestBed.createComponent(HeroDetailComponent);
    mockHeroService.getHero.and.returnValue(
      of({
        id: 3,
        name: "Ironman",
        strength: 55,
      })
    );
    mockHeroService.updateHero.and.returnValue(
      of({
        id: 3,
        name: "Captain Ameria",
        strength: 55,
      })
    );
  });

  it("should display the hero name in the h2 tag", fakeAsync(() => {
    fixture.detectChanges();
    flush();

    expect(fixture.componentInstance.hero.name).toEqual("Ironman");
    expect(fixture.nativeElement.querySelector("h2").textContent).toContain(
      "IRONMAN"
    );
    expect(fixture.nativeElement.querySelector("input").value).toContain(
      "Ironman"
    );

    expect(mockHeroService.getHero).toHaveBeenCalled();
  }));

  it("should update the hero name", () => {
    spyOn(fixture.componentInstance, "save");

    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector("input");

    input.value = "Captain America";
    input.dispatchEvent(new Event("input"));

    fixture.debugElement
      .queryAll(By.css("button"))[1]
      .triggerEventHandler("click", null);

    expect(fixture.componentInstance.hero.name).toEqual("Captain America");
    expect(fixture.componentInstance.save).toHaveBeenCalled();
    expect(mockHeroService.getHero).toHaveBeenCalled();
    //expect(mockHeroService.updateHero).toHaveBeenCalled();
  });
});
