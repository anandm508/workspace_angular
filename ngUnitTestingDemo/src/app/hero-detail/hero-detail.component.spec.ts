import { FormsModule } from "@angular/forms";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { HeroService } from "./../hero.service";
import { HeroDetailComponent } from "./hero-detail.component";
import {
  TestBed,
  fakeAsync,
  flush,
  ComponentFixture,
  tick,
  async,
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
    fixture.componentInstance.useDeBounce = false;
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
    spyOn(fixture.componentInstance, "save").and.callThrough();
    spyOn(fixture.componentInstance, "goBack").and.callThrough();

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
    expect(mockHeroService.updateHero).toHaveBeenCalled();
    expect(fixture.componentInstance.goBack).toHaveBeenCalled();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  /**
   * Using done async call back and setTimeout for testing async logic in save()
   */
  it("should update hero name using deBounce using done", (done) => {
    fixture.componentInstance.useDeBounce = true;
    fixture.detectChanges();

    fixture.componentInstance.save();

    setTimeout(() => {
      expect(mockHeroService.updateHero).toHaveBeenCalled();
      done();
    }, 300);
  });

  /**
   * Using fakeAsync helper for testing async logic in save()
   * Can we be used to test setTimeout and Promises
   * Preferred than async
   */
  it("should update hero name using deBounce using faleAsync helper", fakeAsync(() => {
    fixture.componentInstance.useDeBounce = true;
    fixture.detectChanges();

    fixture.componentInstance.save();
    //tick(250);
    //alternate of tick, where clock in zone.js is
    //forwarded untill all the async tasks have completed
    flush();

    expect(mockHeroService.updateHero).toHaveBeenCalled();
  }));

  /**
   * Using async helper for testing promise logic in save()
   * async works well with promises only
   * fixture.whenStable returns a promise which executes after all the promises in the context of zone.js finishes
   */
  it("should update hero name using deBounce using async helper", async(() => {
    fixture.componentInstance.usePromise = true;

    fixture.detectChanges();

    fixture.componentInstance.save();

    fixture.whenStable().then(() => {
      expect(mockHeroService.updateHero).toHaveBeenCalled();
    });
  }));
});
