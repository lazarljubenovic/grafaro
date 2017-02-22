# Dodavanje novih algoritama

Grafaro pruža mogućnost dodavanja novih algoritama u aplikaciju.  

## Definisanje algoritma

Za definiciju novog algoritma je neophodno izvesti klase `AlgorithmBase` i `AlgorithmState`. 

### Klasa `AlgorithmBase`

Klasa `AlgorithmBase` je osnova algoritma. Izvedena klasa, pored implementiranja svih apstraktnih metoda i svojstava, treba da ima dekorator `@Algorithm`.

#### Naziv algorithma (`name`)

Atribut `name` tipa string navodi se u dekoratoru `@Algorithm` i predstavlja ime algoritma. Ovo ime će biti iskorišćeno za prikaz u komponenti za izbor algoritma.

#### Jedinstveni identifikator algoritma (`abbr`)

Atribut `abbr` tipa string navodi se u dekoratoru `@Algorithm` i to je identifikator algoritma i mora biti jedinstven u celoj aplikaciji. Po konvenciji je ovo skraćenica imena algoritma. Ne prikazuje se krajnjem korisniku ali se koristi kao HTML identifikator u listi opcija.

#### Izvorni kod za prikaz (`code`)

Atribut `code` je string koji predstavlja izgled koda koji će se prikazati krajnjem korisniku i koji će koristik koristiti radi razumevanja rada algoritma, kao i za praćenje trenutne pozicije izvršenja. Ovaj kod se **ne** pokreće, ali se provlači kroz lekser (zbog bojenja kod), pa se stoga mora raditi o validnom EcmaScript kodu.

#### Niz promenljivih koje se prate (`trackedVariables`)

Atribut `trackedVariables` je niz stringova u kome se navode imena promenljivih, i to onakva kakva su definisana u atributu `code`. Ove promenljive će biti _praćene_, odnosno biće prikazane u tabeli ispod grafa gde će krajnji korisnik moći da vizuelno pogleda sadržaj memorijskih lokacija u tekućem stanju.

#### Funkcija za evaluaciju algoritma (`evaluateStatesFor`)

Funkcija `evaluateStatesFor` prima parametar tipa `Graph` i `rootId`, a vraća niz čiji su elementi tipa `AlgoritmState`. Ovo je "srž" algoritma tj. ovde treba definisati sam tok izvršenja. Umesto klasične implementacije gde je izlaz neka vrednost, niz, ili stablo, izlaz iz funkcije treba da bude niz stanja. Ovo su stanja kroz koja će korisnik prolaziti. Tip `AlgoritmState` ne treba koristiti direktno (radi se o apstraktnoj klasi), već se od dizajnera algoritma očekuje da tu klasu izvede i napravi svoju ličnu predstavu stanja.

### Klasa `AlgorithmState`

Kao što je gore pomenuto, treba izvesti i klasu `AlgorithmState`. Konkretna klasa ne treba da bude vidljiva van modula algoritma, pa se po konvenciji uvek bira kratko i jednostavno ime `State`.

Implementacija ove klase se svodi na listu atributa i njihovom semantičkom opisu kroz Tajpskriptove dekoratore. Ovaj semantički opis se koristi za generisanje informacija o trenutnom stanju u tabeli ispod grafa, kao i u samom grafu. U ove dodatne informacije spadaju tip (čvor, poteg, itd), boja, oblik i anotacije.

#### Tip (`TrackedVar`)

Tip se definiše dekoratorom atributa `TrackedVar`. Ovo je fabrika-dekorator i prima jedan od sledećih stringova: `node`, `edge`, `node-number`, `node-node` i `number` (mada je i ova lista lako proširljiva u okviru `DebugTableComponent` klase, gde treba definisati dodatne CSS stilove za novododatu klasu). Ovime se generičkim stringovima dodeljuje semantičko značenje u vezi s grafom, a sama implementacija klase ostaje jednostavna jer se radi o stringovima, pa dizajner algoritma ne mora da vodi računa o tipovima podataka dok manipuliše stanjem.

#### Boja (`Color`)

Boja se definiše dekoratorom klase `Color`. I ovo je fabrika-dekorator i prima objekat koji ima dva svojstva, `nodes` i `edges`. Svaki od njih prima niz funkcija koje definišu pravila za bojenje.

Potpis funkcije je oblika `(state: State, label: string) => GrfColor | null`. Kada se funkcija bude pozvala, prilikom generisanja tabele i grafa, kao parametar `state` će se preneti konkretna instanca trenutnog stanja, što dizajneru algoritma pruža mogućnost da pristupi bilo kojoj promenljivoj koju je definisao u klasi (pa čak i onim koje nisu označene gorepomenutim dekoratorom `TrackedVar`, što znači da je moguće uz stanja čuvati i neke meta-podatke koje omogućuju dodatne opcije za prilagođavanje), a kao parametar `nodeLabel` će se proslediti labela za koju se trenutno isptuje kakva njena boja treba da bude.

Na primer, ako treba da trenutnu labelu obojimo u boju `Grf.CURRENT`, funkcija treba da izgleda ovako:

```
(state: State, nodeLabel: string) => state.u == nodeLabel ? GrfColor.ACCENT : null,
```

Pregled pravila se vrši redom kojim su definisana u nizu. Ako se vrati vrednost tipa enumeracije `GrfColor`, proalzak kroz pravila se prekida i čvor ili poteg uzima tu boju. Ako se vrati `null`, pretražvanje se nastavlja. U oba niza (`nodes` i `edges`) se automatski dodaje podrazumevano pravilo koje svaki čvor boji u podrazumevanu boju, `GrfColor.DEFAULT`.

#### Anotacije (`Annotations`)

Anotacije su dodatne informacije o čvorovima i potezima (npr. težina) koje se prikazuju na grafu. Definišu se dekoratorom klase `Annotations`. U pitanju je fabrika-dekorator koji prima objekat sa dva svojstva, `nodes` i `edges`.

`nodes` prima niz objekata definisnih sledećim interfejsom.

```
{
    position: {r: number, phi: number};
    style: string;
    font: string;
    ruleFunction: (state: AlgorithmState, label: string) => string;
}
```

U `position` se prosleđuje tačka zapisana u polarnim koordinatama kojom se određuje tačna pozicija u odnosu na centar čvora.

`style` je string koji se direktno prosleđuje [`fillStyle` svojstvu HTML5 kanvasa](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle) i koristi se za iscrtavanje slova.
 
Slično, `font` se koristi kao [`font` svojstvo HTML5 kanvasa](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font) za renderovanje fonta i pridruženih stilova.

`ruleFunction` je funkcija koja na osnovu stanja algoritma i labele za koju se anotacija određuje vraća string koji će biti ispisan uz čvor ili poteg na definisanoj poziciji i definisanim stilom. Slična je funkciji iz dekoratora za određivanje boje.


## Registrovanje algoritma

Kako bi se algoritam našao među algoritmima koji su ponuđeni krajnjem korisniku, neophodno je registrovati ga. Ovo se obavlja prosleđivanjem niza klasa (a **ne** njihovih instanci!) statičkoj metodi `forRoot` modula `ProjectView` prilikom njegove registracije u glavni modul Angular aplikacije (`AppModule`).


