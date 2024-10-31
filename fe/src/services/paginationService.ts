import { MaterialWithThumbnail } from "../types/MaterialWithThumbnail";

export default class PaginationService {
  private TOP_SCROLL_THRESHOLD = 200; 
  private BOTTOM_SCROLL_THRESHOLD = 200;
  private lastValue = 0;

  public slidingWindowSize = 10;
  public increment = 2;

  public calcNewSlidingWindowEnd(numberOfStoredMaterials: number) {
    const slidingWindowEnd = Math.abs(numberOfStoredMaterials - this.slidingWindowSize);
    console.log('slidingWindowEnd', slidingWindowEnd);
    return slidingWindowEnd;
  }

  public shiftMaterialsLeft(materials: MaterialWithThumbnail[]) {
    return materials.slice(
      0,
      this.slidingWindowSize,
    );
  }

  public shiftMaterialsRight(materials: MaterialWithThumbnail[]) {
    return materials.slice(
      this.calcNewSlidingWindowEnd(materials.length),
      materials.length,
    );
  }

  handleScroll(callback: (x: number) => void): () => void {
    return () => {
      if (this.bottomScrollThreshold()) {
        this.lastValue = -1;
        callback(-1);
      } else if (this.topScrollThreshold()) {
        callback(1);
        this.lastValue = 1;
      } else if (this.lastValue === 1 || this.lastValue === -1) {
        this.lastValue = 0;
        callback(0);
      }
    };
  }

  private topScrollThreshold = () => {
    return window.scrollY <= this.TOP_SCROLL_THRESHOLD;
  };

  private bottomScrollThreshold = () => {
    const differenceBottom =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollposition = document.documentElement.scrollTop;
    return differenceBottom - scrollposition <= this.BOTTOM_SCROLL_THRESHOLD;
  };
}
