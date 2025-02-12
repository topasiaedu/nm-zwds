/* eslint-disable no-undef */
/*紫微斗數 Chinese Astrology Zi Wei Dou Shu*/
var ziweiUI = {
  language: localStorage.getItem("language") || "zh", // Get language from localStorage

  translations: {
    zh: {
      solarCalendar: "國曆",
      lunarCalendar: "農曆",
      zodiac: "生肖",
      fiveElement: "五行",
      yinYangGender: "陰陽性別",
      annualFortune: "流<br>年",
      grandCycle: "大<br>限",
      name: "姓名",
      age: "年齡",
      甲: "甲",
      乙: "乙",
      丙: "丙",
      丁: "丁",
      戊: "戊",
      己: "己",
      庚: "庚",
      辛: "辛",
      壬: "壬",
      癸: "癸",
      子: "子",
      丑: "丑",
      寅: "寅",
      卯: "卯",
      辰: "辰",
      巳: "巳",
      午: "午",
      未: "未",
      申: "申",
      酉: "酉",
      戌: "戌",
      亥: "亥",
    },
    en: {
      solarCalendar: "Solar Calendar",
      lunarCalendar: "Lunar Calendar",
      zodiac: "Zodiac",
      fiveElement: "Five Elements",
      yinYangGender: "Yin-Yang Gender",
      annualFortune: "Annual<br>Fortune",
      grandCycle: "Grand<br>Cycle",
      name: "Name",
      age: "Age",
      甲: "Jia",
      乙: "Yi",
      丙: "Bing",
      丁: "Ding",
      戊: "Wu",
      己: "Ji",
      庚: "Geng",
      辛: "Xin",
      壬: "Ren",
      癸: "Gui",
      子: "Rat",
      丑: "Ox",
      寅: "Tiger",
      卯: "Rabbit",
      辰: "Dragon",
      巳: "Snake",
      午: "Horse",
      未: "Goat",
      申: "Monkey",
      酉: "Rooster",
      戌: "Dog",
      亥: "Pig",
    },
  },

  getTranslation: function (key) {
    return this.translations[this.language][key];
  },

  genNowDateZiwei: function () {
    this.getNowDate();
    this.genZiwei();
  },
  getNowDate: function () {},
  //initial
  initial: function () {
    document.getElementById("container").innerHTML =
      "<div class='ziwei'><div id='zw6'></div><div id='zw7'></div><div id='zw8'></div><div id='zw9'></div><div id='zw5'></div><div id='zwHome' class='zwDivCenter'></div><div id='zw10'></div><div id='zw4'></div><div id='zw11'></div><div id='zw3'></div><div id='zw2'></div><div id='zw1'></div><div id='zw12'></div></div>";

    this.genNowDateZiwei();
  },
  clearPalce: function () {
    for (i = 0; i < 12; i++) {
      document.getElementById("zw" + (i + 1).toString()).innerHTML =
        "<div class='MangA'>" + EarthlyBranches[i] + "</div>";
    }
  },
  cleanZiwei: function () {
    document.getElementById("zwHome").innerHTML = "";
    this.clearPalce();
  },
  genZiwei: function () {
    zw = [
      {
        MangA: "戊<br/>子",
        MangB: "【疾厄宮】",
        MangC: "",
        StarA: ["武曲", "天府"],
        StarB: [],
        StarC: [],
        Star6: [],
      },
      {
        MangA: "己<br/>丑",
        MangB: "【財帛宮】",
        MangC: "",
        StarA: ["太陽", "太陰化忌", "文昌", "文曲\u21BB"],
        StarB: [],
        StarC: [],
        Star6: [],
      },
      {
        MangA: "戊<br/>寅",
        MangB: "【子女宮】",
        MangC: "",
        StarA: ["貪狼"],
        StarB: [],
        StarC: [],
        Star6: [],
      },
      {
        MangA: "己<br/>卯",
        MangB: "【夫妻宮】",
        MangC: "",
        StarA: ["天機化祿", "巨門"],
        StarB: [],
        StarC: [],
        Star6: [],
      },
      {
        MangA: "庚<br/>辰",
        MangB: "【兄弟宮】",
        MangC: "",
        StarA: ["紫微化科", "天相", "左輔"],
        StarB: [],
        StarC: [],
        Star6: [],
      },
      {
        MangA: "辛<br/>巳",
        MangB: "【命宮】",
        MangC: "",
        StarA: ["天梁化權"],
        StarB: [],
        StarC: [],
        Star6: [],
      },
      {
        MangA: "壬<br/>午",
        MangB: "【父母宮】",
        MangC: "",
        StarA: ["七殺"],
        StarB: [],
        StarC: [],
        Star6: [],
      },
      {
        MangA: "癸<br/>未",
        MangB: "【福德宮】",
        MangC: "",
        StarA: [],
        StarB: [],
        StarC: [],
        Star6: [],
      },
      {
        MangA: "甲<br/>申",
        MangB: "【田宅宮】",
        MangC: "",
        StarA: ["廉貞\u21BB"],
        StarB: [],
        StarC: [],
        Star6: [],
      },
      {
        MangA: "乙<br/>酉",
        MangB: "【官祿宮】",
        MangC: "",
        StarA: [],
        StarB: [],
        StarC: [],
        Star6: [],
      },
      {
        MangA: "丙<br/>戌",
        MangB: "【交友宮】",
        MangC: "",
        StarA: ["破軍"],
        StarB: [],
        StarC: [],
        Star6: ["右弼"],
      },
      {
        MangA: "丁<br/>亥",
        MangB: "【遷移宮】",
        MangC: "",
        StarA: ["天同\u21BB"],
        StarB: [],
        StarC: [],
        Star6: [],
      },
    ];

    //render Direction
    var styleLR = [" zwStarLeft", " zwStarRight"];
    if (this.right2left) {
      styleLR.reverse();
    }
    //render Star
    for (i = 0; i < 12; i++) {
      document.getElementById("zw" + (i + 1).toString()).innerHTML +=
        "<div class='MangA'>" +
        zw[i].MangA +
        "</div>" +
        "<div class='MangB'>" +
        zw[i].MangB +
        "</div>" +
        "<div class='MangC'>" +
        zw[i].MangC +
        "</div>" +
        "<div class='StarAll'>" +
        zw[i].StarAll +
        "</div>";
      var StarA1, StarA2, StarA3, StarB1, StarB2, StarC1, StarC2;
      StarA1 = "";
      StarA2 = "";
      StarA3 = "";
      StarB1 = "";
      StarB2 = "";
      StarC1 = "";
      StarC2 = "";
      var tmpSatrA = [[], [], []];
      var k = 0;
      for (j = 0; j < zw[i].StarA.length; j++) {
        // tmpSatrA[0][k] = zw[i].StarA[j].substring(0, 1);
        // tmpSatrA[1][k] = zw[i].StarA[j].substring(1, 2);
        tmpSatrA[0][k] =
          `<span class="blue-star">` +
          zw[i].StarA[j].substring(0, 1) +
          "</span>";
        tmpSatrA[1][k] =
          `<span class="blue-star">` +
          zw[i].StarA[j].substring(1, 2) +
          "</span>";

        tmpSatrA[2][k] =
          zw[i].StarA[j].length > 2
            ? "<span>" + zw[i].StarA[j].substring(3, 4) + "</span>"
            : "　";
        // Check if the string contains the ↻ character (Unicode: \u21BB)
        if (zw[i].StarA[j].includes("\u21BB")) {
          tmpSatrA[2][k] += `<span class="extra-icon">↻</span>`; // Add extra section
        } else {
          tmpSatrA[2][k] += ""; // Empty if not present
        }

        k += 1;
      }
      for (j = 0; j < zw[i].Star6.length; j++) {
        tmpSatrA[0][k] = "<span>" + zw[i].Star6[j].substring(0, 1) + "</span>";
        tmpSatrA[1][k] = "<span>" + zw[i].Star6[j].substring(1, 2) + "</span>";
        tmpSatrA[2][k] =
          zw[i].Star6[j].length > 2
            ? "<span>" + zw[i].Star6[j].substring(3, 4) + "</span>"
            : "　";
        k += 1;
      }
      //style Left or Right
      if (this.right2left) {
        for (j = 0; j < 3; j++) {
          tmpSatrA[j].reverse();
        }
      }
      //render StarA & B & C
      for (j = 0; j < tmpSatrA[0].length; j++) {
        StarA1 += tmpSatrA[0][j];
        StarA2 += tmpSatrA[1][j];
        StarA3 += tmpSatrA[2][j];
      }
      for (j = 0; j < zw[i].StarB.length; j++) {
        StarB1 += zw[i].StarB[j].substring(0, 1);
        StarB2 += zw[i].StarB[j].substring(1, 2);
      }
      for (j = 0; j < zw[i].StarC.length; j++) {
        StarC1 += zw[i].StarC[j].substring(0, 1);
        StarC2 += zw[i].StarC[j].substring(1, 2);
      }
      document.getElementById("zw" + (i + 1).toString()).innerHTML +=
        "<div class='StarA" +
        styleLR[0] +
        "'>" +
        StarA1 +
        "<br>" +
        StarA2 +
        "<br><div class='Star4'>" +
        StarA3 +
        "</div></div>" +
        "<div class='StarB" +
        styleLR[1] +
        "'>" +
        StarB1 +
        "<br>" +
        StarB2 +
        "</div>" +
        "<div class='StarC'>" +
        StarC1 +
        "<br>" +
        StarC2 +
        "</div>";
    }

    //大小限表
    var DS_Shian = {
      DShian: [
        null,
        "54 - 63",
        "44 - 53",
        "34 - 43",
        "24 - 33",
        "14 - 23",
        "4 - 13",
        "114 - 123",
        "104 - 113",
        "94 - 103",
        "84 - 93",
        "74 - 83",
        "64 - 73",
      ],
    };
    for (i = 0; i < 12; i++) {
      document.getElementById("zw" + (i + 1).toString()).innerHTML +=
        "<div class='MangY10'>" + DS_Shian.DShian[i + 1] + "</div>";
    }

    // Add 流年 tag to palaces
    let currentYear = new Date().getFullYear();
    let startPalaceIndex = 6; // 財帛宮 (2025)
    let yearOffset = (currentYear - 2025) % 12; // Determine the offset
    let tagPalaceIndex = (startPalaceIndex + yearOffset) % 12; // Calculate palace for 流年

    // Apply 流年 tag to the calculated palace
    let palaceDiv = document.getElementById(`zw${tagPalaceIndex}`);
    if (palaceDiv) {
      let liunianDiv = document.createElement("div");
      liunianDiv.className = "liunianTag";
      liunianDiv.innerHTML = "流<br>年"; // Use innerHTML for HTML content
      palaceDiv.appendChild(liunianDiv);
    }

    function initPalaceLines() {
      let svg = document.getElementById("palaceLines");
      if (!svg) {
        // Create the SVG element if it doesn't exist
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.id = "palaceLines";
        svg.style.position = "absolute";
        svg.style.top = "0";
        svg.style.left = "0";
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.zIndex = "1";
        svg.style.pointerEvents = "none"; // Prevent interaction with the lines
        document.getElementById("container").appendChild(svg); // Append to the container
      }
      return svg;
    }

    // Call this function during setup
    initPalaceLines();

    // Function to draw lines with color-matching arrowheads
    // Function to compute direction based on relative positioning
    function computeDirection(originPalace, targetPalace) {
      if (!originPalace || !targetPalace) return null;

      const originRect = originPalace.getBoundingClientRect();
      const targetRect = targetPalace.getBoundingClientRect();

      const originCenter = {
        x: originRect.left + originRect.width / 2,
        y: originRect.top + originRect.height / 2,
      };

      const targetCenter = {
        x: targetRect.left + targetRect.width / 2,
        y: targetRect.top + targetRect.height / 2,
      };

      const dx = targetCenter.x - originCenter.x;
      const dy = targetCenter.y - originCenter.y;

      let direction = "";

      if (Math.abs(dx) > Math.abs(dy)) {
        direction = dx > 0 ? "right" : "left";
      } else if (Math.abs(dy) > Math.abs(dx)) {
        direction = dy > 0 ? "down" : "up";
      } else {
        if (dx > 0 && dy > 0) direction = "down-right";
        if (dx < 0 && dy > 0) direction = "down-left";
        if (dx > 0 && dy < 0) direction = "up-right";
        if (dx < 0 && dy < 0) direction = "up-left";
      }

      return direction;
    }

    // Function to get the start point at the border of the origin palace
    function getArrowStartPoint(originPalace, targetPalace) {
      if (!originPalace || !targetPalace) return null;

      const originRect = originPalace.getBoundingClientRect();
      const direction = computeDirection(originPalace, targetPalace);

      let startX = originRect.left + originRect.width / 2;
      let startY = originRect.top + originRect.height / 2;

      switch (direction) {
        case "down":
          startY = originRect.bottom;
          break;
        case "up":
          startY = originRect.top;
          break;
        case "right":
          startX = originRect.right;
          break;
        case "left":
          startX = originRect.left;
          break;
        case "down-right":
          startX = originRect.right;
          startY = originRect.bottom;
          break;
        case "down-left":
          startX = originRect.left;
          startY = originRect.bottom;
          break;
        case "up-right":
          startX = originRect.right;
          startY = originRect.top;
          break;
        case "up-left":
          startX = originRect.left;
          startY = originRect.top;
          break;
      }

      return { x: startX, y: startY };
    }

    // Function to get the destination center
    function getDestinationCenter(targetPalace) {
      if (!targetPalace) return null;

      const targetRect = targetPalace.getBoundingClientRect();

      return {
        x: targetRect.left + targetRect.width / 2,
        y: targetRect.top + targetRect.height / 2,
      };
    }

    // Function to compute the angle between start and destination
    function computeArrowAngle(start, destination) {
      const dx = destination.x - start.x;
      const dy = destination.y - start.y;
      return Math.atan2(dy, dx); // Angle in radians
    }

    // Function to compute the end point, ensuring a length of 25 pixels
    function getArrowEndPoint(start, destination) {
      const angle = computeArrowAngle(start, destination);

      return {
        x: start.x + 75 * Math.cos(angle),
        y: start.y + 75 * Math.sin(angle),
      };
    }

    // Function to create a standard single arrowhead (old design)
    function createArrowhead(svg, markerId, color) {
      const defs = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "defs"
      );
      const arrowhead = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "marker"
      );

      arrowhead.setAttribute("id", markerId);
      arrowhead.setAttribute("markerWidth", "10");
      arrowhead.setAttribute("markerHeight", "7");
      arrowhead.setAttribute("refX", "10");
      arrowhead.setAttribute("refY", "3.5");
      arrowhead.setAttribute("orient", "auto");

      const arrowPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      arrowPath.setAttribute("d", "M0,0 L10,3.5 L0,7 Z"); // Old-school filled triangle
      arrowPath.setAttribute("fill", color);

      arrowhead.appendChild(arrowPath);
      defs.appendChild(arrowhead);
      svg.appendChild(defs);

      return markerId;
    }

    // Function to create a **left-pointing** arrowhead
    function createLeftArrowhead(svg, markerId, color) {
      const defs = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "defs"
      );
      const arrowhead = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "marker"
      );

      arrowhead.setAttribute("id", markerId);
      arrowhead.setAttribute("markerWidth", "10");
      arrowhead.setAttribute("markerHeight", "7");
      arrowhead.setAttribute("refX", "0"); // Flips the arrow to point left
      arrowhead.setAttribute("refY", "3.5");
      arrowhead.setAttribute("orient", "auto");

      const arrowPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      arrowPath.setAttribute("d", "M10,0 L0,3.5 L10,7 Z"); // Reversed triangle (pointing left)
      arrowPath.setAttribute("fill", color);

      arrowhead.appendChild(arrowPath);
      defs.appendChild(arrowhead);
      svg.appendChild(defs);

      return markerId;
    }

    // Function to draw the arrows
    function drawFixedLines() {
      const svg = document.getElementById("palaceLines");
      if (svg) {
        svg.innerHTML = ""; // Clear previous lines
      }

      const pairs = [
        { from: 10, to: 4 },
        { from: 8, to: 3 },
        { from: 7, to: 1 },
      ];

      const colors = ["green", "#ba8e23", "red"];

      pairs.forEach((pair, index) => {
        const originPalace = document.getElementById(`zw${pair.from}`);
        const targetPalace = document.getElementById(`zw${pair.to}`);

        if (!originPalace || !targetPalace) {
          console.warn(
            `Missing element for palace index ${pair.from} or ${pair.to}`
          );
          return;
        }

        const start = getArrowStartPoint(originPalace, targetPalace);
        const destinationCenter = getDestinationCenter(targetPalace);
        const end = getArrowEndPoint(start, destinationCenter);

        const color = colors[index % colors.length];

        // If it's the first connection, create **both left and right arrowheads**
        if (index === 0) {
          const rightArrowId = createArrowhead(
            svg,
            `arrowhead-right-${index}`,
            color
          );
          const leftArrowId = createLeftArrowhead(
            svg,
            `arrowhead-left-${index}`,
            color
          );

          // Draw the bi-directional line with **two arrowheads**
          const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
          );
          line.setAttribute("stroke", color);
          line.setAttribute("x1", start.x);
          line.setAttribute("y1", start.y);
          line.setAttribute("x2", end.x);
          line.setAttribute("y2", end.y);
          line.setAttribute("stroke-width", "2");
          line.setAttribute("marker-start", `url(#${leftArrowId})`); // Left-facing arrow
          line.setAttribute("marker-end", `url(#${rightArrowId})`); // Right-facing arrow

          svg.appendChild(line);
        } else {
          // For all other connections, create a **single arrowhead**
          const markerId = createArrowhead(svg, `arrowhead-${index}`, color);

          // Draw the standard single-arrow line
          const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
          );
          line.setAttribute("stroke", color);
          line.setAttribute("x1", start.x);
          line.setAttribute("y1", start.y);
          line.setAttribute("x2", end.x);
          line.setAttribute("y2", end.y);
          line.setAttribute("stroke-width", "2");
          line.setAttribute("marker-end", `url(#${markerId})`);

          svg.appendChild(line);
        }
      });
    }

    drawFixedLines();

    // Function to observe container size changes and redraw lines
    function observeContainerResize() {
      const container = document.getElementById("container");

      if (!container) {
        console.warn("Container not found!");
        return;
      }

      // Create a ResizeObserver to watch for changes in the container size
      const resizeObserver = new ResizeObserver(() => {
        drawFixedLines(); // Recalculate and redraw arrows
      });

      // Start observing the container
      resizeObserver.observe(container);
    }

    observeContainerResize(); // Start observing container changes
  },
};
window.addEventListener("load", function () {
  //開始使用
  ziweiUI.initial();
});
