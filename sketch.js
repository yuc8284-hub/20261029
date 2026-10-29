let jumpSheet; // 儲存由四格組成的跳躍精靈圖
let walkFrames = []; // 儲存六張獨立的走路動畫影格
let characterX; // 儲存角色目前的水平位置
let characterY; // 儲存角色目前的垂直位置
let facing = 1; // 設定角色朝向，1 為右、-1 為左
const spriteScale = 3; // 放大精靈圖，讓角色在全螢幕畫布中清楚可見
const walkSpeed = 4; // 設定角色每幀的移動距離

function preload() { // 在畫面開始前載入角色動畫圖片
  jumpSheet = loadImage("1/jump/jump.png"); // 載入橫向排列的跳躍精靈圖
  for (let frame = 0; frame < 6; frame++) { // 依序載入六張走路動畫影格
    walkFrames[frame] = loadImage(`1/walk/${frame}.png`); // 載入目前編號的走路影格
  } // 結束走路影格載入迴圈
} // 結束圖片載入函式

function setup() { // 設定全螢幕畫布與角色初始位置
  createCanvas(windowWidth, windowHeight); // 建立符合視窗大小的畫布
  imageMode(CENTER); // 讓精靈圖以指定座標作為中心繪製
  characterX = width / 2; // 將角色放在畫面水平中央
  characterY = height / 2; // 將角色放在畫面垂直中央
} // 結束畫布設定函式

function draw() { // 每一幀更新背景、角色位置與動畫
  background("#fcd5ce"); // 使用指定的粉色作為背景
  const movingRight = keyIsDown(RIGHT_ARROW); // 檢查使用者是否按住右方向鍵
  const movingLeft = keyIsDown(LEFT_ARROW); // 檢查使用者是否按住左方向鍵
  const direction = (movingRight ? 1 : 0) - (movingLeft ? 1 : 0); // 計算目前移動方向
  const isWalking = direction !== 0; // 判斷角色是否正在移動

  if (isWalking) { // 只有按下一個方向鍵時才切換成走路並移動
    facing = direction; // 依移動方向更新角色朝向
    characterX += direction * walkSpeed; // 依方向移動角色
  } // 結束走路移動判斷

  const frameIndex = isWalking // 根據角色狀態計算動畫影格編號
    ? floor(frameCount / 8) % walkFrames.length // 每八幀切換一次走路影格
    : floor(frameCount / 8) % 4; // 每八幀切換一次四格跳躍影格
  const characterWidth = isWalking // 根據目前動畫取得角色繪製寬度
    ? walkFrames[frameIndex].width * spriteScale // 使用走路影格原始寬度放大
    : (183 / 4) * spriteScale; // 使用跳躍精靈圖每格寬度放大
  const halfWidth = characterWidth / 2; // 計算角色的一半寬度以限制移動範圍
  characterX = constrain(characterX, min(halfWidth, width - halfWidth), max(halfWidth, width - halfWidth)); // 避免角色移出畫布左右邊界

  push(); // 暫存畫布狀態以便只翻轉角色
  translate(characterX, characterY); // 將繪圖原點移到角色中心
  scale(facing, 1); // 角色朝左時水平翻轉精靈圖
  if (isWalking) { // 按方向鍵時繪製走路動畫
    const currentFrame = walkFrames[frameIndex]; // 取得目前要繪製的走路影格
    image(currentFrame, 0, 0, currentFrame.width * spriteScale, currentFrame.height * spriteScale); // 放大並繪製走路影格
  } else { // 沒有移動時繪製跳躍動畫
    const frameWidth = 183 / 4; // 計算跳躍精靈圖單格寬度
    image(jumpSheet, 0, 0, frameWidth * spriteScale, 42 * spriteScale, frameIndex * frameWidth, 0, frameWidth, 42); // 裁切並繪製目前跳躍影格
  } // 結束角色動畫繪製判斷
  pop(); // 還原畫布狀態，避免翻轉影響其他繪圖
} // 結束每幀更新函式

function keyPressed() { // 阻止方向鍵操作時瀏覽器捲動畫面
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) { // 僅處理左右方向鍵
    return false; // 停止瀏覽器方向鍵預設行為
  } // 結束方向鍵判斷
} // 結束鍵盤按下事件函式

function windowResized() { // 視窗尺寸改變時同步調整畫布
  resizeCanvas(windowWidth, windowHeight); // 將畫布調整為新的視窗大小
  characterY = height / 2; // 讓角色在調整後仍保持垂直置中
} // 結束視窗尺寸變更函式
