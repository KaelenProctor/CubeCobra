function enterCentering(token) {
  this.enter(
    { type: 'centering', data: { hName: 'div', hProperties: { className: ['text-center'] } }, children: [] },
    token,
  );
}

function exitCentering(token) {
  this.exit(token);
}

export const fromMarkdown = {
  enter: { centering: enterCentering },
  exit: { centering: exitCentering },
};

export default { fromMarkdown };
