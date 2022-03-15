import React, { useState } from "react";
import { CButton, CDataTable } from "@coreui/react";
import ModalForm from "src/views/model/products/packagingType";
import { IconDelete } from "../../icon";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { DeletePackingType } from "src/api/products/packingType/packingType";
import ConfirmDelete from '../../../lib/deleteDilog'
import { ModalContext } from "src/lib/context";

const Table = (props) => {
  const Data = props.items;
  const [showModal, updateShowModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(false);

  const toggleModal = (id) => { updateShowModal(state => !state); setDeleteItemId(id) };

  // *******************Table Headers *****************************

  const fields = [
    { key: "name", label: "Name", },
    { key: "Edit", label: "", _style: { width: "1%" }, sorter: false, filter: false, },
    { key: "Delete", label: "", _style: { width: "1%" }, sorter: false, filter: false, },
  ];


  // *******************Delete City*****************************

  const deleteItem = async (id) => {
      let rs = await DeletePackingType(id)
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
    className='justify-content-center'
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
        name: (item) => {
          return (
            <td className="py-2">
              <b style={{ color: "#5b5a5a", letterSpacing: "2px" }}>{item.name}</b>
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
