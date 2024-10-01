export default class CardService {

  public async getPreview(materialId: string) {
    const res = await fetch(`/api/materials/id/${materialId}`, {
      method: 'GET',
    });
    const json = await res.json();
    return json;
  }

  public getImages(imageBuffers: { data: number[] }[]) {
    const images: string[] = [];
    imageBuffers.forEach((img) => {
      const imageUrl = URL.createObjectURL(
        new Blob([new Uint8Array(img.data)], { type: 'image/png' }),
      );
      images.push(imageUrl);
    });
    return images;
  }

  public async getAuthor(authorId: string) {
    const res = await fetch(`/api/users/author/${authorId}`, {
      method: 'GET',
    });
    const json = await res.json();
    return json;
  }
}
