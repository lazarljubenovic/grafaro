# Ubrizgavanje zavisnosti (DI, _Dependency Injection_)

> ###### DI za petogodišnjake ([John Munsch](http://stackoverflow.com/a/1638961))
> Ako sam odeš da uzmeš nešto iz frižidera, možeš da prouzrokuješ probleme. Možda ostaviš otvorena vrata, možda uzmeš nešto što ti mama i tata ne daju. A možda tražiš nešto čega uopšte nema ili čemu je istekao rok.
>
> Umesto toga, treba da samo iskažeš potrebu: "Hoću da pijem nešto uz ručak". Onda ćemo se postarati da ti damo nešto za piće kad budeš seo da jedeš.

Umesto da su objekti ti koji prave zavisnosti, i umesto da se od fabrike traži da se kreira jedan od njih, zavisnosti se sa spoljne strane prosleđuju objektu. Time postaju "tuđi problem". Taj "tuđin" može da bude ili objekat uz graf zavisnosti, ili ubrzigavač zavinosti (_injector_), odnosno frejmvork koji kreira graf zavinosti.

## DI u Angularu

U Angularu je DI implementiran kroz konstruktore. Na osnovu tipova podataka, dekoratora i vrednosti koje se pružaju (_provide_), Angular gradi stablo zavinosti koje koristi za instanciranje klasa (npr. komponenti i servisa). Ovime su, između ostalog, omogućeni singlton servisi, kao i laka zamena _mock_ podataka za stvarne zahteve preko HTTP-a. Sem toga, omogućeno je jednostanije pisanje junit-testova, jer se mogu _pružiti_ specijalno dizajnirani podaci radi testiranja konkretne funkcionalnosti (u tom slučaju, test-modul je taj koji "ubrizgava" zavinost).

Moguća je jednostavna zamena klasa niz celu aplikaciju ukoliko se poštuje definisan interfejs. Na primer, neki modul može da pruža klasu `Logger`:

```
providers: [Logger]
```

Ovo je samo skraćeni način za sledeće.

```
providers: [{provide: Logger, useClass: Logger}]
```

Može se proslediti bilo koja klasa, sve dok zadovoljava interfejs klase `Logger`. Pošto se radi o JavaSkriptu, koji nema stroge tipove podataka, ovo samo znači da objekti treba da se poklapaju po šablonu (_pattern matching_), tako da nema potrebe za time da `Logger` bude apstraktna klasa ili interfejs, niti da druge vrste _Logger_-a eksplicitno nasleđuju ili implementiraju "apstraktni" `Logger`.

```
providers: [{provide: Logger, useClass: MuchBetterLogger}]
```

Sa gorenavedenom postavkom, ako neka komponenta zatraži instancu klase `Logger`...

```
constructor(private _logger: Logger) {}
```

...dobiće instancu klase `MuchBetterLogger`, jer je ona pružena (_provided_).

Angular nema samo _jedan_ ubrizgavač, već se pravi čitava hijerarhija. Svaka Angular aplikacija se može predstaviti kao stablo komponenti, i svaka komponenta ima svoj ubrizgavač. 

## Primeri iz aplikacije

Modul `RoomViewModule` u sebi, između ostalog, sadrži i komponentu `AlgorithmPicker` gde se može izabrati algoritam koji će biti obrađivan. Ovaj servis definiše statičku metodu `forRoot` (po konvenciji) koja automatski dodaje i provajdere (`ModuleWithProviders`) kada se importuje u neki drugi modul.

```
static forRoot(algorithms): ModuleWithProviders {
  return {
    ngModule: RoomViewModule,
    providers: [{
        provide: 'availableAlgorithms',
        useValue: algorithms,
      }],
  };
}
```

Ovde se ubrizgavanje vrši pomoću stringa: token kojim se "traži" zavinost je string `availableAlgorithms`, a vrednost koja se provajduje je `algorithms` (argument statičke metode).

U glavnom modulu `AppModule` se modul `RoomViewModule` sada importuje uz poziv njegove `forRoot` metode, čime se provajduje i proizvoljan niz.

```
export const ALGORITHMS = [
    BreadthFirstSearchAlgorithm,
    DijkstraShortestPathAlgorithm,
];

imports: [
  ...
  RoomViewModule.forRoot(ALGORITHMS),
  ...
]
```

Ovi prosleđeni algoritmi se u okviru komponente `AlgorithmPicker` u modulu `RoomViewModule` traže u konstruktoru.

```
constructor(
  ...
  @Inject('availableAlgorithms') public _availableAlgorithms,
  ...) { }
```

Dobijeni algoritmi se koriste za generisanje izbora algoritama koji se mogu izabrati.

```
<label *ngFor="let alg of _availableAlgorithms">
  <input type="radio" [value]="alg._abbr" formControlName="algorithm">
  <span>{{alg._name}}</span>
</label>
```

Dodavanje novih algoritama je sada trivijalno i ceo modul `RoomViewModule` samo "traži" te podatke od pozivajućeg modula, i ne bavi se njihovim kreiranjem.
