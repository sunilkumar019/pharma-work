import React, {useState} from "react";
import { CBadge, CButton, CDataTable,  } from "@coreui/react";
import { IconDelete } from "src/views/icon";
import ModalForm from "src/views/model/distributor/distributorModel";
import { Link } from "react-router-dom";
import { ActivateDistributer, DeleteRepAndFranchisee,} from "src/api/distributor/distributor";
import { NotificationManager } from "react-notifications";
import Model from '../../model/distributor/Franchisee'
import ConfirmDelete from '../../../lib/deleteDilog'
import { ModalContext } from "src/lib/context";


const Table = (props) => {
  const Data = props.items;
  const val = props.searchFilter
  const loading = props.loading
  const [showModal, updateShowModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(false);
  // const [active, setActive] =  useState(Data.active);

  // const toggle = (status) =>{

  //   let rs = await UpdateRepAndFranchisee({

  //   });
  
  // }

  const toggleModal = (id) => { updateShowModal(state => !state); setDeleteItemId(id); console.log("run") };


  const activeDist = async (id, active) => {

    let status = false

    if (active === true) { status = false}
    else { status = true }
    
    let rs = await ActivateDistributer({
      id : id ,
      active : status
    });
    if (rs.success === true) {
      props.updateState(true);
      if (rs.data.active === true) {
        NotificationManager.success("Distributor Activated Successfully", "Success", 2000);
      } else {
        NotificationManager.info("Distributor DeActivated Successfully", "Info", 2000);
      }
    }
    else {
      NotificationManager.error('Something went wrong', "Error", 2000);
    }
    toggleModal();
  }

  const fields = [
    { key: "name", label: "Name" },
    { key: "active", label: "Status", sorter: false, filter: false, },
    { key: "franchisee_name", label: "Franchisee" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "op_area", label: "OP Area" },
    { key: "View_Mr", label: "Mr", sorter: false, filter: false, },
    { key: "Edit", label: "", _style: { width: "1%" }, sorter: false, filter: false, },
    { key: "Delete", label: "", _style: { width: "1%" }, sorter: false, filter: false, },
  ];


  const getBadge = (active) => {
    switch (active) {
      case true:
        return "success";
      case false:
        return "danger";
      default:

    }
  };

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

  return (
    <>
    <CDataTable
      items={Data}
      tableFilterValue={val}
      fields={fields}
      // columnFilter
      // tableFilter
      loading={loading}
      hover
      sorter
      // pagination
      scopedSlots={{
        name: (item) => {
          return (
            <td className="py-2">
              <p style={{ fontSize: "12px" }}><b>{item.name}</b></p>
            </td>
          );
        },
        active: (item) => {
          return (
            <td className="py-2">

            {item.active === true ?
                <CBadge style={{cursor : "pointer"}} onClick={() => activeDist(item.id, item.active)}  color={getBadge(item.active)}>
                  <span>Active</span>
                </CBadge>
                :
                <CBadge style={{cursor : "pointer"}} onClick={() => activeDist(item.id, item.active)}   color={getBadge(item.active)}>
                  <span>Click to Activate</span>
                </CBadge>
                 }
            
            </td>
          )
        },
        franchisee_name: (item) => {
          return (
            <td className="py-2">
              <b><Model buttonLabel={item.franchisee_name} franchiseeId={item.franchisee_id} /></b>
            </td>
          );
        },
        email: (item) => {
          return (
            <td className="py-2">
              <p style={{ fontSize: "12px" }}><b>{item.email || 'NA'}</b></p>
            </td>
          );
        },
        phone: (item) => {
          return (
            <td className="py-2">
              <p style={{ fontSize: "12px" }}><b>{item.phone}</b></p>
            </td>
          );
        },
        address: (item) => {
          return (
            <td className="py-2">
              <p style={{ fontSize: "12px" }}><b>{item.address}</b></p>
            </td>
          );
        },
        op_area: (item) => {
          return (
            <td className="py-2">
              <p style={{ fontSize: "12px" }}><b>{item.op_area}</b></p>
            </td>
          );
        },
        View_Mr: (item) => {
          return (
            <td className="py-2" size="sm">
              <Link to={{
                pathname: "/distributor/mr",
                franchisee_id: `${item.franchisee_id}`,
              }}><span style={{ fontSize: "13px" }} className="badge badge-pill badge-primary">View Mr</span></Link>
            </td >
          );
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
