/*
                                VueWiki
    ====================================================================
    - Homepage https://github.com/asciian/vuewiki
    - Copyright (c) 2018 TANIGUCHI Masaya All Right Reserved.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import Marked from 'marked';
import HighlightJS from 'highlight.js';
import XSS from 'xss';
import typesetMathJax from './typeset';

Marked.setOptions({
  highlight(code) {
    return HighlightJS.highlightAuto(code).value;
  },
});

export default (markdown) => {
  const div = window.document.createElement('div');
  div.innerHTML = markdown
    .replace(/</mg, '&lt;')
    .replace(/>/mg, '&gt;')
    .replace(/'/mg, '&quot;')
    .replace(/"/mg, '&#39;')
    .replace(/```([^]*?)```/mg, (_, code) => `<pre><code>${code}</code></pre>`);
  typesetMathJax(div);
  const markdownAndCommonHTML = div.innerHTML
    .replace(/&lt;/mg, '<')
    .replace(/&gt;/mg, '>')
    .replace(/&quot;/mg, '\'')
    .replace(/&#39;/mg, '"')
    .replace(/<pre><code>([^]*?)<\/code><\/pre>/, (_, code) => `\`\`\`${code}\`\`\``);
  return XSS(Marked(markdownAndCommonHTML), {
    whiteList: Object.assign(XSS.whiteList, {
      h1: ['id'],
      h2: ['id'],
      h3: ['id'],
      h4: ['id'],
      h5: ['id'],
      h6: ['id'],
    }),
    onIgnoreTag(tag, html) {
      return tag.match(/mjx-*/) ? html : null;
    },
  });
};
