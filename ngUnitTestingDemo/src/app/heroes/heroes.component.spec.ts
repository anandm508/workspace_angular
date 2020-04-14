import { HeroService } from "./../hero.service";
import { Hero } from "../hero";
import { HeroesComponent } from "./heroes.component";
import { of } from "rxjs";
describe("HeroesComponent (Isolated Test)", () => {
  let component: HeroesComponent;
  let HEROES: Hero[];
  let mockHeroService;

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

    component = new HeroesComponent(mockHeroService);
  });

  describe("delete", () => {
    it("should remove indicated hero from heroes list", () => {
      mockHeroService.deleteHero.and.returnValue(of(true));
      component.heroes = HEROES;

      component.delete(HEROES[2]);

      expect(component.heroes.length).toBe(2);
    });

    it("should delete hero", () => {
      mockHeroService.deleteHero.and.returnValue(of(true));
      component.heroes = HEROES;

      component.delete(HEROES[2]);

      expect(
        component.heroes.find((hero, index, obj) => hero.id === 3)
      ).toBeUndefined();
    });

    it("should call deleteHero", () => {
      mockHeroService.deleteHero.and.returnValue(of(true));
      component.heroes = HEROES;

      component.delete(HEROES[2]);

      //expect(mockHeroService.deleteHero).toHaveBeenCalled();
      expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
    });
  });
});
