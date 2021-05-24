import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";


class StorageModel {
  store: Map<string, object>;

  constructor() {
    this.store = new Map<string, object>();
  }
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storageSubject: BehaviorSubject<StorageModel>;
  public storage$: Observable<StorageModel>;

  constructor() {
    this.storageSubject = new BehaviorSubject<StorageModel>(new StorageModel());
    this.storage$ = this.storageSubject.asObservable();
  }

  public getStorage(): StorageModel {
    return this.storageSubject.getValue();
  }

  public getStorageKey(key: string): object | undefined {
    return this.storageSubject.getValue().store.get(key);
  }

  public setInStore(key: string, valore: object) {
    const storege = this.getStorage();
    storege.store.set(key, valore);
    this.storageSubject.next({...storege});
  }

}
