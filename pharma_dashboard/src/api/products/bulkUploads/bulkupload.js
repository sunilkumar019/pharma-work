import fetcher from "src/lib/fetcher";
import C from '../../../constants';

const URL = `${C.API_URL}/product`;


const UploadListCsv = async (data) => {
  let bodyFormData = new FormData();

  if (data.productFile.length > 0) {
    data.productFile.map((it) => bodyFormData.append('productsfile', it))
  }
  let rs = await fetcher({ method: "post", url: `${URL}/bulkListUpload`, data: bodyFormData, headers: { "Content-Type": "multipart/form-data" } })
  return rs;

}

const UploadImgVis = async (data) => {
  let bodyFormData = new FormData();
  if (data.productImages.length > 0) {
    data.productImages.map((it) => bodyFormData.append('images', it))
  }
  bodyFormData.append('type', data.imagesType);
  let rs = await fetcher({ method: "post", url: `${URL}/bulkImagesUpload`, data: bodyFormData, headers: { "Content-Type": "multipart/form-data" } })
  return rs;
}

const TechDetails = async (data) => {
  let bodyFormData = new FormData();

  if (data.productFile.length > 0) {
    data.productFile.map((it) => bodyFormData.append('docs', it))
  }
  let rs = await fetcher({ method: "post", url: `${URL}/bulkDocsUpload`, data: bodyFormData, headers: { "Content-Type": "multipart/form-data" } })
  return rs;
}

export { UploadListCsv, UploadImgVis, TechDetails };