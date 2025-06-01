export interface IProduct {
  id: number;
  localizeInfos: { title: Record<string, any> };
  price: number | null;
  attributeValues: {
    p_description: { value: { htmlValue: string }[] };
    p_price: { value: number };
    p_image: { value: { downloadLink: string } };
    p_title: { value: string };
  };
}