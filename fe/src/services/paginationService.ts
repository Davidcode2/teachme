export default class PaginationService {
  private lastValue = 0;
  private pageSize = 10;
  public increment = Math.round(this.pageSize / 3);

  public numberOfItemsToShift(numberOfStoredMaterials: number) {
    return this.pageSize - numberOfStoredMaterials;
  }

  handleScroll(callback: (x: number) => void): () => void {
    return () => {
      if (this.bottomScrollThreshold()) {
        console.log('bottom');
        this.lastValue = -1;
        callback(-1);
      } else if (this.topScrollThreshold()) {
        callback(1);
        this.lastValue = 1;
        console.log('top');
      }
      else if (this.lastValue === 1 || this.lastValue === -1) {
        this.lastValue = 0;
        callback(0);
      }
    };
  }

  private topScrollThreshold = () => {
    return window.scrollY <= 20;
  };

  private bottomScrollThreshold = () => {
    const differenceBottom =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollposition = document.documentElement.scrollTop;
    return differenceBottom - scrollposition <= 2;
  };
}
