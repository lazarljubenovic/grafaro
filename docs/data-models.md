# Model perzistencije i podataka

U ovom dokumentu će biti opisani i objašnjeni model podataka i perzistencije korišćeni u Grafaro aplikaciji.

U delu dokumenta koji se bavi modelom perzistencije će biti opisana Mongoose šema na osnovu koje se vrši čuvanje relevantnih podataka u bazu podataka aplikacije.

U delu dokumenta koji se bavi modelom podataka će biti opisane relevantne šeme podataka koje se koriste u front-end delu aplikacije, uključujući i opis poruka koje se razmenjuju korišćenjem soketa.
## Model perzistencije

### Osnovna razmatranja

Grafaro aplikacija, kao osnovni model na kome je bazirana cela funkcionalnost, koristi graf. Iz tog razloga je odlučeno da se kao baza podataka koristi neka document baza, odnosno MongoDB, radi lakšeg čuvanja ne-striktno struktuiranih podataka.

Korisnici mogu da pristupe svim funkcionalnostima aplikacije tek što nakon autentifikuju korišćenjem već postojećeg Facebook, Twitter ili Google naloga. Na taj način je omogućeno da svaki korisnik zada sebi neki svojstven nadimak kako bi ga mogli prepoznati ostali korisnici aplikacije.

Radi boljeg korisničkog iskustva, aplikacija omogućava čuvanje trenutno nacrtanog grafa, kao i učitavanje nekog od grafova koji postoje u bazi. Zbog toga su informacije o grafovima direktno vezane za korisnika, a sam graf se jednoznačno identifikuje kombinacijom imena korisnika i imena grafa. 

Pored ova dva modela, u bazi se ne čuva ništa više, jer nema razloga za tako nečim:

* Algoritmi su direktno vezani za front-end deo aplikacije i ne dobijaju se od servera.
* Sobe za rad se brišu nakon napuštanja poslednjeg korisnika, a samim tim i cela razmena chat poruka.

### Šema baze

Kao mapper je korišćena biblioteka Mongoose. U nastavku je dat izgled šeme grafa i šeme korisnika. Napomenimo još jednom da se grafovi čuvaju kao niz koji je atribut šeme korisnika.
#### Korisnik - `userSchema` dokument u bazi:

```
{
   socialId: String,
   displayName: String,
   graphs: [graphSchema],
}
```

#### Graf - `graphSchema`:

```
{
   lastModified: Number,
   name: String,
   graph: {
       nodes: [{
           _id: false,
           id: String,
           label: String,
           position: {
               x: Number,
               y: Number,
           },
           weight: Number
       }],
       edges: [{
           _id: false,
           id: String,
           from: String,
           to: String,
           label: String,
           weight: Number,
       }],
       nextNodeId: Number,
       nextEdgeId: Number,
   },
}
```

## Model podataka

### Osnovna razmatranja

Za pribavljanje modela perzistencije i njihovo transformisanje u odgovarajući model podataka definisan je RESTful API. Sam model perzistencije je napravljen tako da je potrebno minimalno transformisanje u model podataka. Većina API ruta vraća model podataka na način na koji je on sačuvan u bazi, dok samo nekoliko ruta vrši transformaciju u odgovarajući oblik koji se očekuje na front-endu.

Što se tiče modela poruka koje se razmenjuju u okviru implementirane message-passing funkcionalnosti, koristi se osnovni format koji u sebi ima polje za podatke koji se prosleđuju, tip poruke i identifikator sobe kojoj se poruka prosleđuje. Jedina promenljiva stvar je tip polja za podatke koji je u sprezi sa tipom poruke koja se prima, odnosno šalje.

### Modeli podataka za rute

#### GET `user`

Ruta koja vraća sve korisnike u sistemu. Vraća se niz korisnika, pri čemu svaki element odgavara modelu perzistencije korisnika datom u sekciji [šema baze](#šema-baze).

#### GET `user/social/:id`

Ruta koja vraća korisnika na osnovu njegovog identifikatora dobijenog prilikom autentifikacije. Vraća se jedan korisnik, pri čemu model odgovara modelu perzistencije korisnika datom u sekciji [šema baze](#šema-baze).

#### GET `user/:id`

Identično kao ruta `user/social/:id`.

#### GET graph

Ruta koja vraća sve grafove u sistemu. Šema je data u nastavku:

```
 {
   name: string;
   graph: {
       lastChange: number;
       id: number
       name: string;
   }[];
}
```

#### GET `graph/:userName/:graphName`

Ruta koja vraća graf određenog korisnika i određenog imena grafa. Šema je identična [šemi grafa](#šema-baze) datoj u modelu perzistencije.

#### PUT `user`

Ruta za kreiranje novog korisnika. Kao parametar rute je potrebno navesti socialId korisnika dobijen prilikom autentifikacije.

#### POST `user/:id`

Ruta za ažuriranje korisnikovog imena za prikaz (displayName). Parametar rute je korisnikov id u bazi, dok je parametar dat kroz body zahteva ime koje korisnik menja.

#### PUT `graph`

Ruta za dodavanje grafa. Parametri rute su šema grafa koja odgovara šemi perzistencije, ime korisnika i ime grafa.

### Model podataka poruka

#### Osnovna poruka - `Message<Type>`

```
{
   payload: Type;
   type: string;
   roomId: string;
}
```

`Type` može imati neki od narednih tipova.

##### Chat poruka - `ChatMessageInfo`

```
{
   timeStamp: Date;
   senderName: string;
   message: string;
}
```

##### Poruka pristupa - `JoinMessage`

```
{
   roomId: string;
   error: string;
}
```

##### Master poruka - `MasterMessage`

```
{
   isMaster: boolean;
}
```

##### Poruka o promeni podataka sobe - `RoomEdit`

```
{
   name: string;
   description: string;
}
```

##### Informacije o sobama -- `RoomInfo` i RoomInfoMessage

```
{
   id: string;
   userCount: number;
   name: string;
   description: string;
   master: string;
}
```

Informacije o svim sobama je enkapsulirana kao niz RoomInfo poruka:

```
{
   info: RoomInfo[];
}
```

##### Poruka o grafu - GraphMessage

```
{
   graph: Graph;
}
```

Tip `Graph` odgovara modelu grafa opisanom u modelu perzistencije.

##### Poruka o algoritmu i opcijama - `AlgorithmMessage`

```
{
   info: {
       algorithm: string;
       options: any;
   };
}
```

`options` je zamišljen kao promenjivi tip koji zavisi od odabranog algoritma.

##### Poruka o indeksu trenutnog stanja - `StateMessage`

```
{
   stateIndex: number;
}
```
