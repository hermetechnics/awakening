export class TextDisplay {
  lines = [];

  constructor(container) {
    this.container = container;
  }

  addLine(text, duration) {
    const node = document.createElement("p");
    node.innerHTML = `<span class="text-display-inline">${text}</span`;

    this.lines.push({ text, duration, node });
    this.container.appendChild(node);

    setTimeout(() => this.container.removeChild(node), duration);
  }
}
