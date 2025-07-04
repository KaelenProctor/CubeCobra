import { visit } from 'unist-util-visit';

import { fromMarkdown } from 'markdown/cardlink/mdast-cardlink';
import syntax from 'markdown/cardlink/micromark-cardlink';
import { add } from 'markdown/utils';

function oncard(node, index, parent) {
  if (node.value[0] === '!') {
    // Begins with an exclamation point -> it's a card image
    node.value = node.value.substring(1);
    node.type = 'cardimage';
  }

  if (node.value[0] === '/') {
    // Begins with a slash -> include back side in autocard
    node.value = node.value.substring(1);
    node.dfc = true;
  }

  if (node.value[0] === '/') {
    // A second slash means we want to show the back side on the page
    node.value = node.value.substring(1);
    node.showBackImage = true;
  }

  if (node.value[0] === '!' && node.type !== 'cardimage') {
    // Check for exclamation point again in case we began with "/!"
    node.value = node.value.substring(1);
    node.type = 'cardimage';
  }

  if (node.type === 'cardimage' && (parent.type === 'paragraph' || parent.inParagraph)) {
    // Needed to determine whether the image is rendered in a div or in a span
    node.inParagraph = true;
  }

  /* Per https://github.com/micromark/micromark-extension-gfm-table?tab=readme-ov-file#syntax tables don't allow
   * pipes (|) in their cell contents unless escaped. So let's first check if there is the escaped version to split
   * Card name and id, otherwise check for just a normal pipe
   */
  [node.name, node.id] = node.value.split('\\|');
  if (typeof node.id === 'undefined') {
    [node.name, node.id] = node.value.split('|');
  }

  if (typeof node.id === 'undefined') {
    node.id = node.name;
  }

  node.data.hName = node.type;
  node.data.hProperties = {
    name: node.name,
    id: node.id,
    dfc: node.dfc,
    inParagraph: node.inParagraph,
    showBackImage: node.showBackImage,
  };
}

function cardlinks() {
  const data = this.data();
  add(data, 'micromarkExtensions', syntax);
  add(data, 'fromMarkdownExtensions', fromMarkdown);
  return (tree) => visit(tree, 'cardlink', oncard);
}

export default cardlinks;
