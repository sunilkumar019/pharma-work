import React, {useState} from "react";
import { CBadge, CButton, CDataTable, CSelect } from "@coreui/react";
import ModalForm from "src/views/model/products/product";
import { IconDelete } from "../../icon";
import NotificationManager from "react-notifications/lib/NotificationManager";
import productImage from '../../../assets/images/no_product.jpg'
import VisualateImage from '../../../assets/images/no_visulate.jpg'
import { DeleteProducts } from "src/api/products/allProducts/products";
import Page404 from "src/views/pages/page404/Page404";
import ConfirmDelete from '../../../lib/deleteDilog'
import { ModalContext } from "src/lib/context";
import {updateStatusToActive} from "../../../api/products/updateStatusToActive/updateStatusToActive";


const Table = (props) => {
  const Data = props.items;
  // const val = props.searchFilter
  const loading = props.loading
  const [showModal, updateShowModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(false);

  const [isOpen, setIsOpen] = useState(false)
  const [imgUrl, setimgUrl] = useState(false)
  const [alt, setAlt] = useState(false)

  const showModalImg = (imgUrl, alt) => { setIsOpen(true); setimgUrl(imgUrl); setAlt(alt) }


  const toggleModal = (id) => {
    updateShowModal(state => !state); setDeleteItemId(id)
  };

  // *******************Table Headers *****************************

  const fields = [
    { key: "name", label: "Name", },
    { key: "type_name", label: "Type Name", },
    { key: "price_", label: "Price", },
    { key: "images", label: "Images & Visualate", },
    { key: "division_name", label: "Division", },
    { key: "category_name", label: "Category", },
    // { key: "sku_", label: "SKU", },
    // { key: "hsn_code", label: "HSN", },
    { key: "active_inactive", label: "Active/Inactive"},
    { key: "Edit", label: "", _style: { width: "1%" }, sorter: false, filter: false, },
    { key: "Delete", label: "", _style: { width: "1%" }, sorter: false, filter: false, },
  ];

  const getBadge = (active) => {
    switch (active) {
      case true:
        return "primary";
      case false:
        return "secondary";
      default:
    }
  };

  // ******************* Delete *****************************

  const deleteItem = async (id) => {
    let rs = await DeleteProducts(id)
    if (rs.success === true) {
      props.deleteItemFromState(id);
      NotificationManager.info("Product Deleted SuccessFully", "Info", 2000);
    }
    else {
      NotificationManager.error(rs.message, 2000);
    }
    toggleModal()
  };

  const activeInactiveHandler = async (e, item) => {
    const val = e.target.value;
    const data = {
      id: item.id,
      isActive: val === 'active' ? true : false
    }
    try {
      console.log("=================")
      await updateStatusToActive(data);
      NotificationManager.info(`${e.target.value.toUpperCase()} successfully`)
      console.log("=================")
    } catch (e) {
      NotificationManager.error("Something is wrong", 200)
    }
  }

  return (
      <>
        {
          Data === true ? <Page404 /> :
              <>
                <CDataTable
                    items={Data}
                    fields={fields}
                    // tableFilterValue={val}
                    // tableFilter
                    loading={loading}
                    hover
                    scopedSlots={{
                      name: (item) => {
                        return (
                            <td className="py-2">
                              <b style={{ color: "#5b5a5a", letterSpacing: "0.5px" }}>{item.name}</b>
                              {item.new_launched === true ? <CBadge color={getBadge(item.new_launched)}
                                                                    style={{ letterSpacing: "0.5px", marginLeft: "5px" }} ><span>new</span></CBadge> :
                                  <span>
                        {item.upcoming === true ? <span className="badge badge-warning"
                                                        style={{ letterSpacing: "0.5px", marginLeft: "5px" }} ><span style={{color : "rgb(255 255 255)"}}>Coming Soon</span></span> : <></>}
                      </span>
                              }
                            </td>
                        )
                      },
                      sku_: (item) => {
                        return (
                            <td className="py-2">
                              {item.sku === null || item.sku === "undefined" ? <b>--</b> : <p>{item.sku}</p>}
                            </td>
                        )
                      },
                      hsn_code: (item) => {
                        return (
                            <td className="py-2">
                              {item.hsn_code === null || item.sku === "undefined" ? <b>--</b> : <p>{item.hsn_code}</p>}
                            </td>
                        )
                      },
                      division_name : (item) => {
                        return (
                            <td className="py-2">
                              {item.division_name === null || item.sku === "undefined" ? <b>--</b> : <p style={{fontSize : "12px", color : "green", fontWeight : "bold"}}>{item.division_name}</p>}
                            </td>
                        )
                      },
                      price_: (item) => {
                        return (
                            <td className="py-2">
                              <b style={{ color: "#00407c", fontSize: "14px", minWidth: "180px" }}>₹ {item.price}</b>
                            </td>
                        )
                      },
                      images: (item) => {
                        return (
                            <td className="py-2">
                              {item.images && item.images.length > 0 ? item.images.map((it) => {
                                    if (it.type === "IMG") {
                                      return <img onClick={() => showModalImg(`${it.url}`, `PRODUCT - ${item.name}`)} className="grow product_border"  src={it.url} alt="product" />
                                    }
                                    else {
                                      return <img onClick={() => showModalImg(`${it.url}`, `VISULATE - ${item.name}`)} className="grow vis_border" src={it.url} alt="Visulate" />
                                    }
                                  })
                                  :
                                  <>
                                    <img className="grow" style={{ width: "60px", height: "60px" }} src={productImage} alt="no_product" />
                                    <img className="grow" style={{ width: "60px", height: "60px", paddingLeft: "5px" }} src={VisualateImage} alt="no_product" />
                                  </>
                              }
                            </td>
                        )
                      },
                      active_inactive: (item) => {
                        return <td>
                          <CSelect key={item.id && item.id.substr(0, 5)} onChange={(e) => activeInactiveHandler(e, item)} defaultValue={item.active ? 'active' : 'inactive'} size="sm" className={``} >
                            <option value="active"> ACTIVE </option>
                            <option value="inactive"> INACTIVE </option>
                          </CSelect>
                        </td>
                      },
                      Edit: (item) => {
                        return (
                            <td className="py-2">
                              <ModalForm
                                  stateId={props.stateId}
                                  buttonLabel="Edit"
                                  item={item}
                                  updateState={props.updateState}
                              />
                            </td>
                        );
                      },
                      Delete: (item) => {
                        return (
                            <td className="py-2">
                              <CButton
                                  color="danger"
                                  size="sm"
                                  onClick={() => toggleModal(item.id)}
                              >
                                <IconDelete />
                              </CButton>
                            </td>
                        );
                      },
                    }}
                />
                {isOpen === true ? (
                        <div className="modalImg">
                <span className="closeImg" onClick={() => setIsOpen(false)}>
                  &times;
                </span>
                          <img className="modal-contentImg" src={imgUrl} alt={alt} />
                          <div className="captionImg">{alt}</div>
                        </div>
                    )
                    : <> </>
                }
                <ModalContext.Provider value={{ showModal, toggleModal, deleteItem, id: `${deleteItemId}` }}>
                  <ConfirmDelete canShow={showModal} updateModalState={toggleModal} />
                </ModalContext.Provider>
              </>
        }
      </>
  );
};

export default Table;
