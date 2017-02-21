# Arhitekturni opis aplikacije Grafaro

U ovom dokumentu je dat pregled funkcionalnosti, arhitekturnih i nefunkcionalnih zahteva za aplikaciju Grafaro.

## Funkcionalnosti

Grafaro je aplikacija koja služi za učenje algoritama koji se izvršavaju nad grafovima. Kao takva, njene osnovne funkcionalnosti su:

* Potpuna kontrola nad grafom: dodavanje, brisanje, preimenovanje čvorova i potega, kao i njihovo premeštanje
* Manipulacija grafa kroz matrični prikaz grafa
* Čuvanje i učitavanje nacrtanih grafova
* Odabir algoritama za praćenje (i učenje)
* Praćenje izvršenja algoritma korak-po-korak
* Praćenje trenutnog stanja algoritma sa pregledom liste promenljivih i njihovim vrednostima
* Praćenja stanja kroz bojenje grafa
* Podešavanja dodatnih opcija algoritma (npr. početnog čvora)

Kako je Grafaro i distribuirana aplikacija, ona takođe treba da podrži i sledeće funkcionalnosti:

* Mogućnost za kreiranje odvojenih soba u kojima će korisnici učiti, odnosno raditi
* Pregled svih trenutno dostupnih soba
* Pristup nekoj od postojećih soba
* Međusobnu kolaboraciju po principu master--slave
* Osnovni chat sa podrškom za Markdown

Kroz navedene funkcionalnosti je implementirana funkcionalna specifikacija projekta dobijena od strane predmetnih profesora i asistenata, data u nastavku:

* Snimanje crteža u relacionu bazu podataka korišćenjem Hibernate (ili nekog drugog) ORM alata.
* Podrška za istovremeni rad više klijenata na jednom dokumentu (crtežu, partiji igre itd.) pri čemu prvi korisnik koji je otvorio dokument može da unosi izmene, a svi ostali (obavezno podržati više) mogu u realnom vremenu da prate izmene. Ukoliko prvi korisnik (onaj koji unosi izmene) zatvori dokument, prvi sledeći korisnik koji je imao read-only pogled dobija read-write privilegiju.
* Implementirati sinhronizaciju dokumenta kod svih klijenata korišćenjem neke message-passing biblioteke (jeromq).
* Omogućiti istovremeni rad na više dokumenata (većeg broja grupa korisnika).
* Omogućiti adekvatnu vizuelizaciju većeg broja različitih elemenata iz modela podataka pri čemu je moguće svakom elementu dodeliti tekstualnu labelu.
* Omogućiti iscrtavanje veza između objekata modela podataka.
* Uvesti različita ograničenja prilikom uvođenja veza u model (nije moguće povezati bilo koji objekat sa bilo kojim drugim, ograničiti broj veza po objektu itd.).
* Prilikom implementacija na odgovarajućim mestima iskoristiti barem 3 različita projektna obrasca.

## Nefunkcionalni zahtevi i ograničenja

Prilikom projektovanja Grafaro aplikacije, ustanovljena je potreba za sledećim nefunkcionalnim zahtevima:

* Proširljivost (extensibility)
* Reupotrebljivost (reusability)
* Pouzdanost (reliability)
* Lakoća testiranja (testability)
* Lakoća korišćenja (usability)
* Dokumentacija
* Performanse
* Otpornost na greške (fault tolerance)
* Emocionalni faktori (emotional factors (fun, educational))
* Podrška za različite internet pregledače (cross-browser)
* Lako održavanje (maintainability)
* Otvoren kod (open source)

## Arhitekturni zahtevi

Na osnovu navedenih nefunkcionalnih zahteva (odnosno atributa kvaliteta) i ograničenja, imamo sledeće arhitekturne zahteve:

- **Proširljivost** - Arhitektura aplikacije mora da bude takva da omogući lako dodavanje novih funkcionalnosti na bazi trenutne aplikacije. 
- **Reupotrebljivost** - Komponente aplikaciej treba da budu projektovane tako da mogu lako da se iskoriste u budućim projektima slične funkcionalnosti.
- **Pouzdanost** - Aplikacija ne sme da prikaže netačne rezultate izvršenja algoritama. Takođe ne sme doći do gubljenja poruka koje se razmenjuju između korisnika i servera.
- **Lakoća testiranja** - Komponente sistema treba projektovati tako da je njihovo testiranje lako, odnosno komponente treba da su u slaboj međusobnoj sprezi.
- **Lakoća korišćenja** - Korisnički interfejs treba da bude jednostavan i lak za korišćenje. Korisnik ne treba da provede više od pola minuta u razmišljanju o tome koji alat čemu služi.
- **Dokumentacija** - Kod treba da bude dobro dokumentavan korišćenjem JSDoc alata.
- **Performanse** - Odziv aplikacije pri normalnim uslovima korišćenja (do 15 čvorova u grafu) ne sme da bude veći od 3 sekunde.
- **Otpornost na greške** - Prilikom nedostupnosti servera, aplikacija treba da bude u stanju da pruži funkcionalnosti na nivo jednog korisnika.
- **Lako održavanje** - Komponente sistema treba da imaju jednostavna i lako razumljiva imena koja opisuju njihovu svrhu u cilju lakšeg održavanja koda u budućnosti i lakog integrisanja novih članova tima u ceo proces.
- **Emocionalni faktori** - Aplikacija treba da ostavi jak emotivni utisak učenja na korisnike, kako bi oni lakše prihvatili i stekli potrebno znanje.
- **Otvoren kod** - Kod aplikacije treba da bude dostupan na javnom repozitorijumu na GitHub-u. 
- **Podrška za raličite internet pregledače** - Rad u aplikaciji treba da je moguć korišćenjem bilo kog **modernog** internet pregledača (Google Chrome, Mozilla Firefox i Microsoft Edge) u njihovim najnovijim verzijama.
