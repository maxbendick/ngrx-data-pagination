import { Hero } from '../models/hero';

export const heroPageSize = 10;

// Will create 52 items, so 6th page will have 2 items
function* heroGenerator() {
  for (let i = 0; i < 26; i++) {
    const char = String.fromCharCode(97 + i);
    yield {
      id: `${i}`,
      name: `${char}${char}${char}`,
    };
  }
  for (let i = 0; i < 26; i++) {
    const char = String.fromCharCode(65 + i);
    yield {
      id: `${i + 26}`,
      name: `${char}${char}${char}`,
    };
  }
}

const heroes = heroGenerator();

export const exampleHeroes: Hero[][] = [];

let complete = false;

for (let page = 0; !complete; page++) {
  exampleHeroes.push([]);
  for (let indexInPage = 0; indexInPage < heroPageSize; indexInPage++) {
    const { value, done } = heroes.next();
    if (value) {
      exampleHeroes[page].push(value);
    }
    if (done) {
      complete = true;
      break;
    }
  }
}
