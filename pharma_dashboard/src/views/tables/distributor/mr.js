import React, {useState} from "react";
import {CBadge, CButton, CDataTable} from "@coreui/react";
import ModalForm from "../../model/distributor/distributorModel";
import {IconDelete} from "../../icon";
import ConfirmDelete from "../../../lib/deleteDilog";
import {ModalContext} from "../../../lib/context";
import {DeleteRepAndFranchisee} from "../../../api/distributor/distributor";
import {NotificationManager} from "react-notifications";
import MrModal from "../../model/mr/MrModal";

const Table = (props) => {
  const Data = props.items;

  const [showModal, updateShowModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(false);

  const fields = [
    { key: "name", label: "Name" },
    { key: "active", label: "Status" , sorter: false, filter: false,},
    {key: "franchisee_name",label: "Franchisee"},
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "dob", label: "DOB" },
    { key: "op_area", label: "OP Area" },
    { key: "Edit", label: "", _style: { width: "1%" }, sorter: false, filter: false, },
    { key: "Delete", label: "", _style: { width: "1%" }, sorter: false, filter: false, },
  ];

  const toggleModal = (id) => {
    updateShowModal(state => !state);
    setDeleteItemId(id);
  }

  const deleteItem = async (id) => {
    let rs = await DeleteRepAndFranchisee(id)
    if (rs.success === true) {
      props.deleteItemFromState(id);
      NotificationManager.info("Distributor Deleted SuccessFully", "Success", 2000);
    }
    else {
      NotificationManager.error(rs.message, "Success", 2000);
    }
    toggleModal()
  };

  const getBadge = (active) => {
    switch (active) {
      case true:
        return "success";
      case false:
        return "secondary";
        default:

    }
  };

  return (
    <>
      <CDataTable
        items={Data}
        fields={fields}
        // columnFilter
        tableFilter
        itemsPerPageSelect={{label: 'Items per page:',  values: [20, 50, 100, 150]}}
        itemsPerPage={20}
        hover
        sorter
        pagination
        scopedSlots={{
          name: (item, index) => {
            return (
              <td className="py-2">
                <p>{item.name}</p>
              </td>
            );
          },
          active: (item) => {
            return (
              <td className="py-2">
                <CBadge color={getBadge(item.active)}>{item.active === true ? <span>Active</span> : <span>Inactive</span>}</CBadge>
              </td>
            )
          },
          Edit: (item) => {
            return (
              <td className="py-2">
                <MrModal
                  stateId={props.stateId}
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
        }
        }
      />
      <ModalContext.Provider value={{ showModal, toggleModal, deleteItem, id: `${deleteItemId}` }}>
        <ConfirmDelete canShow={showModal} updateModalState={toggleModal} />
      </ModalContext.Provider>
    </>

  );
};

export default Table;
