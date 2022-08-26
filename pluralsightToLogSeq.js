// ==UserScript==
// @name         Pluralsight TOC to Logseq
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description Formats Pluralsight's TOC to markdown format

// @author       You
// @match        https://app.pluralsight.com/library/courses/*/table-of-contents
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

(function () {
  /**
   To use it, click `Expand All` under TOC.
   Select entire list from the left of the "Play button" until the end of the video length of the last video.
   Finally, click the copy button injected by the script.
   It should copy the markdown to the clipboard.
   And also output the result to console.
   */

  "use strict";
  const btn = document.createElement("button");
  btn.innerText = "copy";
  btn.onclick = myFunc;

  document.body.append(btn);

  async function myFunc() {
    const table = document.querySelector('table[role="grid"]');
    let headers = getHeaders(table);
    let subs = getSubs(table);
    let final = generateMD(headers, subs).join("\n");
    navigator.clipboard.writeText(final);
    console.log(final);

    function generateMD(headers, subs) {
      let final = [];
      headers.forEach((h, i) => {
        final.push(`# ${h}`);
        subs[i].forEach((s) => {
          final.push(`\t - ${s}`);
        });
      });

      return final;
    }

    function getHeaders(table) {
      let tr = document.evaluate(
        './tbody/tr[not(@aria-hidden="true")]',
        table,
        null,
        XPathResult.ANY_TYPE,
        null
      );
      let headers = [];
      let t = null;
      while ((t = tr.iterateNext())) {
        let text = trimText(t.innerText);
        headers.push(text);
      }
      return headers;
    }

    function getSubs(table) {
      let tr = document.evaluate(
        "./tbody/tr/td/div/div/table",
        table,
        null,
        XPathResult.ANY_TYPE,
        null
      );
      let subs = [];
      let t = null;
      while ((t = tr.iterateNext())) {
        subs.push(getSubText(t));
      }
      return subs;
    }

    function getSubText(table) {
      let tr = document.evaluate(
        "./tbody/tr/td[1]",
        table,
        null,
        XPathResult.ANY_TYPE,
        null
      );
      let text = [];
      let t = null;
      while ((t = tr.iterateNext())) {
        text.push(trimText(t.textContent));
      }
      return text;
    }

    function trimText(t) {
      if (typeof t === "string") {
        if (t.indexOf("\t") >= 0)
          return t.split("\t")[1]?.trim().replace("#", "\\#");
        return t.trim();
      }
    }
  }
})();
