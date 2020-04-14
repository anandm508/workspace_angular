import { HeroService } from "./hero.service";
import { TestBed, inject } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { MessageService } from "./message.service";

describe("HeroService", () => {
  let mockMessageService;
  let httpTestingController: HttpTestingController;
  let service: HeroService;

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj(["add"]);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HeroService,
        {
          provide: MessageService,
          useValue: mockMessageService,
        },
      ],
    });
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(HeroService);
  });

  describe("getHero", () => {
    it("should call get with the correct URL with inject", inject(
      [HeroService, HttpTestingController],
      (
        heroService: HeroService,
        httpTestingController: HttpTestingController
      ) => {
        heroService.getHero(4).subscribe((hero) => {
          expect(hero.id).toEqual(4);
        });

        const req = httpTestingController.expectOne("api/heroes/4");
        req.flush({ id: 4, name: "Black Widow", power: 15 });
      }
    ));

    it("should call get with the correct URL with TestBed.get", () => {
      service.getHero(4).subscribe((hero) => {
        expect(hero.id).toEqual(4);
      });
      //In case of unexpected calls test will fail, the httpTestingController.verify() is behind it
      //service.getHero(3).subscribe();
      const req = httpTestingController.expectOne("api/heroes/4");
      req.flush({ id: 4, name: "Black Widow", power: 15 });

      httpTestingController.verify();
    });
  });
});
