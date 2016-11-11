# Grafaro.

## Domen

**Grafaro** je veb-aplikacija za vizuelizaciju reprezentacije grafova i izvršavanje algoritama i operacija nad njima. Omogućava da više ljudi kolaborativno upravlja izgledom i ponašanjem algoritama nad grafovima, što ga čini idealnim za učenje teorije grafova.

Korisnici **Grafaro** veb-aplikacije međusobno crtaju i modifikuju graf, posmatraju vizuelizaciju odabranog algoritma i komuniciraju putem četa.

Frontend je implementiran korišćenjem frejmvorka Angular 2.x i biblioteka graphlib, vis.js, ngrx/store i RxJS. Razvijan je korišćenjem jezika TypeScript 2.x. Bekend je takođe razvijan u jeziku TypeScript, na Node.js izvršnom okruženju. Od glavnih biblioteka korišćen je Express.js i Mongo Driver. Za bazu podataka korišćena je MongoDB.

## Funkcionalnosti

- Crtanje i manipulacija grafom
- Manipulacija grafom preko matrica
- Odabir predefinisanog koda i parametrizacija
- Praćenje izvršavanja koda korak po korak
- Čet među učesnicima
- Podešavanja radnog okruženja

### Okruženje

Node.js je višeplatformsko izvršno okruženje za JavaScript otvorenog koda koje služi za razvoj raznovrsnih alata i aplikacija. Mada Node.js nije okvir za JavaScript, mnogo osnovnih modula je pisano u JavaScript, i programeri mogu da pišu nove module u JavaScriptu (i dele ih preko `npm` repozitorijuma).

Radi se o događajima vođenom arhitekturom za rad sa asinhronim ulazom i izlazom. Ovakva arhitektura omogućava optimizovan protok i skalabilnost kod veb-aplikacija sa mnogo U/I operacija, kao i za veb-aplikacije u realnom vremenu (npr. programi za komunikaciju i video-igre).

### Baza

MongoDB (od engleske reči *humongous* što znači *enormno*, *ogromno*) je besplatna višeplatformaska baza podataka zasnovana na čuvanju dokumenata. Klasifikuje se pod NoSQL baze podataka i koristi JSON-olike dokumente.

### Okviri i jezici

#### Angular (2.x)

Angular je strukturni okvir za izgradnju dinamičkih veb-aplikacija. Koristi nadgradnju HTML-a kao šablonski jezik i pruža mogućnost proširenja sintakse za jasno i jezgrovito predstavljanje komponenti. Sprega podataka (eng. *data binding*) i ubrizgavanje zavisnosti (eng. *dependency injection*) odstanjuje većinu nepotrebnog koda.

#### TypeScript (2.x)

TypeScript je nadskup jezika JavaScript. Polazi od iste sintakse i semantike koju JavaScript programeri već poznaju. Transpajlira se u čist i jednostavan JavaScript kod koji se može pokrenuti na bilo kom brauzeru, u Node.js orkućenju, ili u bilo kom drugom endžinu koji podržava ECMAScript 3 (ili noviji standard).

Omogućava strogo statičko tipiziranje i nameće objektno-orijentisani pristup kodiranju. Podržava najnovije funkcionalnosti, uključući i one iz ECMAScript 2015, 2016, pa i novije (predložene standarde od strane TC39).

#### Express.js

Express.js je okvir otvorenog koda za Node.js. Dizajniran je za izgradnju veb-aplikacija i API-ja. U pitanju je *de fakto* standardni serverski okvir. Relativno je minimalan, ali je moguće proširita ga korišćenjem bogate biblioteke dodataka. 

### Biblioteke

#### graphlib

graphlib je JavaScript biblioteka koja pruža strukture podataka za rad sa usmernim i neusmerenim multigrafovima zajedno sa algoritmima koji se mogu primenjivati nad njima.

#### vis.js

vis.js je dinamička biblioteka za vizeulizaciju za izvršenje na brauzeru. Projektovana je za brzo i lako upravljanje velikim količinama dinamičkih podataka, kao i za jednostavnu manipulaciju nad tim podacima. Sastoji se od sedam komponenti, a biće korišćena komponenta Network.

#### @ngrx/store

@ngrx/store je okvir projektovan da pomogne u razvoju Angular aplikacija visokih performansi i konzistencije. Osnovna načela su:

- stanje koje predstavlja jednu nepromenljivu strukturu podataka,
- akcije koje opisuju promenu stanja,
- svoditelj (eng. *reducer*) koji je čista funkcija koje uzima prethodno stanje i sledeću akciju kako bi sračunao novo stanje,
- stanje kom se pristupa iz skladišta (eng. *store*) koji je posmatrana (eng. *observable*) promenljiva stanja i posmatrač (eng. *observer*) akcijā.

Ova osnovna načela omogućavaju pravljenje komponenti koje mogu da koriste strategiju detekcije promena `OnPush` koja omugćava inteligentnu detekciju promena visoke perforamanse kroz aplikaciju.

#### RxJS

Reaktivne ekstenzije za Javaskript (RxJS) su skup biblioteka za izgradnju asinhronih i događajima vođenih programa korišćenjem sekvenci posmatranih promenljivih i lančanih operatora upita koje većina programera već zna kroz ["sedam veličanstvenih"](https://code.tutsplus.com/tutorials/what-they-didnt-tell-you-about-es5s-array-extras--net-28263) iterativnih funkcija u Javaskriptu.
Korišćenjem RxJS-a, programeri mogu da predstave asinhrone tokove podataka preko posmatranih promenljivih, da vrše upite nad asinhronim tokovima podataka korišćenjem raznih operatora, i da parametrizuju konkurentan pristup asinhronim tokovima podataka korišćenjem raspoređivačā (eng. *scheduler*).
