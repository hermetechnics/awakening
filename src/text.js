export class TextDisplay {
  lines = [];

  constructor(container) {
    this.container = container;
  }

  addLine(text, duration) {
    const node = document.createElement("p");
    node.innerHTML = `<span class="text-display-inline">${text}</span`;

    const line = { text, duration, node };
    this.lines.push(line);
    this.container.appendChild(node);

    setTimeout(() => {
      this.lines.splice(this.lines.indexOf(line), 1);

      if (this.container.contains(node)) {
        this.container.removeChild(node);
      }
    }, duration);
  }

  clear() {
    this.lines.forEach(({ node }) => {
      if (this.container.contains(node)) {
        this.container.removeChild(node);
      }
    });
  }
}
