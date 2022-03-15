import React, {useState} from "react";
import { CButton, CDataTable } from "@coreui/react";
import ModalForm from "src/views/model/StateAndCity/city";
import { IconDelete } from "../../icon";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { DeleteCity } from "src/api/stateAndCity/city";
import ConfirmDelete from '../../../lib/deleteDilog'
import { ModalContext } from "src/lib/context";

const Table = (props) => {
  const Data = props.items;
  const [showModal, updateShowModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(false);
  const [deleteItemState, setDeleteItemState] = useState(false);
  const [deleteItemName, setDeleteItemName] = useState(false);

  const toggleModal = (state, name , id) => {     
            updateShowModal(state => !state); 
            setDeleteItemId(id) ;
            setDeleteItemName(name) ;
            setDeleteItemState(state) ;
          };

// *******************Table Headers *****************************

  const fields = [
    { key: "name", label: "City", filter: false },
    { key: "Edit", label: "", _style: { width: "1%" }, sorter: false, filter: false, },
    { key: "Delete", label: "", _style: { width: "1%" }, sorter: false, filter: false, },
  ];


// *******************Delete City*****************************

  const deleteItem = async (props_) => {
      let rs = await DeleteCity(props_.deleteItemId , {
        stateId : props_.state,
        cityName : props_.name
      })
      if (rs.success === true){
        props.deleteItemFromState(props.deleteItemId);
        NotificationManager.info("City Deleted SuccessFully", "Info", 2000);
      }
      else{
        NotificationManager.error(rs.message, "Info", 2000);
      }
      toggleModal()

  };

  return (
    <>
    
    <CDataTable
      items={Data}
      fields={fields}
      columnFilter
      tableFilter
      itemsPerPageSelect={{label: 'Items per page:',  values: [20, 50, 100, 150]}}
      itemsPerPage={20}
      hover
      sorter
      pagination
      scopedSlots={{
        Edit: (item, index) => {
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
        Delete: (item, index) => {
          return (
            <td className="py-2">
              <CButton
                color="danger"
                size="sm"
                onClick={() => toggleModal(props.stateId , item.name , item.id)}
              >
                <IconDelete />
              </CButton>
            </td>
          );
        },
      }}
    />
    <ModalContext.Provider value={{ showModal, toggleModal, deleteItem,  id: {deleteItemId : deleteItemId, name: deleteItemName, state:deleteItemState },  }}>
      <ConfirmDelete canShow={showModal} updateModalState={toggleModal} />
    </ModalContext.Provider>
    </>
  );
};

export default Table;
