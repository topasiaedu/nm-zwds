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
      age: "年齡","甲": "甲", "乙": "乙", "丙": "丙", "丁": "丁", "戊": "戊",
      "己": "己", "庚": "庚", "辛": "辛", "壬": "壬", "癸": "癸",
      "子": "子", "丑": "丑", "寅": "寅", "卯": "卯", "辰": "辰",
      "巳": "巳", "午": "午", "未": "未", "申": "申", "酉": "酉",
      "戌": "戌", "亥": "亥"
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
      age: "Age","甲": "Jia", "乙": "Yi", "丙": "Bing", "丁": "Ding", "戊": "Wu",
      "己": "Ji", "庚": "Geng", "辛": "Xin", "壬": "Ren", "癸": "Gui",
      "子": "Rat", "丑": "Ox", "寅": "Tiger", "卯": "Rabbit", "辰": "Dragon",
      "巳": "Snake", "午": "Horse", "未": "Goat", "申": "Monkey", "酉": "Rooster",
      "戌": "Dog", "亥": "Pig",
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
    // for (i = 0; i < 12; i++) {
    //   document.getElementById("zw" + (i + 1).toString()).innerHTML =
    //     "<div class='MangA'>" + EarthlyBranches[i]+ "</div>";
    // }
  },
  cleanZiwei: function () {
    document.getElementById("zwHome").innerHTML = "";
    this.clearPalce();
  },
  genZiwei: function () {
    zw=[
      {
          "MangA": "戊<br/>子",
          "MangB": "【Health Palace】",
          "MangC": "",
          "StarA": [
              "Wu Qu<br>",
              "Tian Fu<br>"
          ],
          "StarB": [],
          "StarC": [
          ],
          "Star6": [
          ]
      },
      {
          "MangA": "己<br/>丑",
          "MangB": "【Wealth Palace】",
          "MangC": "",
          "StarA": [
              "Tai Yang<br>",
              "Tai Yin Hua Ji<br>",
              "Wen Chang<br>",
              "Wen Qu \u21BB <br>"
          ],
          "StarB": [],
          "StarC": [],
          "Star6": []
      },
      {
          "MangA": "戊<br/>寅",
          "MangB": "【Child Palace】",
          "MangC": "",
          "StarA": [
              "Tan Lang"
          ],
          "StarB": [],
          "StarC": [],
          "Star6": [
          ]
      },
      {
          "MangA": "己<br/>卯",
          "MangB": "【Marriage Palace】",
          "MangC": "",
          "StarA": [
              "Tian Ji Hua Lu<br>",
              "Ju Men<br>"
          ],
          "StarB": [],
          "StarC": [],
          "Star6": []
      },
      {
          "MangA": "庚<br/>辰",
          "MangB": "【Siblings Palace】",
          "MangC": "",
          "StarA": [
              "Zi Wei Hua Ke<br>",
              "Tian Xiang<br>",
              "Zuo Fu<br>"
          ],
          "StarB": [],
          "StarC": [],
          "Star6": []
      },
      {
          "MangA": "辛<br/>巳",
          "MangB": "【Life Palace】",
          "MangC": "",
          "StarA": [
              "Tian Liang Hua Quan<br>"
          ],
          "StarB": [
          ],
          "StarC": [
          ],
          "Star6": []
      },
      {
          "MangA": "壬<br/>午",
          "MangB": "【Parents Palace】",
          "MangC": "",
          "StarA": [
              "Qi Sha<br>"
          ],
          "StarB": [],
          "StarC": [
          ],
          "Star6": [
          ]
      },
      {
          "MangA": "癸<br/>未",
          "MangB": "【Happy Palace】",
          "MangC": "",
          "StarA": [],
          "StarB": [
          ],
          "StarC": [
          ],
          "Star6": []
      },
      {
          "MangA": "甲<br/>申",
          "MangB": "【Property Palace】",
          "MangC": "",
          "StarA": [
              "Lian Zhen \u21BB <br>"
          ],
          "StarB": [],
          "StarC": [],
          "Star6": [
          ]
      },
      {
          "MangA": "乙<br/>酉",
          "MangB": "【Career Palace】",
          "MangC": "",
          "StarA": [],
          "StarB": [],
          "StarC": [],
          "Star6": []
      },
      {
          "MangA": "丙<br/>戌",
          "MangB": "【Friends Palace】",
          "MangC": "",
          "StarA": [
              "Po Jun<br>"
          ],
          "StarB": [],
          "StarC": [],
          "Star6": [
            "You Bi<br>"
          ]
      },
      {
          "MangA": "丁<br/>亥",
          "MangB": "【Travel Palace】",
          "MangC": "",
          "StarA": [
              "Tian Tong \u21BB <br>"
          ],
          "StarB": [],
          "StarC": [],
          "Star6": []
      }
  ]
    
    //render Direction
    var styleLR = [" zwStarLeft", " zwStarRight"];
    if (this.right2left) {
      styleLR.reverse();
    }
    //render Star
    for (i = 0; i < 12; i++) {
      document.getElementById("zw" + (i + 1).toString()).innerHTML +=
        "<div class='MangA' style='display:none'>" +
        zw[i].MangA +
        "</div>" +
        "<div class='MangA-new'>" +
        zw[i].MangA.replace(/<br\/>/g, ' ') 
        .replace(/[\u4e00-\u9fff]/g, match => this.getTranslation(`${match}`)) +
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
      var tempStarA = [[], [], []];
      var k = 0;
      for (j = 0; j < zw[i].StarA.length; j++) {
        // tmpSatrA[0][k] = zw[i].StarA[j].substring(0, 1);
        // tmpSatrA[1][k] = zw[i].StarA[j].substring(1, 2);
        tempStarA[0][k] = 
          `<span class="blue-star">` +
          zw[i].StarA[j] +
          "</span>";

        k += 1;
      }
      for (j = 0; j < zw[i].Star6.length; j++) {
        tempStarA[0][k] = "<span>" + zw[i].Star6[j] + "</span>";
        tempStarA[1][k] = "<span>" + zw[i].Star6[j] + "</span>";
        tempStarA[2][k] =
          zw[i].Star6[j].length > 2
            ? "<span>" + zw[i].Star6[j]+ "</span>"
            : "　";
        k += 1;
      }
      //style Left or Right
      if (this.right2left) {
        for (j = 0; j < 3; j++) {
          tempStarA[j].reverse();
        }
      }
      //render StarA & B & C
      for (j = 0; j < tempStarA[0].length; j++) {
        StarA1 += tempStarA[0][j];
      }
      for (j = 0; j < zw[i].StarB.length; j++) {
        StarB1 += zw[i].StarB[j];
      }
      for (j = 0; j < zw[i].StarC.length; j++) {
        StarC1 += zw[i].StarC[j];
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
        "<div class='MangY10'>" +
        DS_Shian.DShian[i + 1] +
        "</div>"
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
      liunianDiv.innerHTML = "Liu<br>Year"; // Use innerHTML for HTML content
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
    // Function to handle palace click
   // Function to draw lines with color-matching arrowheads
   function drawFixedLines() {
    const svg = document.getElementById("palaceLines");
    if (svg) {
      svg.innerHTML = ""; // Clear previous lines
    }

    const pairs = [
      { from: 10, to: 4 },
      { from: 4, to: 10 },
      { from: 8, to: 3 },
      { from: 7, to: 1 },
    ];

    // Define colors for the lines
    // const colors = ["green", "blue", "#ba8e23", "red"];
    const colors = ["green", "green", "#ba8e23", "red"];

    pairs.forEach((pair, index) => {
      const originPalace = document.getElementById(`zw${pair.from}`);
      const targetPalace = document.getElementById(`zw${pair.to}`);

      if (!originPalace || !targetPalace) {
        console.warn(
          `Missing element for palace index ${pair.from} or ${pair.to}`
        );
        return;
      }

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

      const color = colors[index % colors.length]; // Assign a color from the list

      // Create a unique marker for this line
      const markerId = `arrowhead-${index}`;
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
      arrowPath.setAttribute("d", "M0,0 L10,3.5 L0,7 Z");
      arrowPath.setAttribute("fill", color);
      arrowhead.appendChild(arrowPath);
      defs.appendChild(arrowhead);
      svg.appendChild(defs);

      // Draw a line from origin to target
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("stroke", color);
      line.setAttribute("x1", originCenter.x);
      line.setAttribute("y1", originCenter.y);
      line.setAttribute("x2", targetCenter.x);
      line.setAttribute("y2", targetCenter.y);
      line.setAttribute("stroke-width", "2");
      line.setAttribute("marker-end", `url(#${markerId})`);

      svg.appendChild(line);
    });
  }
  drawFixedLines();
  },
};
window.addEventListener("load", function () {
  //開始使用
  ziweiUI.initial();
});
