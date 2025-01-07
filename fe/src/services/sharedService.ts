export default abstract class SharedService {

  public static formDataToJson<T extends Record<string, any>>(formData: FormData): T {
    const obj: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (obj[key]) {
        // If the key already exists, convert it to an array or push the value
        obj[key] = Array.isArray(obj[key]) ? [...obj[key], value] : [obj[key], value];
      } else {
        obj[key] = value;
      }
    });
    return obj as T;
  }
}
