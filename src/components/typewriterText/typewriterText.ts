function typewriterText(
  text: string,
  callback: Function,
  speedRange: { min: number; max: number }
): void {
  let currentText: string;
  let i = 0;

  function typeWriter(text: string) {
    if (i <= text.length) {
      currentText = text.substring(0, i++);
      callback(currentText);
      setTimeout(() => {
        typeWriter(text);
      }, randomInteger(speedRange.min, speedRange.max));
    }
  }

  typeWriter(text);
}

function randomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default typewriterText;
