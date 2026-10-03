/* Business Analytics, Week 1: part tabs, lesson list and the practice quiz.
   Plain JavaScript, no libraries. */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ==========================================================
     1. Parts (tabs)
     ========================================================== */
  var worlds = $$(".world[data-tab]");
  var tabLinks = $$("a[data-tab]");
  root.classList.add("js");

  function activeWorldId() {
    var on = worlds.filter(function (w) { return w.classList.contains("on"); })[0];
    return on ? on.id : null;
  }

  function showWorld(id) {
    worlds.forEach(function (w) { w.classList.toggle("on", w.id === id); });
    tabLinks.forEach(function (a) {
      if (a.getAttribute("data-tab") === id) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
    updateRail();
  }

  function scrollToEl(el) {
    if (!el) return;
    window.requestAnimationFrame(function () {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function route(hash, fromLoad) {
    var id = (hash || "").replace(/^#/, "");
    var target = null;
    var q = /^q(\d+)$/.exec(id);

    if (q) {
      showWorld("world-3");
      quiz.goTo(parseInt(q[1], 10) - 1);
      target = $("#quiz");
    } else if (id) {
      var el = doc.getElementById(id);
      var w = el && el.closest ? el.closest(".world[data-tab]") : null;
      if (w) { showWorld(w.id); target = el; }
      else if (el) { target = el; }
    }
    if (!activeWorldId()) showWorld("world-1");
    if (target && !(fromLoad && !id)) scrollToEl(target);
  }

  window.addEventListener("hashchange", function () { route(location.hash, false); });

  /* ==========================================================
     2. Lesson list: highlight the lesson being read
     ========================================================== */
  var ticking = false;
  function updateRail() {
    var w = $(".world.on");
    if (!w) return;
    var rail = $(".rail", w);
    if (!rail) return;
    var arts = $$("article.slide[id]", w);
    var cur = null;
    arts.forEach(function (a) {
      if (a.getBoundingClientRect().top < 160) cur = a.id;
    });
    $$("a", rail).forEach(function (a) {
      var on = a.getAttribute("href") === "#" + cur;
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { ticking = false; updateRail(); });
  }, { passive: true });

  /* ==========================================================
     3. Practice quiz
     ========================================================== */
  var SKILLS = [
    { name: "Table or chart?", revise: "#dv-17", reviseName: "Choosing Form: Table or Chart?" },
    { name: "Types of data", revise: "#dv-04", reviseName: "Types of Data" },
    { name: "Chart for the data type", revise: "#dv-19", reviseName: "Match the Message to the Chart" },
    { name: "Chart for the message", revise: "#dv-19", reviseName: "Match the Message to the Chart" }
  ];

  var OPT_CHART = [
    ["A", "One item proportional to totals"],
    ["B", "Multiple items components"],
    ["C", "Comparison between items"],
    ["D", "Trend over time"],
    ["E", "Frequency of items"],
    ["F", "Outlier identification"],
    ["G", "Correlation representation"]
  ];

  function chartQ(name, icon, ans, slideSays, why, trap) {
    var bullets = [
      "The Match the Message slide pairs the <strong>" + name.toLowerCase() + "</strong> with <strong>" + slideSays + "</strong>.",
      "In the options that job is worded <strong>" + OPT_CHART[ans.charCodeAt(0) - 65][1] + "</strong> (" + ans + ").",
      why
    ];
    if (trap) bullets.push(trap);
    return {
      skill: 2, multi: false,
      text: "Which chart is used for what type of data?",
      chart: { name: name, icon: icon },
      options: OPT_CHART.map(function (o) { return { k: o[0], t: o[1] }; }),
      ans: [ans], why: bullets
    };
  }

  var IMG = "img/pa1/";
  function imgOpts(q, alts) {
    return ["a", "b", "c", "d"].map(function (l, i) {
      return { k: l.toUpperCase(), img: IMG + q + "-" + l + ".png", alt: alts[i] };
    });
  }
  var TABLE1 = {
    src: IMG + "table1.png",
    alt: "Table 1: sales in millions of items A to E for India, China, USA, Great Britain, Mexico, Australia, Pakistan, Russia and Spain.",
    cap: "Table 1: sales (in million) by country for items A to E"
  };

  var QUESTIONS = [
    {
      skill: 0, multi: true,
      text: "When do you choose “charts” for representing data?",
      options: [
        { k: "A", t: "To show how data changes over time" },
        { k: "B", t: "Show distribution of data" },
        { k: "C", t: "Show complete data" },
        { k: "D", t: "Show slice of data" }
      ],
      ans: ["A", "B", "D"],
      why: [
        "Charts are for <strong>patterns</strong>: change over time (A), distribution (B), and a slice of the information (D).",
        "“Show complete data” (C) is a <strong>table</strong> job, so leave it out."
      ]
    },
    {
      skill: 0, multi: false,
      text: "When do you <u>not choose</u> a table to represent data?",
      options: [
        { k: "A", t: "Display complete data" },
        { k: "B", t: "Highlight specific item in context of complete data" },
        { k: "C", t: "Show patterns in data" },
        { k: "D", t: "None of the above" }
      ],
      ans: ["C"],
      why: [
        "Watch the word <strong>not</strong>. First list what a table <em>is</em> good for: complete data (A) and one item in context (B).",
        "Showing <strong>patterns</strong> is what a chart does, so that is when you would not choose a table.",
        "Since C fits, D (“none of the above”) cannot be right."
      ]
    },
    {
      skill: 1, multi: true,
      text: "Select which of the following are <strong>categorical</strong> data?",
      options: [
        { k: "A", t: "Your highest level of education" },
        { k: "B", t: "Customer rating for service experience e.g. Poor, Average, Good." },
        { k: "C", t: "Your age bucket e.g. below 18 year, between 19 and 30 years etc." },
        { k: "D", t: "Time" },
        { k: "E", t: "Pressure" }
      ],
      ans: ["A", "B", "C"],
      why: [
        "Categorical means <strong>a label or group</strong>.",
        "A: education levels are groups.",
        "B: Poor / Average / Good are categories (they have an order, but they are still labels).",
        "C: an age <em>bucket</em> is a group, even though it comes from numbers.",
        "D, E: time and pressure are measured, so they are numerical."
      ]
    },
    {
      skill: 1, multi: true,
      text: "Select which of the following are <strong>discrete</strong> data?",
      options: [
        { k: "A", t: "How many siblings do you have?" },
        { k: "B", t: "Weight" },
        { k: "C", t: "Number of houses in your locality" },
        { k: "D", t: "Defects per hour" },
        { k: "E", t: "Pressure" }
      ],
      ans: ["A", "C", "D"],
      why: [
        "Discrete means <strong>counted</strong> in whole steps.",
        "A, C: you count siblings and houses.",
        "D: you count defects. This is the slide’s own example of discrete data.",
        "B, E: weight and pressure are measured, so they are continuous."
      ]
    },
    {
      skill: 1, multi: true,
      text: "Select which of the following are <strong>continuous</strong> data?",
      options: [
        { k: "A", t: "Time between two successive failures of an equipment" },
        { k: "B", t: "Volume" },
        { k: "C", t: "Gender" },
        { k: "D", t: "Your favourite cuisines" },
        { k: "E", t: "Density" }
      ],
      ans: ["A", "B", "E"],
      why: [
        "Continuous means <strong>measured</strong>, with any value in between possible.",
        "A: time between failures is measured time.",
        "B, E: volume and density are measured.",
        "C, D: gender and favourite cuisines are categories."
      ]
    },
    chartQ("Box plot", "ch-box", "F", "outliers",
      "The box holds the middle half of the values, and the dots beyond the whiskers are the outliers."),
    chartQ("Line chart", "ch-line", "D", "change over time",
      "Time runs along the bottom, so the line shows the trend."),
    chartQ("Bar chart", "ch-bar", "C", "item comparison",
      "Bars stand side by side, so you compare how big each item is.",
      "<strong>Trap:</strong> “trend over time” (D) is the job of a line, not of bars."),
    chartQ("Column / stacked column chart", "ch-stack", "B", "components of multiple items",
      "Each column is one item, split into stacked parts.",
      "<strong>Trap:</strong> the word “column” can tempt you to pick “comparison” (C). The clue is <strong>stacked</strong>: parts piled on top of each other."),
    chartQ("Histogram", "ch-hist", "E", "frequency, distribution",
      "Each column counts how many values fall in a range."),
    chartQ("Scatter plot", "ch-scatter", "G", "correlation",
      "Each dot has two values, so you see whether they move together."),
    chartQ("Pie chart", "ch-pie", "A", "components of one item",
      "The slices are the parts of one whole and add up to 100%."),
    {
      skill: 3, multi: false, ctx: TABLE1,
      text: "Message to convey: “country with the highest sales <strong>for each item</strong>”",
      prompt: "Choose the best representation.",
      options: imgOpts("q13", [
        "Line charts for items A to E with the countries listed down the side",
        "Five stacked column panels, one per item, with every bar labelled",
        "Columns grouped by country, one colour per item",
        "One panel per item with a bar for each country and only the highest bar labelled"
      ]),
      ans: ["D"],
      why: [
        "“For each item” means one comparison per item: look at A, then B, then C, D and E, and find the top country in each.",
        "Comparing countries is a <strong>bar chart</strong> job, with one small chart per item. Lines (A) join countries as if they were a trend over time, which is misleading.",
        "<strong>D</strong> labels only the highest bar in each item, so the answer to the message jumps out. B labels every bar, which is clutter. C groups the bars by country, so you compare items inside a country, a different message.",
        "Check with Table 1: the top country is Spain for A (5), Mexico for B (6) and C (8), India for D (9), and E has three countries tied at 9."
      ]
    },
    {
      skill: 3, multi: false, ctx: TABLE1,
      text: "Message to convey: “Country with the highest sales <strong>across all items</strong>”",
      prompt: "Choose the best representation.",
      options: imgOpts("q14", [
        "Bars of total sales per country, sorted from highest to lowest, with value labels",
        "Stacked columns, one per country, split by item",
        "Bars of total sales per country in alphabetical order, with labels",
        "Bars of total sales per country in alphabetical order, labels with two decimals"
      ]),
      ans: ["A"],
      why: [
        "“Across all items” means <strong>add the items together</strong> for each country first. Then you compare one total per country.",
        "Totals: India 27, Mexico 24, China 23, USA 23, Pakistan 22, Russia 22, Spain 21, Australia 20, Great Britain 20.",
        "<strong>A</strong> sorts the bars from largest to smallest and writes the values, so the winner (India) is the first bar.",
        "B stacks all five items in each bar. That is more ink than the message needs. C and D show the same totals but leave the countries in alphabetical order, so the ranking is harder to see, and D adds needless “.00” decimals."
      ]
    },
    {
      skill: 3, multi: true, ctx: TABLE1,
      text: "Message to convey: “Across all items, the country-wise <strong>proportion</strong> of item-A being sold”",
      prompt: "Select all the good representations.",
      options: imgOpts("q15", [
        "Bars of the proportion for each country, sorted from highest to lowest, with labels",
        "A dot for each country’s proportion, sorted from highest to lowest, with labels",
        "A cloud of circles, one per country, sized by proportion",
        "A table with a colour scale: darker cells for larger proportions, values shown"
      ]),
      ans: ["A", "B", "D"],
      why: [
        "The proportion for a country is <strong>item A sales ÷ that country’s total sales</strong>. Example: Spain 5 ÷ 21 = 0.2381. You then compare nine proportions.",
        "<strong>A</strong> (sorted bars) and <strong>B</strong> (sorted dots) put every value on one common scale, so the eye ranks them at once.",
        "<strong>D</strong> (colour table) shows the exact values and uses colour depth to point to the larger ones.",
        "<strong>C</strong> (circle cloud) makes you compare areas and has no common axis or order, so it is hard to read."
      ]
    }
  ];

  var STORE_KEY = "ba-w1-quiz-v1";
  var quiz = (function () {
    var rootEl = $("#quiz-root");
    if (!rootEl) return { goTo: function () {} };

    var state = load();
    var zoom = null;

    function load() {
      var base = { idx: 0, ans: {}, done: {}, finished: false };
      try {
        var raw = localStorage.getItem(STORE_KEY);
        if (!raw) return base;
        var s = JSON.parse(raw);
        if (s && typeof s === "object" && s.ans && s.done) {
          s.idx = Math.min(Math.max(parseInt(s.idx, 10) || 0, 0), QUESTIONS.length - 1);
          return s;
        }
      } catch (e) {}
      return base;
    }
    function save() {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
    }

    function marks(i) {
      var q = QUESTIONS[i], sel = state.ans[i] || [];
      var hit = sel.filter(function (k) { return q.ans.indexOf(k) > -1; }).length;
      var wrong = sel.length - hit;
      return Math.max(0, (hit - wrong) / q.ans.length);
    }
    function fmt(n) {
      var r = Math.round(n * 100) / 100;
      return (r % 1 === 0) ? String(r) : r.toFixed(2).replace(/0$/, "");
    }
    function answeredCount() {
      return QUESTIONS.reduce(function (n, _q, i) { return n + (state.done[i] ? 1 : 0); }, 0);
    }
    function totalMarks() {
      return QUESTIONS.reduce(function (n, _q, i) { return n + (state.done[i] ? marks(i) : 0); }, 0);
    }

    /* ---------- rendering ---------- */
    function optionHTML(q, i, o) {
      var sel = (state.ans[i] || []).indexOf(o.k) > -1;
      var done = !!state.done[i];
      var right = q.ans.indexOf(o.k) > -1;
      var cls = "qz-opt" + (o.img ? " qz-img" : "") + (sel ? " sel" : "");
      var tag = "";
      if (done) {
        if (sel && right) { cls += " ok"; tag = "Correct"; }
        else if (sel && !right) { cls += " bad"; tag = "Not this one"; }
        else if (!sel && right) { cls += " miss"; tag = q.multi ? "You missed this one" : "Right answer"; }
      }
      var type = q.multi ? "checkbox" : "radio";
      var input = '<input type="' + type + '" name="qz-' + i + '" value="' + o.k + '"' +
        (sel ? " checked" : "") + (done ? " disabled" : "") + ">";
      var body = o.img
        ? '<span class="qz-pic"><img src="' + o.img + '" alt="' + esc(o.alt) + '" loading="lazy"></span>'
        : '<span class="qz-txt">' + esc(o.t) + "</span>";
      var enlarge = o.img
        ? '<button type="button" class="qz-enl" data-zoom="' + o.img + '" data-alt="' + esc(o.alt) + '" aria-label="Enlarge option ' + o.k + '">Enlarge</button>'
        : "";
      var badge = tag ? '<span class="qz-tag">' + tag + "</span>" : "";
      return '<label class="' + cls + '">' + input + '<span class="qz-key">' + o.k + "</span>" + body + badge + enlarge + "</label>";
    }

    function feedbackHTML(q, i) {
      var m = marks(i);
      var full = m === 1, none = m === 0;
      var cls = full ? "good" : (none ? "bad" : "partial");
      var head = full ? "Correct!" : (none ? "Not quite." : "Partly right.");
      var line = full ? "You earned 1 mark."
        : none ? "No marks this time."
        : "You earned " + fmt(m) + " of 1 mark.";
      var pills = q.ans.map(function (k) { return '<span class="pill">' + k + "</span>"; }).join("");
      var skill = SKILLS[q.skill];
      return '<div class="qz-fb ' + cls + '" role="status">' +
        '<p class="qz-fb-h"><strong>' + head + "</strong> " + line + "</p>" +
        (full ? "" : '<p class="qz-fb-a">The right answer' + (q.ans.length > 1 ? "s are " : " is ") + pills + "</p>") +
        '<div class="qz-why"><p class="qz-why-t">How to answer</p><ul class="bullets">' +
        q.why.map(function (w) { return "<li>" + w + "</li>"; }).join("") + "</ul></div>" +
        '<p class="qz-rev">Revise this: <a href="' + skill.revise + '">' + skill.reviseName + "</a></p>" +
        "</div>";
    }

    function questionHTML() {
      var i = state.idx, q = QUESTIONS[i];
      var done = !!state.done[i];
      var n = QUESTIONS.length;
      var pct = Math.round(((i + (done ? 1 : 0)) / n) * 100);

      var h = '<div class="qz-top">' +
        '<div class="qz-meta"><span class="qz-count">Question ' + (i + 1) + " of " + n + "</span>" +
        '<span class="qz-skill">' + SKILLS[q.skill].name + "</span></div>" +
        '<div class="qz-prog" role="progressbar" aria-valuemin="0" aria-valuemax="' + n + '" aria-valuenow="' + answeredCount() + '"><i style="width:' + pct + '%"></i></div>' +
        "</div>";

      h += '<h3 class="qz-q" id="qz-q">' + q.text + "</h3>";
      if (q.chart) {
        h += '<div class="qz-chart"><svg class="cico" aria-hidden="true"><use href="#' + q.chart.icon + '"/></svg><strong>' + esc(q.chart.name) + "</strong></div>";
      }
      if (q.ctx) {
        h += '<figure class="qz-ctx"><img src="' + q.ctx.src + '" alt="' + esc(q.ctx.alt) + '"><figcaption>' + q.ctx.cap + "</figcaption></figure>";
      }
      var hint = q.prompt || (q.multi ? "Select all that apply." : "Choose one.");
      h += '<p class="qz-hint">' + hint + "</p>";

      var imgs = !!q.options[0].img;
      h += '<div class="qz-opts' + (imgs ? " imgs" : "") + (q.multi ? " multi" : "") + '" role="' + (q.multi ? "group" : "radiogroup") + '" aria-labelledby="qz-q">' +
        q.options.map(function (o) { return optionHTML(q, i, o); }).join("") + "</div>";

      var hasSel = (state.ans[i] || []).length > 0;
      h += '<div class="qz-actions">';
      if (i > 0) h += '<button type="button" class="qz-btn ghost" data-act="back">Back</button>';
      if (!done) {
        h += '<button type="button" class="qz-btn go" data-act="check"' + (hasSel ? "" : " disabled") + ">Check answer</button>";
      } else {
        h += '<button type="button" class="qz-btn ghost" data-act="retry">Try this one again</button>';
        h += '<button type="button" class="qz-btn go" data-act="next">' + (i === n - 1 ? "See my results" : "Next question") + "</button>";
      }
      h += "</div>";
      if (done) h += feedbackHTML(q, i);
      return h;
    }

    function resultsHTML() {
      var n = QUESTIONS.length;
      var total = totalMarks();
      var pct = Math.round((total / n) * 100);
      var msg = pct === 100 ? "Perfect. You can answer every kind of question in this assignment."
        : pct >= 80 ? "Strong result. Read the explanations for the ones you missed."
        : pct >= 50 ? "Good start. Revise the cheat sheet, then try again."
        : "Keep going. Read the lessons, use the cheat sheet, then try again.";

      var rows = SKILLS.map(function (s, si) {
        var idxs = [], got = 0;
        QUESTIONS.forEach(function (q, i) { if (q.skill === si) { idxs.push(i); got += state.done[i] ? marks(i) : 0; } });
        var p = Math.round((got / idxs.length) * 100);
        return '<li><span class="qz-sk">' + s.name + '</span><span class="qz-bar"><i style="width:' + p + '%"></i></span><span class="qz-sc">' + fmt(got) + " / " + idxs.length + "</span></li>";
      }).join("");

      var missed = [];
      QUESTIONS.forEach(function (q, i) { if (!state.done[i] || marks(i) < 1) missed.push(i); });
      var list = missed.length
        ? '<h4 class="qz-sub">Worth another look</h4><ul class="qz-review">' + missed.map(function (i) {
            var q = QUESTIONS[i];
            var label = q.chart ? "Which chart is used for what type of data? " + q.chart.name
              : q.text.replace(/<[^>]+>/g, "").replace(/^Message to convey: /, "Message: ");
            var st = state.done[i] ? "Score " + fmt(marks(i)) + " of 1" : "Not answered";
            return '<li><button type="button" data-act="goto" data-i="' + i + '"><span class="qz-rl">' + esc(label) + '</span><span class="qz-rs">' + st + "</span></button></li>";
          }).join("") + "</ul>"
        : "";

      return '<div class="qz-results">' +
        '<p class="qz-big"><strong>' + fmt(total) + "</strong><span> / " + n + "</span></p>" +
        '<p class="qz-msg">' + msg + "</p>" +
        '<ul class="qz-skills">' + rows + "</ul>" + list +
        '<div class="qz-actions">' +
        (missed.length ? '<button type="button" class="qz-btn ghost" data-act="retry-missed">Retry the ones I missed</button>' : "") +
        '<button type="button" class="qz-btn go" data-act="restart">Start again</button></div>' +
        "</div>";
    }

    function render(focusFirst) {
      rootEl.innerHTML = state.finished ? resultsHTML() : questionHTML();
      if (focusFirst) {
        var h = $(".qz-q, .qz-big", rootEl);
        if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
      }
    }

    /* ---------- actions ---------- */
    function goTo(i, noRender) {
      if (isNaN(i)) return;
      state.idx = Math.min(Math.max(i, 0), QUESTIONS.length - 1);
      state.finished = false;
      save();
      if (!noRender) render(false);
    }

    function check() {
      var i = state.idx;
      if (!(state.ans[i] || []).length) return;
      state.done[i] = true;
      save();
      render(false);
      var fb = $(".qz-fb", rootEl);
      if (fb) fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function next() {
      if (state.idx >= QUESTIONS.length - 1) { state.finished = true; }
      else { state.idx += 1; }
      save();
      render(true);
      scrollToEl($("#quiz"));
    }

    function reset(onlyMissed) {
      if (onlyMissed) {
        var first = -1;
        QUESTIONS.forEach(function (q, i) {
          if (!state.done[i] || marks(i) < 1) {
            delete state.done[i]; delete state.ans[i];
            if (first < 0) first = i;
          }
        });
        state.idx = Math.max(first, 0);
      } else {
        state = { idx: 0, ans: {}, done: {}, finished: false };
      }
      state.finished = false;
      save();
      render(true);
      scrollToEl($("#quiz"));
    }

    rootEl.addEventListener("change", function (e) {
      var t = e.target;
      if (!t || t.tagName !== "INPUT") return;
      var i = state.idx;
      var q = QUESTIONS[i];
      if (state.done[i]) return;
      var sel = $$("input:checked", rootEl).map(function (x) { return x.value; });
      state.ans[i] = sel;
      save();
      $$(".qz-opt", rootEl).forEach(function (l) {
        var inp = $("input", l);
        l.classList.toggle("sel", !!(inp && inp.checked));
      });
      var btn = $('[data-act="check"]', rootEl);
      if (btn) btn.disabled = sel.length === 0;
    });

    rootEl.addEventListener("click", function (e) {
      var z = e.target.closest ? e.target.closest(".qz-enl") : null;
      if (z) { e.preventDefault(); openZoom(z.getAttribute("data-zoom"), z.getAttribute("data-alt")); return; }
      var b = e.target.closest ? e.target.closest("[data-act]") : null;
      if (!b) return;
      var act = b.getAttribute("data-act");
      if (act === "check") check();
      else if (act === "next") next();
      else if (act === "back") { state.idx = Math.max(state.idx - 1, 0); save(); render(true); }
      else if (act === "retry") { delete state.done[state.idx]; delete state.ans[state.idx]; save(); render(false); }
      else if (act === "restart") reset(false);
      else if (act === "retry-missed") reset(true);
      else if (act === "goto") { state.finished = false; state.idx = parseInt(b.getAttribute("data-i"), 10); save(); render(true); scrollToEl($("#quiz")); }
    });

    /* ---------- enlarge dialog ---------- */
    function openZoom(src, alt) {
      if (!zoom) {
        zoom = doc.createElement("dialog");
        zoom.className = "qz-zoom";
        zoom.innerHTML = '<button type="button" class="qz-zoom-x" aria-label="Close">Close</button><img alt="">';
        doc.body.appendChild(zoom);
        zoom.addEventListener("click", function () { if (zoom.close) zoom.close(); });
      }
      var img = $("img", zoom);
      img.src = src; img.alt = alt || "";
      if (zoom.showModal) zoom.showModal(); else window.open(src, "_blank");
    }

    render(false);
    return { goTo: function (i) { goTo(i); } };
  })();

  /* ==========================================================
     Start
     ========================================================== */
  route(location.hash, true);
})();
