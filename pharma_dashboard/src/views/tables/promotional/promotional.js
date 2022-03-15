import React, {useState} from "react";
import { CButton, CDataTable } from "@coreui/react";
import ModalForm from "src/views/model/promotional/promo";
import { IconDelete } from "../../icon";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { DeletePromo } from "src/api/promotional/promotional";
import no_product from '../../../assets/images/no_product.jpg'
import ConfirmDelete from '../../../lib/deleteDilog'
import { ModalContext } from "src/lib/context";

const Table = (props) => {
  const Data = props.items;
  const [showModal, updateShowModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(false);

  const toggleModal = (id) => { updateShowModal(state => !state); setDeleteItemId(id) };

  // *******************Table Headers *****************************

  const fields = [
    { key: "title", label: "Title", },
    { key: "image", label: "Image", },
    { key: "description", label: "Description", },
    { key: "created_on", label: "Created On", },
    { key: "Edit", label: "", _style: { width: "1%" }, sorter: false, filter: false, },
    { key: "Delete", label: "", _style: { width: "1%" }, sorter: false, filter: false, },
  ];


  // *******************Delete City*****************************

  const deleteItem = async (id) => {
    let rs = await DeletePromo(id)
    if (rs.success === true) {
      props.deleteItemFromState(id);
      NotificationManager.info("Deleted SuccessFully", "Info", 2000);
    }
    else {
      NotificationManager.error(rs.message, "Info", 2000);
    }
    toggleModal()
  };

  return (
    <>
      <CDataTable
        items={Data}
        fields={fields}
        //   columnFilter
        tableFilter
        itemsPerPageSelect={{ label: 'Items per page:', values: [20, 50, 100, 150] }}
        itemsPerPage={20}
        hover
        sorter
        pagination
        scopedSlots={{
          title: (item) => {
            return (
              <td className="py-2">
                <p style={{ color: "#494949" }}><b>{item.title}</b></p>
              </td>)
          },
          image: (item) => {
            return (
              <td className="py-2">

                {item.image !== null && item.image !== "" && item.image !== undefined ?
                  <img className="grow" src={item.image} alt="promo" style={{ maxHeight: "80px", maxWidth: "80px", minHeight: "80px", minWidth: "80px" }} />
                  :
                  <img className="grow" src={no_product} alt="promo" style={{ maxHeight: "80px", maxWidth: "80px", minHeight: "80px", minWidth: "80px" }} />

                }
              </td>)
          },

          created_on: (item) => {
            return (
              item.created_on ?
                <td className="py-2">
                  {item.created_on}
                </td> : <td className="py-2">{item.created_on}</td>
            )
          },
          description: (item) => {
            return (
              <td className="py-2">
                <p>{item.description}</p>
              </td>
            )
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
      <ModalContext.Provider value={{ showModal, toggleModal, deleteItem, id: `${deleteItemId}` }}>
        <ConfirmDelete canShow={showModal} updateModalState={toggleModal} />
      </ModalContext.Provider>
    </>
  );
};

export default Table;
