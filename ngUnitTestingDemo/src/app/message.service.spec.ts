import { MessageService } from "./message.service";
describe("MessageService", () => {
  let service: MessageService;
  beforeEach(() => {});
  it("should return empty when starting", () => {
    service = new MessageService();

    expect(service.messages.length).toBe(0);
  });
  it("should add a message when add is called", () => {
    service = new MessageService();

    service.add("message1");

    expect(service.messages.length).toBe(1);
  });

  it("should clear the messages when clear is called", () => {
    service = new MessageService();
    service.add("message1");

    service.clear();

    expect(service.messages.length).toBe(0);
  });
});
