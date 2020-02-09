export class LSystem {
  iteration = 0;
  regex = /./g;

  constructor(start, rules) {
    this.start = start;
    this.state = start;
    this.rules = rules;
  }

  reset() {
    this.iteration = 0;
    this.state = this.start;
  }

  replacer(character) {
    const replacement = this.rules[character];
    return replacement || [character];
  }

  iterate() {
    this.iteration++;
    this.state = this.state.reduce((newState, oldToken) => {
      newState.push(...this.replacer(oldToken));
      return newState;
    }, []);
  }
}
