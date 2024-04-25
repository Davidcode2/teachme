export default class GradientGenerator {
  private colors = [
    'emerald',
    'teal',
    'violet',
    'fuchsia',
    'purple',
    'zinc',
    'orange',
    'blue',
  ];

  public randomGradient = () => {
    const color1 = this.generateRandomColor();
    const color2 = this.generateRandomColor();
    const colorGradient = `bg-gradient-to-tl from-${color1} to-${color2}`;
    console.log(colorGradient);
    return colorGradient;
  };

  private generateRandomColor = () => {
    const zeroToOne = Number(Math.random().toFixed(1));
    console.log(zeroToOne);
    const zeroToNine = zeroToOne > 0.9 ? zeroToOne - 0.1 : zeroToOne;
    const oneToNine = zeroToNine < 0.1 ? zeroToNine + 0.1 : zeroToNine;
    const colorStrength = oneToNine * 1000;
    const colorIndex = (zeroToOne * 10) % this.colors.length;
    const color = `${this.colors[colorIndex]}-${colorStrength}`;
    return color;
  };
}
