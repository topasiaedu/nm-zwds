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
    // Function to get query parameters from the URL
    function getQueryParam(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    }

    // Retrieve values from the URL instead of the DOM
    var year = getQueryParam("year");
    var month = getQueryParam("month");
    var day = getQueryParam("day");
    var hour = getQueryParam("hour");
    var genderValue = getQueryParam("gender"); // Assuming gender is also passed as a query parameter
    var name = getQueryParam("name");

    // Calculate Age
    var dob = new Date(year, month - 1, day);
    var ageDifMs = Date.now() - dob.getTime();
    var ageDate = new Date(ageDifMs);

    // Compute Zi Wei using values from query parameters
    var zw = ziwei.computeZiWei(year, month, day, hour, genderValue);

    document.getElementById("zwHome").innerHTML =
      "<div>" +
      this.getTranslation("name") +
      ": " +
      name +
      "</div>" +
      "<div>" +
      this.getTranslation("age") +
      ": " +
      Math.abs(ageDate.getUTCFullYear() - 1970) +
      "</div>" +
      "<div>" +
      this.getTranslation("solarCalendar") +
      ": " +
      ziwei.getSolarDay() +
      "</div><div>" +
      this.getTranslation("lunarCalendar") +
      ": " +
      ziwei.getLunarDay() +
      "</div><div>" +
      this.getTranslation("zodiac") +
      ": 【" +
      ziwei.getShengXiao() +
      "】【" +
      year_to_stem_branch[year] +
      "】" +
      "</div>" +
      "<div>" +
      this.getTranslation("fiveElement") +
      ": " +
      ziwei.getFiveElement() +
      "</div>" +
      "<div>" +
      this.getTranslation("yinYangGender") +
      ": " +
      ziwei.getYinYangGender() +
      "</div>";

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
    var DS_Shian = ziwei.getDaShian();
    for (i = 0; i < 12; i++) {
      document.getElementById("zw" + (i + 1).toString()).innerHTML +=
        "<div class='MangY10'>" +
        DS_Shian.DShian[i + 1] +
        "</div>" +
        "<div class='MangY1'>" +
        DS_Shian.SShian[i + 1] +
        "</div>";
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

    // calculate da yun ( today year - birth year + 1 )
    let birthYear = parseInt(year);
    let daYunIndex = currentYear - birthYear + 1;
    // Check the innerHTML of the palace div mangy10 ( which is in the format of age - age ), if daYunIndex is in the range, add the tag
    for (i = 0; i < 12; i++) {
      let palaceDiv = document.getElementById(`zw${i + 1}`);
      let mangY10 = document
        .getElementById(`zw${i + 1}`)
        .getElementsByClassName("MangY10")[0];
      if (palaceDiv) {
        let ageRange = mangY10.innerHTML.split(" - ");
        if (
          daYunIndex >= parseInt(ageRange[0]) &&
          daYunIndex <= parseInt(ageRange[1])
        ) {
          let daYunDiv = document.createElement("div");
          daYunDiv.className = "daYunTag";
          daYunDiv.innerHTML = "Da<br>Shian";
          palaceDiv.appendChild(daYunDiv);
        }
      }
    }

    for (let i = 0; i < 12; i++) {
      // Change 'var' to 'let'
      let palaceDiv = document.getElementById(`zw${i + 1}`);
      palaceDiv.addEventListener("click", () => handlePalaceClick(i + 1)); // Index is 1-based
    }

    var lines = {
      甲: ["Lian Zhen", "Po Jun", "Wu Qu", "Tai Yang"],
      乙: ["Tian Ji", "Tian Liang", "Zi Wei", "Tai Yin"],
      丙: ["Tian Tong", "Tian Ji", "Wen Chang", "Lian Zhen"],
      丁: ["Tai Yin", "Tian Tong", "Tian Ji", "Ju Men"],
      戊: ["Tan Lang", "Tai Yin", "You Bi", "Tian Ji"],
      己: ["Wu Qu", "Tan Lang", "Tian Liang", "Wen Qu"],
      庚: ["Tai Yang", "Wu Qu", "Yin", "Tong"],
      辛: ["Ju", "Yang", "Qu", "Chang"],
      壬: ["Liang", "Zi", "Zuo", "Wu"],
      癸: ["Po", "Ju", "Yin", "Tan"]
    };
    
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
    function handlePalaceClick(palaceIndex) {
      const palace = document.getElementById(`zw${palaceIndex}`);
      console.log("Palace", palace);
      const mangAElements = palace.querySelectorAll(".MangA"); // Get all .MangA elements
      console.log("MangA elements", mangAElements);
      const mangAContent = mangAElements[0].innerText.substring(0,1).trim();
      console.log("mangAContent", mangAContent);
      console.log(lines[mangAContent]);
      if (!mangAContent || !lines[mangAContent]) return;

      // Get the characters to match
      const charsToMatch = lines[mangAContent];
      console.log(charsToMatch);

      // Find matching stars
      const matches = [];

      document
        .querySelectorAll(".ziwei > div")
        .forEach((otherPalace, otherIndex) => {
          const stars = Array.from(
            otherPalace.querySelectorAll(".StarA, .StarB, .StarC")
          ); // Collect stars

          stars.forEach((star) => {
            charsToMatch.forEach((char, charIndex) => {
              let foundInSpan = false;

              // Check if the character exists in a span
              const matchingSpans = Array.from(
                star.querySelectorAll("span")
              ).filter((span) => span.innerText.includes(char));

              if (matchingSpans.length > 0) {
                // If matching spans are found, add each one as a separate match
                matchingSpans.forEach((span) => {
                  matches.push({
                    palaceIndex: otherIndex + 1,
                    starElement: span, // Use the specific span element
                    word: char, // Include the specific word that matched
                    priority: charIndex, // Preserve the order of charsToMatch
                  });
                });
                foundInSpan = true; // Mark that this char was found in a span
              }

              // Check if the character exists in the star's text (outside spans)
              if (!foundInSpan && star.innerText.includes(char)) {
                // If the character is found outside spans, add it
                matches.push({
                  palaceIndex: otherIndex + 1,
                  starElement: star, // Use the entire star element
                  word: char, // Include the specific word that matched
                  priority: charIndex, // Preserve the order of charsToMatch
                });
              }
            });
          });
        });

      // Sort matches by the priority of charsToMatch
      matches.sort((a, b) => a.priority - b.priority);

      console.log(matches);
      // Draw lines to matches
      drawLinesFromPalace(palaceIndex, matches);
    }

    // Function to draw lines with color-matching arrowheads
    function drawLinesFromPalace(palaceIndex, matches) {
      const svg = document.getElementById("palaceLines");
      if (svg) {
        svg.innerHTML = ""; // Clear previous lines
      }

      const originPalace = document.getElementById(`zw${palaceIndex}`);
      const originRect = originPalace.getBoundingClientRect();
      const originCenter = {
        x: originRect.left + originRect.width / 2,
        y: originRect.top + originRect.height / 2,
      };

      // Define colors for the first, second, third, and fourth matches
      const colors = ["green", "blue", "#ba8e23", "red"];

      matches.forEach(
        ({ palaceIndex: matchIndex, starElement }, matchPosition) => {
          const targetRect = starElement.getBoundingClientRect();
          const targetCenter = {
            x: targetRect.left + targetRect.width / 2,
            y: targetRect.top + targetRect.height / 2,
          };

          // Assign color based on position
          const color = colors[matchPosition] || "black"; // Default to black if more than 4 matches

          // Create a unique marker for this line
          const markerId = `arrowhead-${matchPosition}`;
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
          arrowPath.setAttribute("fill", color); // Arrowhead color matches line color
          arrowhead.appendChild(arrowPath);
          defs.appendChild(arrowhead);
          svg.appendChild(defs);

          // Draw a line from originCenter to targetCenter
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
        }
      );
    }
  },
};
window.addEventListener("load", function () {
  //開始使用
  ziweiUI.initial();
});
