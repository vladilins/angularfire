import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class FirebaseService {
  listings: Observable<any[]>;
  constructor(db: AngularFirestore) {
    this.listings = db.collection("listings").valueChanges();
  }

  getListings() {
    return this.listings;
  }
}

interface Listings {
  $key?: string;
  title?: string;
  type?: string;
  image?: string;
  city?: string;
  owner?: string;
  bedrooms?: string;
}
