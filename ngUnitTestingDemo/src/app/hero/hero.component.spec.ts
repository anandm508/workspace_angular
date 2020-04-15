import { HeroComponent } from "./hero.component";
import { TestBed, ComponentFixture } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA, Directive, Input } from "@angular/core";
import { By } from "@angular/platform-browser";

@Directive({
  selector: "[routerLink]",
  //host links click event of the parent tag with onClick event of the directive
  host: { "(click)": "onClick()" },
})
export class RouterLinkDirectiveStub {
  @Input("routerLink") linkParams: any;
  navigatedTo: any = null;
  onClick() {
    this.navigatedTo = this.linkParams;
  }
}
describe("HeroComponent (Shallow Tests)", () => {
  let fixture: ComponentFixture<HeroComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeroComponent, RouterLinkDirectiveStub],
      //schemas: [NO_ERRORS_SCHEMA], //Required when there is a need to ignore certain unrecognized html elements
    });
    fixture = TestBed.createComponent(HeroComponent);
  });

  it("should have the correct hero", () => {
    fixture.componentInstance.hero = {
      id: 1,
      name: "Wonderwoman",
      strength: 101,
    };

    expect(fixture.componentInstance.hero.id).toBe(1);
  });

  it("should have the hero name in the anchor tag", () => {
    fixture.componentInstance.hero = {
      id: 1,
      name: "Wonderwoman",
      strength: 101,
    };

    fixture.detectChanges();

    //Using debug element
    let de = fixture.debugElement.query(By.css("a"));
    expect(de.nativeElement.textContent).toContain("Wonderwoman");

    //Using native element
    expect(fixture.nativeElement.querySelector("a").textContent).toContain(
      "Wonderwoman"
    );
  });
});
