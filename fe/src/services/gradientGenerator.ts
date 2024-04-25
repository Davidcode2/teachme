export default class GradientGenerator {
  private colors = ['teal', 'violet', 'fuchsia', 'purple', 'lightblue', 'snow'];

  private gradientDirections = ['to right', 'to top right', 'to bottom right'];

  public randomGradient = () => {
    const color1 = this.generateRandomColor();
    let color2 = this.generateRandomColor();
    if (color1 === color2) {
      color2 = this.generateRandomColor();
    }
    const randomDirection = this.generateRandomDirection()
    const colorGradient = `linear-gradient(${randomDirection}, ${color1}, ${color2})`;
    return colorGradient;
  };

  private generateRandomDirection() {
    const index = Number(Math.random().toFixed(1)) * 10 % this.gradientDirections.length;
    return this.gradientDirections[index];
  }

  private generateRandomColor = () => {
    const zeroToOne = Number(Math.random().toFixed(1));
    const colorIndex = (zeroToOne * 10) % this.colors.length;
    const color = this.colors[colorIndex];
    return color;
  };
}
