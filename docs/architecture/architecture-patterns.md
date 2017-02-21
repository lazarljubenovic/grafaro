# Arhitekturni obrasci aplikacije Grafaro

U ovom dokumentu će biti objašnjeni upotrebljeni obrasci u projektovanju aplikacije Grafaro.

## Slojeviti obrazac

Osnovni arhitekturni obrazac je slojeviti (_layered_) obrazac u 3 sloja. Slojevi su:

1. **Serverski sloj** -- sloj koji implementira kompletnu serversku logiku
2. **Proxy sloj** -- međusloj koji predstavlja posrednika između klijenta i servera
3. **Klijentski sloj** -- sloj u kome je implementirana komplenta biznis logika aplikacije

Pored ovog osnovnog obrasca, u projektovanju aplikacije su primenjena i još dva obrasca: **publish--subscribe** za razmenu poruka između klijenata i **MVC** na klijentskom sloju aplikacije koji će biti zasebno objašnjeni u ostatku dokumenta.

### Serverski sloj

Ovaj sloj je sastavljan od dve komponente:

1. RESTful komponente koja je zadužena za izvršenje REST zahteva i
2. Komponenta sa temama koja je deo publish-subscribe obrasca (biće objašnjen u drugom delu ovog dokumenta).

RESTful komponenta je u direktnoj vezi sa bazom podataka. Izlazni interfejs realizuje preko HTTP protokola.

Komponenta sa temama ima zadatak da čuva sve korisnike koji su trenutno ulogovani na sistem, da prati ko je od njih pretplaćen na koju sobu, kao i da prosleđuje odgovarajuće poruke u odgovarajuće sobe. Takođe ima ulogu i čuvanja informacija o sobama, poput trenutnog grafa, algoritma, stanja koje se prati i slično. Izlazni interfejs se ostvaruje preko soketa.

Pregled serverskih komponenti i odgovarajućih interfejsa je dat na sledećem dijagramu:

DIJAGRAM OVDE

### Proxy sloj

Ovaj sloj je uveden kako bi aplikacija mogla da podrži nedostupnost servera. Komponenta proxy sloja ima izlazne interfejse u vidu `Storage` interfejsa koji predstavljaju skladišta ili za dolazne podatke sa servera, u slučaju kada postoji veza sa serverom, ili za prividne podatke, kada ne postoji. Vezu sa serverm ova komponenta ostvaruje povezivanje na izlazne interfejse servera i korišćenjem odgovarajućih protokola.

Proxy sloj je ugrađen u klijentski deo aplikacije, ali pošto klijentski deo predstavlja srž funkcionalnosti, ovaj sloj zauzima posebno mesto u arhitekturi.

Ovaj sloj služi za _hvatanje_ poruka i REST zahteva ka serveru i odlučivanje kako će se one obraditi.

Proxy sloj je predstavljen na sledećem dijagramu:

DIJAGRAM OVDE

### Klijentski sloj

Ovaj sloj predstavlja debelog (_thick_ ili _fat_) klijenta koji implementira osnovne funkcionalnosti aplikacije (crtanje i manipulacija grafa, izvršavanje algoritama...) i korisnički interfejs sa odgovarajućim kontrolerima.

Kako je već rečeno, klijentski sloj je baziran na **MVC** arhitekturnom obrascu.

Pregled klijentskog sloja je dat na sledećem dijagramu:
 
DIJAGRAM OVDE

## Publish--subscribe

Sistem za razmenu poruka se zasniva na publish--subscribe obrascu. Poruke prolaze kroz sva tri navedena sloja, tako da ovaj obrazac ne može da se izoluje da pripada samo jednom sloju.

Osnovna logika za slanje poruke je da klijent šalje poruku o zahtevu za konekcijom serveru, server ga uvrštava u `lobby` gde je klijent automatski pretplaćen na poruke o promeni informacija o soboma (imena soba, broj soba, opis sobe i slično). Kada klijent odabere sobu (ili kreira novu), automatski je pretplaćen na tu sobu i sve poruke vezane za tu sobu, tako da ukoliko neko pošalje poruku određenog tipa, svi korisnici koji su pretplaćeni na tu sobu će primiti tu poruku. Poruke se dekodiraju na Proxy sloju i prosleđuju odgovarajućoj `Storage` klasi. Svi pretplatenici na datu `Storage` klasu će videti promene i automatski ih reflektovati kroz klijentski sloj.

## MVC

Kako je klijentski sloj implementiran u Angular-u, samim tim je uslovljena MVC arhitektura.

Model predstavlja kompletno stanje i logiku aplikacije. Kontroler i view su u uskoj sprezi jer je to nametnuto od strane Angular-a, odnosno kontroler predstavlja klasu koja je povezana za određeni `HTML` fajl koji predstavlja view.
 
