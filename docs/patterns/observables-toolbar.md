# RxJS i Toolbar

Ovaj dokument opisuje način funkcionisanja Observable obrasca u Reaktivnim ekstenzijama (_Reactive Extentions_) i njihovoj konkretnoj implementaciji za JavaSkript pod nazivom _RxJS_, koristeći se primerima iz klase `ToolbarComponent` u aplikaciji Grafaro. 

Ne opisuje detaljno implementaciju već pruža uvid u način rada i razmišljanja prilikom korišćenja Reaktivnih ekstenzija.

## Kratko o RxJS-u

RxJS u osnovi jeste obrazac Observable, ali je i više od toga.
 
> ReactiveX je kombinacija najboljih ideja obrasca **Observable**, obrasca **Iterator** i **funkcionalnog programiranja**.
> 
> _(citat sa [zvaničnog sajta](http://reactivex.io/))_

Srž Rx-a je skup operatora kojima se događaji mogu transformisati. Najbolji način za opisivanje operatora koje nudi RxJS jeste primena **vremenskih linija** i **perli**. Perle predstavljaju događaja, a linija tok podataka (_stream_). Uspravnom crtom se označava razvršetak toka. Iksićem se označava da je došlo do greške. Umesto dijagrama se često koriste i ASCII dijagrami.

Promenljivima koje su tipa `Observable` (ili srodnjih tipova kao što su `Subject` i njegovi derivati) tradicionalno se dodaje sufiks `$`.

###### Primer

Na primer, operator `debounce` se uglavnom koristi kada imamo izvor događaja koji se menja previše često, i ne želimo da stalno obavljamo neku skupu operaciju pri ispaljivanju tog događaja. 
 
```
Original: -1------2--3--4--------5-----------6-----|--->

                       (operator debounce)
                  
Rezultat: --1------------4--------5-----------6----|--->
```

Na gornjem dijagramu su na gornjoj vremenskoj liniji nanizane perle koje predstavljaju događaje. Ovo na primer može biti dugme-brojač koje se inkrementira svakim klikom. Korisnik pritiska dugme prvi put, čime inkrementira broj od 0 na 1. Tada se ispaljuje `1`.  Zatim korisnik brzo tri puta pritiska dugme, čime se ispaljuju `2`, `3` i `4`. Zatim sa puzama između ispaljuje i `5` i `6`.

Primenom operatora `debounce` nad ovakvim **tokom** podataka daje rezultata prikazan na donjoj vremenskoj liniji. Zbog toga što je prošlo premalo vremena između događaja (ovo vreme se definiše parametrom prilikom poziva funkcije), perle `2` i `3` se ne javljaju, već se javlja samo perla `4`. Sve perme su blago pomerene udesno od odgovarajuće izvorne perle jer mora da prođe neko vreme da bi se utvrdilo da li korisnik "brzo klikće".

## Implementacija trake sa alatkama

Svaki klik na bilo koji alat emituje `chooseTool$` tipa `Observable<Actions>`, gde je `Actions` enumeracije kojom se identifikuje konkretni alat. Klik na bilo koji deo kanvasa u kome je graf emituje `click$` tipa `Observable<VisNgNetworkEventArgument>`, gde je `VisNgNetworkEventArgument` interfejs koji nosi dodatne informacije o kliku (koji su čvorovi, a koji potezi selektirani klikom, pozicija, itd). Ova dva toka su osnovna i iz njih će biti izvedeni svi naredni.

### Pomoćni tok `action$`

Većina akcija je kombinacija izbora alata (`chooseTool$`) za kojom sledi klik (`click$`) ili više njih. Zato se uvodi pomoćni tok `action$` koji spaja ova dva toka, koristeći operator `withLatestFrom` [[docs](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-withLatestFrom) | [marbles](http://rxmarbles.com/#withLatestFrom)].

```
click$      ---------(A)-----(B)--------(C)----------------(D)-->
chooseTool$ ---(1)------------------(2)---------(3)----(4)------>
action$     ---------(1A)----(B2)-------(C2)---------------(D4)->  
```

Dakle, svaki klik je pretočen u kombinaciju prethodno izabranog alata i podacima o kliku.

### Dodavanje čvora `addNode$`

Dodavane čvora se **filtrira** iz toka `action$` proverom izabranog alata i klikom selektiranih elemenata grafa. Konkretan filter koji primenjujemo je:

- selektiran je alat za dodavanje
- klik "u prazno"
  - nije selektiran nijedan čvor
  - nije selektiran nijedan poteg

U sledećem dijagramu par `(x, y)` označava par alata i klika (tok `action$`). `/` je klik u prazno na kanvasu (nijedan čvor, nijedan poteg). Velika slovo su čvorovi, mala slova su potezi.

```
action$   ------(add, /)------(add, a)------(remove, /)------>
addNode$  ------(add, /)------------------------------------->
```

Obratimo pažnju na to da je ovaj tok izveden iz `action$`. Ne interesuje nas kako je on dobijen. Početni tokovi `click$` i `chooseTool$` su **potpupno sakriveni**.

Sada je moguće pretplatiti se na ovaj tok i izvršiti metodu za dodavanje čvora u grafu, koristeći se parametrima prosleđenim kroz događaj.

### Brisanje čvora `removeNode$`

Analogno prethodnom, samo koristimo drugačiji filter:

- selektiran je alat za brisanje
- klik na čvor
  - selektiran je tačno jedan čvor
  
```
action$   ------(add, A)-------(remove, a)-----(remove, A)------>
addNode$  -------------------------------------(remove, A)------>
```

### Dodavanje potega

Dodavanje potega je razbijeno na dva pomoćna toka. Prvi je `linkNodesNode$` i predstavlja prvi klik na čvor pri čemu je izabran alat za povezivanje. Dobijen je korišćenjem operatora `filter`.

```
action$         ----(add, A)-----(link, /)------(link, A)---->
linkNodesNode$  --------------------------------(link, A)---->
```

Za dobijeni tok znamo da predstavlja prvi selektirani čvor za povezivanje. Još uvek ne radimo nikakvu operaciju, ali ćemo ovaj tok koristiti u nastavku.

Drugi pomoćni tok je klik na pozadinu dok je selektiran alat za povezivanje, `linkNodesBackground$`. Dobijen je trivijalnim filterom.

Rezultujući tok `linkNodes$` dobijen je primenom operatora `window` i `flatMap`.

###### Operator `window` [[docs](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-window)]

Ovaj operator vraća tok koji emituje prozore elemenata sakupljenih iz izvornog toka. Prozori se nikad ne preklapaju. Ovo su ugnježdeni tokovi i u praksi se uglavnom koriste samo kao međurezultati. Tako se i ovde već u sledećem koraku koristi operator koji će ovaj tok "izravnati".

![Operator `window`](http://reactivex.io/rxjs/img/window.png)

###### Operator `flatMap` [[docs](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-mergeMap)]

Ovaj operator vraća tok koji emituje elemente tako što primenjuje prosleđenu lambda funkciju na svaki elemenet izvornog toka, pri čemu ta funkcija vrća tok; a onda spaja rezultujuće tokove i emituje rezultat ove "funkcije za spajanje".

![Operator `flatMap`](http://reactivex.io/rxjs/img/mergeMap.png)

###### Operator `bufferCount`

Ovde koristimo i ugnježdeni operator `bufferCount` [[docs](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-bufferCount)] u kombinaciji sa `filter` da bismo izdvojili tačno dva neprekinuta klika na čvor.

![Operator `bufferCount`](http://reactivex.io/rxjs/img/bufferCount.png)

Čitava sekvenca izgleda ovako:

```
this.linkNodes$ = this.linkNodesNode$
  .window(this.linkNodesBackground$)
  .flatMap(window => window
    .bufferCount(2)
    .filter(arr => arr.length === 2));
```
