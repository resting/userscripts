// ==UserScript==
// @name         Udemy TOC to LogSeq
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Formats Udemy's TOC to markdown format
// @author       You
// @match        https://*.udemy.com/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const btn = document.createElement("button");
  btn.innerText = "Convert TOC to LogSeq";
  btn.onclick = myFunc;
  document.body.append(btn);

  function myFunc() {
    let final = [];
    // expand all sections
    document.querySelectorAll(".js-panel-toggler").forEach((p) => p.click());

    function _eval(xpath, context) {
      return document.evaluate(
        xpath,
        context,
        null,
        XPathResult.ANY_TYPE,
        null
      );
    }

    const sections = _eval(
      '//*[@data-purpose="curriculum-section-container"]/div',
      document
    );

    let s = null;
    while ((s = sections.iterateNext())) {
      const sectionHeading = _eval(
        './/div[@data-purpose="section-heading"]',
        s
      );
      const itemTitle = _eval('.//span[@data-purpose="item-title"]', s);

      let h = null;
      while ((h = sectionHeading.iterateNext())) {
        const t2 = h.innerText.replace("\n", " ");
        final.push(`# ${t2}`);
      }

      let t = null;
      while ((t = itemTitle.iterateNext())) {
        const t2 = t.innerText.replace("#", "\\#");
        final.push(`\t - ${t2}`);
      }
    }
    navigator.clipboard.writeText(final.join("\n"));
    console.log(final.join("\n"));
  }
})();
