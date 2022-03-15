import fetcher from "src/lib/fetcher";
import C from '../../../constants';


const URL = `${C.API_URL}/product`;


const GetProducts = async (data) => {
  let rs = await fetcher({ method: "post", url: `${URL}/get`, data: data })
  return rs
}

const GetProductsCount = async (data) => {
  let rs = await fetcher({ method: "post", url: `${URL}/count`, data: data  })
  return rs
}

const AddProducts = async (data) => {
  let bodyFormData = new FormData();
  bodyFormData.append('name', data.name);
  bodyFormData.append('description', data.description);
  bodyFormData.append('price', data.price);
  bodyFormData.append('min_order_qty', data.min_order_qty);
  bodyFormData.append('details', data.details);
  bodyFormData.append('packing', data.packing);
  bodyFormData.append('packing_type', data.packing_type);
  bodyFormData.append('type_id', data.type_id);
  bodyFormData.append('division_id', data.division_id);
  bodyFormData.append('category_id', data.category_id);
  bodyFormData.append('sku', data.sku);
  bodyFormData.append('hsn_code', data.hsn_code);
  bodyFormData.append('upcoming', data.upcoming);
  bodyFormData.append('packing_qty', data.packing_qty);
  bodyFormData.append('new_launched', data.new_launched);
  if (data.images.length > 0) {
    data.images.forEach(it => bodyFormData.append('images', it))
  }
  if (data.visualate.length > 0) {
    data.visualate.forEach(it => bodyFormData.append('visualate', it))
  }

  let rs = await fetcher({ method: "post", url: `${URL}/add`, data: bodyFormData, headers: { "Content-Type": "multipart/form-data" } })
  return rs
}

const UpdateProducts = async (data) => {
  let bodyFormData = new FormData();
  bodyFormData.append('id', data.id);
  bodyFormData.append('name', data.name);
  bodyFormData.append('description', data.description);
  bodyFormData.append('price', data.price);
  bodyFormData.append('min_order_qty', data.min_order_qty);
  bodyFormData.append('details', data.details); 
  bodyFormData.append('packing', data.packing);
  bodyFormData.append('packing_type', data.packing_type);
  bodyFormData.append('type_id', data.type_id);
  bodyFormData.append('division_id', data.division_id);
  bodyFormData.append('category_id', data.category_id);
  bodyFormData.append('sku', data.sku);
  bodyFormData.append('upcoming', data.upcoming);
  bodyFormData.append('packing_qty', data.packing_qty);
  bodyFormData.append('new_launched', data.new_launched);
  bodyFormData.append('hsn_code', data.hsn_code);
  if (data.images.length > 0) {
    data.images.map((it) => bodyFormData.append('images', it))
  }
  if (data.visualate.length > 0) {
    data.visualate.map((it) => bodyFormData.append('visualate', it))
  }
  let rs = await fetcher({ method: "post", url: `${URL}/update`, data: bodyFormData, headers: { "Content-Type": "multipart/form-data" } })
  return rs
}

const DeleteProducts = async (id) => {
  let rs = await fetcher({ method: "get", url: `${URL}/delete/${id}` })
  return rs
};

const SearchProducts = async (d) => {
  let data = { ...d }
  let rs = await fetcher({ method: "post", url: `${URL}/search`, data: data })
  return rs
}

export { GetProducts, AddProducts, UpdateProducts, GetProductsCount, DeleteProducts, SearchProducts };