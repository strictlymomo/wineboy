// ==========================================================
// CONSTANTS
// ==========================================================

const ORIGIN = { x: 1000, y: 1000 };
const FRAME_DIMS = { w: 1000, h: 618 };
const PADDING = 50;

// FONTS
const INTER = { family: "Inter", style: "Bold" };
const IOWAN = { family: "Iowan Old Style", style: "Bold" };
const ITALIANA = { family: "Italiana", style: "Regular" };
const FONTS = [INTER, IOWAN, ITALIANA];
// Load the fonts
await Promise.all(FONTS.map((f) => figma.loadFontAsync(f)));
const FONT_SIZE = 24;
const TEXT_FILLS = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
// https://practicaltypography.com/line-length.html
const ALPHABET = Math.round(FONT_SIZE * 0.618) * 26;
const ALPHABET_2 = ALPHABET * 2.31;

// DATA
const STEINER = "RUDOLF STEINER";
const DATA = [
  "Love starts when we push aside our ego",
  "One can ascend to a higher development only by bringing rhythm and repetition into one's life. Rhythm holds sway in all nature.",
  "Rhythm holds sway in all nature.",
  "The time has come to realize that supersensible knowledge has now to arise from the materialistic grave.",
  "The sun with loving light makes bright for me each day, the soul with spirit power gives strength unto my limbs.",
  "Feelings are for the soul what food is for",
  "Die Kunst ist ewig, ihre Formen wandeln sich. (The art is eternal, their shapes are changing.)",
  "Where is the book in which the teacher can read about what teaching is? The children themselves are this book. We should not learn to teach out of any book other than the one lying open before us and consisting of the children themselves.",
];

// ==========================================================
// MAIN
// ==========================================================

let cPlane: { x: number; y: number } = ORIGIN;

for (const d of DATA) await iterate(d);

// =============================
// METHODS
// =============================
async function iterate(data: string) {
  const frame = createFrame(data);
  let lastTextPosition = createTexts(data, frame, FONTS, [50, 50], ALPHABET);
  lastTextPosition = createTexts(
    data,
    frame,
    FONTS,
    [lastTextPosition[0], lastTextPosition[1] + PADDING],
    ALPHABET_2
  );
  frame.resize(FRAME_DIMS.w, lastTextPosition[1] + PADDING);
  setNextCPlane();
}

/**
 * @returns last text position for dynmically updating the frame height
 */
function createTexts(
  data: string,
  frame: any,
  fonts: any[],
  firstPos: number[],
  lineLength: number
) {
  let pos = firstPos;
  for (let i = 0; i < FONTS.length; i++) {
    const height = createText(data, frame, fonts[i], pos, lineLength);
    pos = [pos[0], pos[1] + height + PADDING];
  }
  const lastTextPosition = pos;
  return lastTextPosition;
}

/**
 * @returns height of textNode
 */
function createText(
  data: string,
  frame: any,
  font: any,
  position: number[],
  lineLength: number
) {
  const text = figma.createText();
  text.x = position[0];
  text.y = position[1];
  text.characters = data;
  text.fontName = font;
  text.fontSize = FONT_SIZE;
  text.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
  text.textAutoResize = "HEIGHT";
  text.resize(lineLength, text.height);
  const height = text.height;
  frame.appendChild(text);
  return height;
}

function createFrame(data: string) {
  const frame = figma.createFrame();
  frame.name = `${data} (${STEINER})`;
  frame.x = cPlane.x;
  frame.y = cPlane.y;
  frame.resize(FRAME_DIMS.w, FRAME_DIMS.h);
  return frame;
}

function setNextCPlane() {
  cPlane = {
    x: cPlane.x + FRAME_DIMS.w + PADDING,
    y: cPlane.y,
  };
}
