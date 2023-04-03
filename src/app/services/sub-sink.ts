import { Subscription } from "rxjs";

export class SubSink {
  protected subs = new Subscription();

  set sink(subscription: Subscription | undefined) {
    this.subs.add(subscription);
  }

  unsubscribe(): void {
    this.subs.unsubscribe();
  }
}
