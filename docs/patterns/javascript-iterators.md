# Iteratori u JavaSkriptu

Obrazac _Iterator_ je sintaksno ugrađen u JavaSkript. Kako JS nije klasni jezik, implementiran je malo drugačije od odgovarajućeg GOF obrasca. 

Za "iteratori" su ključna tri koncepta: iteratori i generatori su u direktnoj sprezi sa **iterabilnim objektima**, koji se mogu koristiti u sintaksnim konstrukcijama kao što su `for ... of` (koje Angular intenzivno koristi u `@angular/common` paketu u sklopu strukturne direktive `ngFor` i srodnih direktiva kao što su `ngForOf`; sintaksno zašećerene kao `*ngFor`) i`for ... in`, ali i omogućuje pozive metoda koje primaju lambda funkcije kao što su `.map` i `.filter`, koje se u Grafaru intenzivno koriste umesto tradicionalne C-ovske `for`-petlje; kao i kod pomoćnih operatora kao što su _spread operator_ `...`.

Najlešeće korišćen tip iz jezgra JavaSkripta koji je iterabilan je `Array`, a tu su i `Map` i `Set`.

## Iteratori

U JavaSkriptu, objekat se smatra **iteratorom** ako zna kako da obavi pristup jednom po jednom elementu iz kolekcije, i da pri tome vodi računa o tome koji će sledeći element biti obrađen. Da bi ovo bilo ispunjeno, treba da ima `next<T>()` metodu koja vraća sledeći element u sekvenci, i to sa dva svojstva: `done: boolean` i `value: T`.

```
const iterator = makeIterator(['foo', 'bar']); 
iterator.next(); // {value: 'foo', done: false}
iterator.next(); // {value: 'bar', done: false}
iterator.next(); // {done: true}
```

## Genratori

Iteratore je neophodno napraviti nad iterabilnim objektom sa klijentske strane (vidi kod gore), pa ne predstavljaju dobro sredstvo za rad. Zato se koriste **generatori**. Oni dozvoljavaju definisanje iterativnog algoritma pisanjem jednostavne funkcije koja može da vodi računa o svom stanju. Sem toga, generatori mogu da budu i beskonačni, pa se često koriste za dobijenja sledećeg broja u nekom nizu.

Generator je poseban tip funkcije. Funkcija se smatra generatorom ako koristi jedan ili viš `yield` operator i koristi sitaksu za zvezdicom `function*`.

Tipičan primer je generator prirodnih brojeva.

```
function* numberGenerator() {
  let n = 0;
  while (true)
    yield ++index;
}

const generator = numberGenerator();
gen.next(); // {value: 0, done: false}
gen.next(); // {value: 1, done: false}
gen.next(); // {value: 2, done: false}
```

## Iterabilni objekti

Za objekat se kaže da je **iterabilan** ako definiše dvoj način iteracije, kao što su vrednosti koje će se koristiti u `for ... of` strukturi. Da bi objekat bio iterabilan, on (ili jedan od njegovih objekata duž prototipskog lanca) mora da implementira simboličku metodu `@@iterator`.

```
const iterable = {};
iterable[Symbol.iterator] = function* () {
  let n = 0;
  while (n < 5)
    yield ++n;
};

for (let i of iterable) { 
  console.log(i); 
}
// 1, 2, 3, 4

[...iterable]; // [1, 2, 3, 4]
```

Detaljnije, uz više primera, može se naći u [_Iteration protocol_ na MDN-u](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).
