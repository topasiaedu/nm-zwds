/*紫微斗數 Chinese Astrology Zi Wei Dou Shu*/
var ziweiUI = {
  //主星列印方向 true:由右向左,false:由左向右
  right2left: false,
  //UI resize
  resize: function () {
    //var wdth=$(window).width();
    //$("#divZiWei").css("left",wdth>640?(wdth-640)/2:0);
  },
  genNowDateZiwei: function () {
    this.getNowDate();
    this.genZiwei();
  },
  getNowDate: function () {
    var Today = new Date();
    var h = Today.getHours();
    Today.setDate(Today.getDate() + (h >= 23 ? 1 : 0));
    document.getElementById("sel_Year").value = Today.getFullYear();
    document.getElementById("sel_Month").value = Today.getMonth() + 1;
    document.getElementById("sel_Day").value = Today.getDate();
    document.getElementById("sel_Hour").value =
      EarthlyBranches[((h + (h % 2 ? 1 : 0)) % 24) / 2];
  },
  //initial
  initial: function () {
    //畫紫微斗數空表格
    //document.getElementById("container").innerHTML="<div id='queryDiv'><h2>紫微斗數命盤</h2><div>西元<select id='sel_Year'></select> 年<select id='sel_Month'></select> 月<select id='sel_Day'></select> 日<select id='sel_Hour'></select> 時<input type='radio' id='gender' name='gender' value='M' checked>男<input type='radio' name='gender' value='F'>女<input type='button' value='現在時間*' id='btnNowDate'></div></div><div class='ziwei'><div><div id='zw6'></div><div id='zw7'></div><div id='zw8'></div><div id='zw9'></div></div><div><div id='zw5'></div><div id='zw4'></div><div id='zwHome' class='zwDivCenter'></div><div id='zw10'></div><div id='zw11'></div></div><div><div id='zw3'></div><div id='zw2'></div><div id='zw1'></div><div id='zw12'></div></div></div>";
    document.getElementById("container").innerHTML =
      "<div class='zwDivHeader'><h2>紫微斗數命盤 </h2><div>西元<select id='sel_Year'></select> 年<select id='sel_Month'></select> 月<select id='sel_Day'></select> 日<select id='sel_Hour'></select> 時<input type='radio' id='gender' name='gender' value='M' checked>男<input type='radio' name='gender' value='F'>女<input type='button' value='現在時間*' id='btnNowDate'></div></div><div class='ziwei'><div id='zw6'></div><div id='zw7'></div><div id='zw8'></div><div id='zw9'></div><div id='zw5'></div><div id='zwHome' class='zwDivCenter'></div><div id='zw10'></div><div id='zw4'></div><div id='zw11'></div><div id='zw3'></div><div id='zw2'></div><div id='zw1'></div><div id='zw12'></div></div>";
    function addOption(id, a, b) {
      for (i = a; i <= b; i++) {
        let op = document.createElement("option");
        op.value = i;
        op.innerHTML = i;
        document.getElementById(id).appendChild(op);
      }
    }
    addOption("sel_Year", 1900, 2049);
    addOption("sel_Month", 1, 12);
    addOption("sel_Day", 1, 31);
    for (i = 0; i < EarthlyBranches.length; i++) {
      let op = document.createElement("option");
      op.value = EarthlyBranches[i];
      op.innerHTML =
        EarthlyBranches[i] +
        "【" +
        ((24 + (i * 2 - 1)) % 24).toString() +
        "~" +
        (i * 2 + 1).toString() +
        "】";
      document.getElementById("sel_Hour").appendChild(op);
    }
    //初始日期
    this.genNowDateZiwei();
    this.resize();
  },
  clearPalce: function () {
    for (i = 0; i < 12; i++) {
      document.getElementById("zw" + (i + 1).toString()).innerHTML =
        "<div class='MangA'>" + EarthlyBranches[i] + "</div>";
    }
  },
  cleanZiwei: function () {
    //$("#zwHome").html("");
    document.getElementById("zwHome").innerHTML = "";
    this.clearPalce();
  },
  genZiwei: function () {
    let gender = document.querySelectorAll("input[type=radio]");
    let genderValue = "M";
    for (i = 0; i < gender.length; i++) {
      if (gender[i].checked) {
        genderValue = gender[i].value;
        break;
      }
    }
    var zw = ziwei.computeZiWei(
      document.getElementById("sel_Year").value,
      document.getElementById("sel_Month").value,
      document.getElementById("sel_Day").value,
      document.getElementById("sel_Hour").value,
      genderValue
    );

  

    document.getElementById("zwHome").innerHTML =
      "國曆：" +
      ziwei.getSolarDay() +
      "<br>" +
      "農曆：" +
      ziwei.getLunarDay() +
      "<br>" +
      "生肖：【" +
      ziwei.getShengXiao() +
      "】【" +
      (year_to_stem_branch[document.getElementById("sel_Year").value] || "") +
      "】" +
      "<br>" +
      "<div>" +
      ziwei.getFiveElement() +
      "</div>" +
      "<div>" +
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
    let palaceDiv = document.getElementById(`zw${tagPalaceIndex + 1}`);
    if (palaceDiv) {
      let liunianDiv = document.createElement("div");
      liunianDiv.className = "liunianTag";
      liunianDiv.innerHTML = "流<br>年"; // Use innerHTML for HTML content
      palaceDiv.appendChild(liunianDiv);
    }

    // calculate da yun ( today year - birth year + 1 )
    let birthYear = parseInt(document.getElementById("sel_Year").value);
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
          daYunDiv.innerHTML = "大<br>限";
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
      甲: ["廉貞", "破軍", "武曲", "太陽"],
      乙: ["天機", "天梁", "紫微", "太陰"],
      丙: ["天同", "天機", "文昌", "廉貞"],
      丁: ["太陰", "天同", "天機", "巨門"],
      戊: ["貪狼", "太陰", "右弼", "天機"],
      己: ["武曲", "貪狼", "天梁", "文曲"],
      庚: ["太陽", "武曲", "陰", "同"],
      辛: ["巨", "陽", "曲", "昌"],
      壬: ["梁", "紫", "左", "武"],
      癸: ["破", "巨", "陰", "貪"],
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
      console.log(palaceIndex);
      const palace = document.getElementById(`zw${palaceIndex}`);
      const mangAElements = palace.querySelectorAll(".MangA"); // Get all .MangA elements
      const mangAContent = mangAElements[1].innerText.split("\n")[0].trim();
      console.log(mangAContent);
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
  document.getElementById("btnNowDate").addEventListener("click", function () {
    ziweiUI.genNowDateZiwei();
  });
  let s = document.querySelectorAll("select");
  for (i = 0; i < s.length; i++) {
    s[i].addEventListener("change", function () {
      ziweiUI.genZiwei();
    });
  }
  let r = document.querySelectorAll("input[type=radio]");
  for (i = 0; i < r.length; i++) {
    r[i].addEventListener("change", function () {
      ziweiUI.genZiwei();
    });
  }
  window.addEventListener("resize", function () {
    ziweiUI.resize();
  });
  //$(window).resize(function() { ziweiUI.resize();});
});
