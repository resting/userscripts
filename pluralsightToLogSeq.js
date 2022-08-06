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
    const t = await navigator.clipboard.readText();
    const n = t.split("\n");

    const reg1 = /^\d.*/;
    if (n[0].toLowerCase().indexOf("course overview") === 0) {
      const cleanList = n.reduce((rs, n) => {
        let t = n.split("\t");
        if (reg1.test(t[0]) || t[0] === "Clip Watched") {
        } else rs.push(t[0]);

        return rs;
      }, []);

      const t = document.querySelectorAll(".table-of-contents__title");
      let idx = 0;

      const rs = cleanList.reduce((rs, n) => {
        if (n === t[idx]?.innerText) {
          idx++;
          rs.push(`# ${n}`);
        } else {
          rs.push(`\t - ${n}`);
        }

        return rs;
      }, []);

      const rs2 = rs.join("\n");
      navigator.clipboard.writeText(rs2);
      console.log(rs2);
    }
  }
})();
