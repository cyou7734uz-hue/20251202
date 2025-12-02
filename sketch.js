let standSpriteSheet;
let walkSpriteSheet;
let runSpriteSheet;
let rollSpriteSheet;
let jumpSpriteSheet;
let attackSpriteSheet;
let standSpriteSheet2; // 角色二的待機圖片精靈
let hitSpriteSheet2; // 角色二被攻擊的圖片精靈
let triggerSpriteSheet2; // 角色二觸發的圖片精靈

let standAnimation = [];
let walkAnimation = [];
let runAnimation = [];
let rollAnimation = [];
let jumpAnimation = [];
let attackAnimation = [];
let standAnimation2 = []; // 角色二的待機動畫
let hitAnimation2 = []; // 角色二被攻擊的動畫
let triggerAnimation2 = []; // 角色二觸發的動畫

let characterX;
let characterY;
let velocityY = 0;
const gravity = 0.6;
const jumpForce = -15;
let isJumping = false;
let isAttacking = false;
let groundY;
let character2X; // 角色二的 X 座標
let character2Y; // 角色二的 Y 座標
let isCharacter2Hit = false; // 角色二是否被擊中
let isCharacter2Triggered = false; // 角色二是否被觸發
let character2HitTimer = -1; // 角色二被攻擊後的計時器，用於停止3秒

let currentFrameIndex = 0;
let lastAnimationType = null;
let direction = 1; // 1 for right, -1 for left
let currentFrameIndex2 = 0; // 角色二的當前畫格索引
let hitFrameIndex2 = 0; // 角色二被攻擊動畫的畫格索引
let triggerFrameIndex2 = 0; // 角色二觸發動畫的畫格索引
let inputField; // 文字輸入框
let dialogMessage = ''; // 要顯示的對話內容
let dialogState = 'none'; // 對話狀態: none, initial, input, final, completed
let showFinalDialog = false; // 是否顯示最終對話
let finalDialogTimer = -1; // 最終對話的計時器
let inputFieldVisible = false; // 追蹤輸入框是否已顯示過


// 待機動畫的屬性
const standFrameCount = 16;
const standSheetWidth = 699;
const standFrameWidth = standSheetWidth / standFrameCount;

// 走路動畫的屬性
const walkFrameCount = 17;
const walkSheetWidth = 930;
const walkFrameWidth = walkSheetWidth / walkFrameCount;

// 跑步動畫的屬性
const runFrameCount = 16;
const runSheetWidth = 1243;
const runFrameHeight = 70;
const runFrameWidth = runSheetWidth / runFrameCount;

// 翻滾動畫的屬性
const rollFrameCount = 3;
const rollSheetWidth = 184;
const rollFrameHeight = 53;
const rollFrameWidth = rollSheetWidth / rollFrameCount;

// 跳躍動畫的屬性
const jumpFrameCount = 4;
const jumpSheetWidth = 247;
const jumpFrameHeight = 72;
const jumpFrameWidth = jumpSheetWidth / jumpFrameCount;

// 攻擊動畫的屬性
const attackFrameCount = 19;
const attackSheetWidth = 2788;
const attackFrameHeight = 89;
const attackFrameWidth = attackSheetWidth / attackFrameCount;

// 角色二待機動畫的屬性
const standFrameCount2 = 19;
const standSheetWidth2 = 1078;
const standSheetHeight2 = 82;
const standFrameWidth2 = standSheetWidth2 / standFrameCount2;

// 角色二被攻擊動畫的屬性
const hitFrameCount2 = 25;
const hitSheetWidth2 = 2720;
const hitSheetHeight2 = 103;
const hitFrameWidth2 = hitSheetWidth2 / hitFrameCount2;

// 角色二觸發動畫的屬性
const triggerFrameCount2 = 16;
const triggerSheetWidth2 = 1259;
const triggerSheetHeight2 = 91;
const triggerFrameWidth2 = triggerSheetWidth2 / triggerFrameCount2;

