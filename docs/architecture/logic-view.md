# Logički pogled aplikacije Grafaro

U ovom dokumentu će biti predstavljen logički pogled aplikacije Grafaro.

Kako je reč o Angular aplikaciji, biće predstavljena hijerarhija komponenti, sa odgovarajućim `input` i `ouptput` propertijima.
Takođe će biti predstavljen i pogled na klase modela i biti opisan način njihovog funkcionisanja, kao i mogućnosti proširenja kod klasa koje definišu algoritam.
Biće prikaz i opisan način dotoka podataka u kontrolerske komponente, kao i način funkcionisanja Proxy komponente.
Na kraju dokumenta će biti opisan način funkcionisanja serverske komponente za prijem i rutiranje poruka.

## Hijerarhija komponenti

Kako je Grafaro aplikacija zasnovana na Angular frejmvorku, bitno je dati pregled hijerarhije Angular komponenti i način njihovog međusobnog komuniciranja. Pre dijagrama hijerarhije, sledi par napomena vezanih za notaciju:

- Elementi dijagrama su predstavljeni kao moduli jer smatramo da je to najpogodniji UML element za prikaz istih. Angular komponente i predstavljaju module koji enkpasuliraju određene funkcionalnosti kroz potrebne HTML šablone, servise i komponentske klase.
- `RouterOutlet` je komponenta iz Angular jezgra koja služi za instanciranje komponentskih klasa na osnovu pročitane URL rute. Na dijagramu je stereotipima označeno koja ruta aktivira instanciranje koje komponente. Kao konektor elemenata, korišćena je standardna UML notacija za instanciranje.
- Usmerena isprekidana strelica od jedne komponente do druge označava da je druga komponenta podkomponenta prve komponente. Sa strane prve komponente je dat naziv `output` propertija za koje se vezuje prva komponenta, a sa strane druge komponente je dat naziv `input` propertija koje prosleđuje prva komponenta.
- Stereotip `wraps` označava da se prva komponenta obavija drugu u komponenti iznad druge, a ne u samoj komponenti.
- Stereotip `instantiate` označava da prva komponenta na određene događaje instancira drugu komponentu programski, a ne kroz svoj šablon.

Dijagram hijerarhije komponenti:

![Hijerarhija komponenti](img/ng-component-view.png)

Sa dijagrama se vidi da je ulazna komponenta `AppComponent` koja sadrži samo `RouterOutlet`.
Takođe se može uočiti da centralni deo aplikacije predstavlja `RoomViewComponent` koja enkapsulira skoro komplentu funkcionalnost kroz odgovarajuće komponente korisničkog interfejsa.
