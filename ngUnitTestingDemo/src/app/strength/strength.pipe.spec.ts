import { StrengthPipe } from "./strength.pipe";

describe("StrengthPipe", () => {
  it("should display weak if strength is less than 5", () => {
    let pipe = new StrengthPipe();

    const output = pipe.transform(5);

    expect(output).toEqual("5 (weak)");
  });

  it("should display strong if strength is 10", () => {
    let pipe = new StrengthPipe();

    const output = pipe.transform(10);

    expect(output).toEqual("10 (strong)");
  });

  it("should display unbelievable if strength is 20 or more", () => {
    let pipe = new StrengthPipe();

    const output = pipe.transform(20);

    expect(output).toEqual("20 (unbelievable)");
  });
});