// 在 setup() 之前預先載入圖片資源
function preload() {
  standSpriteSheet = loadImage('角色一/待機/all.png');
  walkSpriteSheet = loadImage('角色一/走/all.png');
  runSpriteSheet = loadImage('角色一/跑跑/all.png');
  rollSpriteSheet = loadImage('角色一/翻滾/all.png');
  jumpSpriteSheet = loadImage('角色一/跳/all2.png');
  attackSpriteSheet = loadImage('角色一/向前攻擊/all.png');
  // 載入角色二的圖片
  standSpriteSheet2 = loadImage('角色二/待機/all.png');
  hitSpriteSheet2 = loadImage('角色二/被攻擊/all.png');
  triggerSpriteSheet2 = loadImage('角色二/觸發/all.png');
}

function setup() {
  // 建立一個填滿整個瀏覽器視窗的畫布
  createCanvas(windowWidth, windowHeight);

  // 建立輸入框並初始隱藏
  inputField = createInput();
  inputField.hide();

  // 初始化角色位置在畫面中央
  characterX = width / 2;
  groundY = height / 2;
  characterY = groundY;

  // 初始化角色二的位置在角色一左邊
  character2X = width / 4;
  character2Y = groundY;

  // 將圖片精靈切割成 16 個獨立的畫格
  for (let i = 0; i < standFrameCount; i++) {
    let frame = standSpriteSheet.get(i * standFrameWidth, 0, standFrameWidth, 88); // 待機高度為 88
    standAnimation.push(frame);
  }

  // 將走路的圖片精靈切割成 17 個獨立的畫格
  for (let i = 0; i < walkFrameCount; i++) {
    let frame = walkSpriteSheet.get(i * walkFrameWidth, 0, walkFrameWidth, 88); // 走路高度為 88
    walkAnimation.push(frame);
  }

  // 將跑步的圖片精靈切割成 16 個獨立的畫格
  for (let i = 0; i < runFrameCount; i++) {
    let frame = runSpriteSheet.get(i * runFrameWidth, 0, runFrameWidth, runFrameHeight);
    runAnimation.push(frame);
  }

  // 將翻滾的圖片精靈切割成 11 個獨立的畫格
  for (let i = 0; i < rollFrameCount; i++) {
    let frame = rollSpriteSheet.get(i * rollFrameWidth, 0, rollFrameWidth, rollFrameHeight);
    rollAnimation.push(frame);
  }

  // 將跳躍的圖片精靈切割成 4 個獨立的畫格
  for (let i = 0; i < jumpFrameCount; i++) {
    let frame = jumpSpriteSheet.get(i * jumpFrameWidth, 0, jumpFrameWidth, jumpFrameHeight);
    jumpAnimation.push(frame);
  }

  // 將攻擊的圖片精靈切割成 19 個獨立的畫格
  for (let i = 0; i < attackFrameCount; i++) {
    let frame = attackSpriteSheet.get(i * attackFrameWidth, 0, attackFrameWidth, attackFrameHeight);
    attackAnimation.push(frame);
  }

  // 將角色二的圖片精靈切割成 19 個獨立的畫格
  for (let i = 0; i < standFrameCount2; i++) {
    let frame = standSpriteSheet2.get(i * standFrameWidth2, 0, standFrameWidth2, standSheetHeight2);
    standAnimation2.push(frame);
  }

  // 將角色二被攻擊的圖片精靈切割成 25 個獨立的畫格
  for (let i = 0; i < hitFrameCount2; i++) {
    let frame = hitSpriteSheet2.get(i * hitFrameWidth2, 0, hitFrameWidth2, hitSheetHeight2);
    hitAnimation2.push(frame);
  }

  // 將角色二觸發的圖片精靈切割成 7 個獨立的畫格
  for (let i = 0; i < triggerFrameCount2; i++) {
    let frame = triggerSpriteSheet2.get(i * triggerFrameWidth2, 0, triggerFrameWidth2, triggerSheetHeight2);
    triggerAnimation2.push(frame);
  }
}

