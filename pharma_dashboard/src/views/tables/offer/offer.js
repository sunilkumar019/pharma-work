import React, {useState} from "react";
import { CButton, CDataTable } from "@coreui/react";
import ModalForm from "src/views/model/offer/offer";
import { IconDelete } from "../../icon";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { Link, useHistory } from "react-router-dom";
import { DeleteOffer } from "src/api/offer/offer";
import ConfirmDelete from '../../../lib/deleteDilog'
import { ModalContext } from "src/lib/context";
import moment from "moment";

const Table = (props) => {
  const Data = props.items;
  let history = useHistory();
  const [showModal, updateShowModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(false);

  const toggleModal = (id) => { updateShowModal(state => !state); setDeleteItemId(id) };

  // *******************Table Headers *****************************

  const fields = [
    { key: "title", label: "Title", },
    { key: "image", label: "Image", },
    { key: "distributors", label: "Distributors", },
    { key: "description", label: "Description", },
    { key: "division", label: "Division", },
    { key: "valid_upto", label: "Valid Upto", },
    { key: "Status", label: "Status", },
    { key: "Edit", label: "", _style: { width: "1%" }, sorter: false, filter: false, },
    { key: "Delete", label: "", _style: { width: "1%" }, sorter: false, filter: false, },
  ];


  // *******************Delete City*****************************

  const deleteItem = async (id) => {
    let rs = await DeleteOffer(id)
    if (rs.success === true) {
      props.deleteItemFromState(id);
      NotificationManager.info("Offer Deleted SuccessFully", "Info", 2000);
    }
    else {
      NotificationManager.error(rs.message, "Info", 2000);
    }
    toggleModal()

  };

  const openDist = (name) => {
    if (name) {
      history.push({
        pathname: `/distributor`,
        name: name,
      });
    }
  };

  return (
    <>
      <CDataTable
        items={Data}
        fields={fields}
        //   columnFilter
        tableFilter
        itemsPerPageSelect
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
          distributors: (item) => {
            return (
              <td className="py-2">
                <p style={{ color: "#0077e8" }}><b>{item.reps.length === 0 ? <Link style={{ color: "#0077e8" }} to={{ pathname: "/distributor", }}><b>ALL DIST</b></Link> :
                  item.reps.map((it) => <>
                    <span onClick={() => openDist(it.name)} style={{ color: "#0077e8", cursor: "pointer" }}>
                      <b> {it.name.toUpperCase()}</b> <br />
                    </span>
                  </>)}</b></p>
              </td>)
          },
          Status: (item) => {
            return (
              <td className="py-2">
                <p><b>{moment(item.valid_upto, "YYYY/MM/DD").isBefore(moment()) ?
                  <span className="badge badge-danger">Expired</span>
                  :
                  <span className="badge badge-success">Active</span>
                }
                </b></p>
              </td>)
          },
          image: (item) => {
            return (
              <td className="py-2">
                { item.image.length > 0 ?
                    item.image.map((it, index) => <img className="grow" src={`${it}`} alt="offers" style={{ height: "50px", width: "50px", marginBottom: "5px" , marginLeft : "5px"}} />)
                    :
                    item.image.map((it, index) => <img className="grow" src={`${it}`} alt="offers" style={{ height: "50px", width: "50px", marginBottom: "5px", marginLeft : "5px" }} />)
                }
              </td>)
          },
          division: (item) => {
            return (
              <td className="py-2">
                <div style={{ color: "rgb(103 127 33)" }}>
                  <b>{item.division.length === 0 ? <b>&nbsp;&nbsp;&nbsp;&nbsp;- -</b> :
                    item.division.map((it) =>
                      <p>
                        {it.name} <br />
                      </p>
                    )}
                  </b>
                </div>
              </td>)
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