function draw() {
  // 設定背景顏色
  background('#a8dadc');

  // --- 決定角色二的方向 ---
  let direction2 = 1; // 預設向右
  if (characterX < character2X) {
    direction2 = -1; // 如果角色一在左邊，角色二就轉向左邊
  }

  // --- 角色二互動邏輯 ---
  const triggerDistance = 150; // 觸發動畫的距離
  const distance = abs(characterX - character2X);
  // 如果角色一靠近，且角色二當前不是被攻擊或已觸發狀態
  if (distance < triggerDistance && !isCharacter2Hit && !isCharacter2Triggered) {
    isCharacter2Triggered = true;
    triggerFrameIndex2 = 0; // 從頭播放觸發動畫
  }

  // --- 對話系統邏輯 ---
  if (distance < triggerDistance && !isCharacter2Hit && dialogState === 'none' && !showFinalDialog) {
    dialogState = 'initial'; // 進入初始對話狀態
    finalDialogTimer = millis(); // 使用 finalDialogTimer 作為計時器
  } else if (distance >= triggerDistance) {
    dialogState = 'none'; // 離開範圍時重置
    if (inputFieldVisible || dialogState === 'completed') {
      inputField.hide();
      inputFieldVisible = false;
    }
  }

  if (dialogState === 'initial' && millis() - finalDialogTimer > 2000) {
    dialogState = 'input'; // 2秒後進入輸入狀態
    finalDialogTimer = millis(); // 重置計時器
    inputFieldVisible = false; // 重置標記
  }

  if (dialogState === 'input' && !showFinalDialog) {
    if (!inputFieldVisible) {
      inputField.show();
      inputField.style('position', 'absolute');
      inputField.style('font-size', '16px');
      inputField.style('padding', '5px');
      inputField.style('z-index', '100');
      inputField.position(characterX - 50, characterY - 100); // 輸入框顯示在角色一上方
      inputField.elt.focus(); // 自動聚焦輸入框
      inputFieldVisible = true;
    }
  } else {
    if (inputFieldVisible) {
      inputField.hide();
      inputFieldVisible = false;
    }
  }

  // --- 繪製角色二 ---
  imageMode(CENTER);
  if (isCharacter2Hit) {
    // 播放被攻擊動畫
    if (direction2 === -1) {
      push();
      translate(character2X, character2Y);
      scale(-1, 1);
      image(hitAnimation2[hitFrameIndex2], 0, 0);
      pop();
    } else {
      image(hitAnimation2[hitFrameIndex2], character2X, character2Y);
    }
    if (frameCount % 4 === 0) { // 控制被攻擊動畫速度
      hitFrameIndex2++;
    }
    // 動畫播放完畢後，進入停止狀態
    if (hitFrameIndex2 >= hitAnimation2.length) {
      isCharacter2Hit = false;
      hitFrameIndex2 = 0;
      character2HitTimer = millis(); // 記錄被攻擊結束的時間
      isCharacter2Triggered = false; // 禁用觸發動畫
    }
  } else if (millis() - character2HitTimer < 3000 && character2HitTimer !== -1) {
    // 被攻擊後停止3秒，顯示被攻擊動畫的第22幀（索引21）作為受傷姿態
    const injuredFrame = 21; // 第22幀對應索引21
    if (direction2 === -1) {
      push();
      translate(character2X, character2Y);
      scale(-1, 1);
      image(hitAnimation2[injuredFrame], 0, 0);
      pop();
    } else {
      image(hitAnimation2[injuredFrame], character2X, character2Y);
    }
  } else if (character2HitTimer !== -1) {
    // 3秒後重置計時器
    character2HitTimer = -1;
  } else if (isCharacter2Triggered) {
    // 播放觸發動畫
    if (direction2 === -1) {
      push();
      translate(character2X, character2Y);
      scale(-1, 1);
      image(triggerAnimation2[triggerFrameIndex2], 0, 0);
      pop();
    } else {
      image(triggerAnimation2[triggerFrameIndex2], character2X, character2Y);
    }

    if (frameCount % 6 === 0) { // 控制觸發動畫速度
      triggerFrameIndex2++;
    }
    // 動畫播放完畢後，恢復待機狀態
    if (triggerFrameIndex2 >= triggerAnimation2.length) {
      isCharacter2Triggered = false;
    }
  } else {
    // 播放待機動畫，並根據方向翻轉
    currentFrameIndex2 = floor(frameCount / 6) % standAnimation2.length;
    if (direction2 === -1) {
      push();
      translate(character2X, character2Y);
      scale(-1, 1);
      image(standAnimation2[currentFrameIndex2], 0, 0);
      pop();
    } else {
      image(standAnimation2[currentFrameIndex2], character2X, character2Y);
    }
  }

  // 顯示初始對話框 "你叫什麼名字!"
  if (dialogState === 'initial') {
    const textY = character2Y - 80; // 文字方塊在角色上方
    // 設定文字樣式
    textSize(20);
    textAlign(CENTER, CENTER);
    // 繪製文字背景方塊
    fill(255, 255, 255, 200); // 白色半透明背景
    rectMode(CENTER);
    const messageWidth = textWidth('你叫什麼名字!');
    rect(character2X, textY, messageWidth + 30, 40, 5); // 圓角矩形
    fill(0); // 黑色文字
    text('你叫什麼名字!', character2X, textY);
  }

  // 如果需要顯示最終對話框
  if (showFinalDialog) {
    const textY = character2Y - 80; // 文字方塊在角色上方
    // 設定文字樣式
    textSize(20);
    textAlign(CENTER, CENTER);
    // 繪製文字背景方塊
    fill(255, 255, 255, 200); // 白色半透明背景
    rectMode(CENTER);
    rect(character2X, textY, textWidth(dialogMessage) + 30, 40, 5); // 圓角矩形
    fill(0); // 黑色文字
    text(dialogMessage, character2X, textY);

    // 檢查計時器是否超過2秒
    if (millis() - finalDialogTimer > 2000) {
      showFinalDialog = false; // 隱藏對話框
      dialogState = 'completed'; // 對話流程結束，進入完成狀態
    }
  }

  // 設定圖片的繪製模式為中心對齊
  imageMode(CENTER);

  // --- 攻擊動畫邏輯 (最高優先級) ---
  if (isAttacking) {
    // --- 攻擊碰撞檢測 ---
    const attackRange = 120; // 角色一的攻擊範圍
    // 在攻擊動畫的特定影格檢查碰撞 (例如第5到10幀)
    if (currentFrameIndex >= 5 && currentFrameIndex <= 10) {
      if (direction === 1 && character2X > characterX && character2X < characterX + attackRange) {
        isCharacter2Hit = true;
        hitFrameIndex2 = 0; // 重置被攻擊動畫
      } else if (direction === -1 && character2X < characterX && character2X > characterX - attackRange) {
        isCharacter2Hit = true;
        hitFrameIndex2 = 0; // 重置被攻擊動畫
      }
    }

    // 根據角色方向繪製攻擊動畫
    if (direction === -1) {
      push();
      translate(characterX, characterY);
      scale(-1, 1);
      image(attackAnimation[currentFrameIndex], 0, 0);
      pop();
    } else {
      image(attackAnimation[currentFrameIndex], characterX, characterY);
    }

    // 每 3 個繪圖幀更新一次攻擊動畫的畫格
    if (frameCount % 3 === 0) {
      currentFrameIndex++;
    }

    // 如果動畫播放完畢，結束攻擊狀態
    if (currentFrameIndex >= attackAnimation.length) {
      isAttacking = false;
    }
    return; // 正在攻擊時，不執行後續的移動和待機邏輯
  }

  // --- 跳躍物理計算 ---
  if (isJumping) {
    velocityY += gravity; // 施加重力
    characterY += velocityY; // 更新Y座標

    // 如果角色落地
    if (characterY >= groundY) {
      characterY = groundY; // 將Y座標固定在地面上
      velocityY = 0;
      isJumping = false; // 結束跳躍狀態
    }
  }

  // 根據按鍵更新角色X座標
  // 當角色不在跳躍時，才能左右移動
  if (!isJumping && !isAttacking) {
    if (keyIsDown(CONTROL) && keyIsDown(RIGHT_ARROW)) {
    direction = 1;
    characterX += 8; // 翻滾速度
  } else if (keyIsDown(CONTROL) && keyIsDown(LEFT_ARROW)) {
    direction = -1;
    characterX -= 8; // 翻滾速度
  } else if (keyIsDown(SHIFT) && keyIsDown(RIGHT_ARROW)) {
    direction = 1;
    characterX += 8; // 跑步速度
  } else if (keyIsDown(SHIFT) && keyIsDown(LEFT_ARROW)) {
    direction = -1;
    characterX -= 8; // 跑步速度
  } else if (keyIsDown(RIGHT_ARROW)) {
    direction = 1;
    characterX += 3;
  } else if (keyIsDown(LEFT_ARROW)) {
    direction = -1;
    characterX -= 3;
  }

  }
  // 防止角色走出畫布邊界
  // 我們使用較寬的走路畫格寬度來計算，確保角色身體不會超出邊界
  const characterHalfWidth = walkFrameWidth / 2;
  characterX = constrain(characterX, characterHalfWidth, width - characterHalfWidth);

  // 檢查方向鍵
  if (keyIsDown(CONTROL) && keyIsDown(RIGHT_ARROW)) {
    if (isJumping) {
      // 如果在跳躍中，優先顯示跳躍動畫
      currentFrameIndex = min(floor(jumpAnimation.length * 0.75), jumpAnimation.length - 1); // 跳躍中途的幀
      if (direction === -1) {
        push();
        translate(characterX, characterY);
        scale(-1, 1);
        image(jumpAnimation[currentFrameIndex], 0, 0);
        pop();
      } else {
        image(jumpAnimation[currentFrameIndex], characterX, characterY);
      }
      return; // 提前結束draw函式
    }
    // 向右翻滾
    if (lastAnimationType !== 'rollRight') {
      currentFrameIndex = 0;
      lastAnimationType = 'rollRight';
    }
    currentFrameIndex = floor(frameCount / 4) % rollAnimation.length;
    image(rollAnimation[currentFrameIndex], characterX, characterY);
    return; // 翻滾動畫完成後結束
  } else if (keyIsDown(UP_ARROW) && !isJumping) {
    // 觸發跳躍
    isJumping = true;
    velocityY = jumpForce;
    lastAnimationType = 'jump';
  } else if (keyIsDown(CONTROL) && keyIsDown(LEFT_ARROW)) {
    // 向左翻滾
    if (lastAnimationType !== 'rollLeft') {
      currentFrameIndex = 0;
      lastAnimationType = 'rollLeft';
    }
    currentFrameIndex = floor(frameCount / 4) % rollAnimation.length;

    // 透過 push/pop 和 scale(-1, 1) 來水平翻轉圖片
    push(); // 儲存當前的繪圖狀態
    translate(characterX, height / 2); // 移動到角色位置
    scale(-1, 1); // 水平翻轉座標系
    // 因為已經 translate 過，所以在 (0, 0) 繪製圖片
    image(rollAnimation[currentFrameIndex], 0, 0); 
    pop(); // 恢復原本的繪圖狀態
  } else if (keyIsDown(SHIFT) && keyIsDown(RIGHT_ARROW)) {
    // 向右跑
    if (lastAnimationType !== 'runRight') {
      currentFrameIndex = 0;
      lastAnimationType = 'runRight';
    }
    currentFrameIndex = floor(frameCount / 4) % runAnimation.length;
    image(runAnimation[currentFrameIndex], characterX, characterY);
    return; // 跑步動畫完成後結束
  } else if (keyIsDown(SHIFT) && keyIsDown(LEFT_ARROW)) {
    // 向左跑
    if (lastAnimationType !== 'runLeft') {
      currentFrameIndex = 0;
      lastAnimationType = 'runLeft';
    }
    currentFrameIndex = floor(frameCount / 4) % runAnimation.length;

    // 透過 push/pop 和 scale(-1, 1) 來水平翻轉圖片
    push(); // 儲存當前的繪圖狀態
    translate(characterX, height / 2); // 移動到角色位置
    scale(-1, 1); // 水平翻轉座標系 
    // 因為已經 translate 過，所以在 (0, 0) 繪製圖片
    image(runAnimation[currentFrameIndex], 0, 0);
    pop(); // 恢復原本的繪圖狀態
    return; // 跑步動畫完成後結束
  } else if (keyIsDown(RIGHT_ARROW)) {
    // 向右走
    // 播放走路動畫
    if (lastAnimationType !== 'walkRight') {
      currentFrameIndex = 0;
      lastAnimationType = 'walkRight';
    }
    currentFrameIndex = floor(frameCount / 5) % walkAnimation.length;
    image(walkAnimation[currentFrameIndex], characterX, characterY);
    return; // 走路動畫完成後結束
  } else if (keyIsDown(LEFT_ARROW)) {
    // 向左移動
    // 播放走路動畫
    if (lastAnimationType !== 'walkLeft') {
      currentFrameIndex = 0;
      lastAnimationType = 'walkLeft';
    }
    currentFrameIndex = floor(frameCount / 5) % walkAnimation.length;
    
    // 透過 push/pop 和 scale(-1, 1) 來水平翻轉圖片
    push(); // 儲存當前的繪圖狀態
    translate(characterX, height / 2); // 移動到角色位置
    scale(-1, 1); // 水平翻轉座標系
    // 因為已經 translate 過，所以在 (0, 0) 繪製圖片
    image(walkAnimation[currentFrameIndex], 0, 0); 
    pop(); // 恢復原本的繪圖狀態
    return; // 走路動畫完成後結束
  } else {
    // 如果正在跳躍，顯示跳躍動畫
    if (isJumping) {
      // 根據垂直速度決定播放哪一幀，模擬上升和下降的樣子
      if (velocityY < -5) currentFrameIndex = 1; // 上升
      else if (velocityY > 5) currentFrameIndex = 2; // 下降
      else currentFrameIndex = 0; // 最高點
      
      if (direction === -1) {
        push();
        translate(characterX, characterY);
        scale(-1, 1);
        image(jumpAnimation[currentFrameIndex], 0, 0);
        pop();
      } else {
        image(jumpAnimation[currentFrameIndex], characterX, characterY);
      }
      return; // 跳躍動畫完成後結束，不執行待機動畫
    }
    // 播放待機動畫
    if (lastAnimationType !== 'stand') {
      currentFrameIndex = 0;
      lastAnimationType = 'stand';
    }
    currentFrameIndex = floor(frameCount / 6) % standAnimation.length;
    if (direction === -1) {
      push();
      translate(characterX, characterY);
      scale(-1, 1);
      image(standAnimation[currentFrameIndex], 0, 0);
      pop();
    } else {
      image(standAnimation[currentFrameIndex], characterX, characterY);
    }
  }
}

// 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  // 當按下空白鍵，且角色不在跳躍或攻擊中時，觸發攻擊
  if (key === ' ' && !isJumping && !isAttacking) {
    isAttacking = true;
    currentFrameIndex = 0; // 從第一幀開始播放
    lastAnimationType = 'attack';
  }

  // 當輸入框可見時，按下 Enter 鍵
  if (keyCode === ENTER && dialogState === 'input') {
    const inputText = inputField.value();
    if (inputText.trim() !== '') {
      dialogMessage = inputText + "歡迎你!!";
      inputField.value(''); // 清空輸入框
      inputField.hide(); // 提交後立刻隱藏
      dialogState = 'final'; // 進入最終顯示狀態
      showFinalDialog = true; // 準備顯示最終對話
      finalDialogTimer = millis(); // 啟動計時器
    }
  }
}
