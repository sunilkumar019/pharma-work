import React, { useEffect, useState } from "react";
import { CButton, CDataTable } from "@coreui/react";
import { Col, Container, Row } from "reactstrap";
import { DeleteEnquiry, GetEnquiry } from '../../../api/enquiry/enquiry'
import { NotificationManager } from "react-notifications";
import { IconDelete } from "../../icon/index";
import Page404 from "src/views/pages/page404/Page404";
import ConfirmDelete from '../../../lib/deleteDilog'
import { ModalContext } from "src/lib/context";


// ******************************** Main Function ********************************

const Table = () => {
  const [Data, setData] = useState(null)
  const [update, setUpdate] = useState(false)
  const [loading, setloading] = useState(true)
  const [showModal, updateShowModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(false);

  const toggleModal = (id) => { updateShowModal(state => !state); setDeleteItemId(id) };


  // ------------------ Table Header fields --------------------

  const fields = [
    { key: "name" },
    { key: "phone" },
    { key: "email" },
    { key: "message" },
    { key: "valid_upto", label: 'Created On' },
    { key: "Delete", label: "", sorter: false, filter: false },
  ];


  // ------------------ Delete Function --------------------

  const deleteItem = async (id) => {
    let rs = await DeleteEnquiry(id)
    if (rs.success === true) {
      setUpdate(true)
      NotificationManager.info("Deleted SuccessFully", "Info", 2000);
    }
    else {
      NotificationManager.error(rs.message, "Error", 2000);
    }
    toggleModal()
  };

  // ------------------ Useeffect Function --------------------

  useEffect(() => {
    async function fetchMyAPI() {
      let rs = await GetEnquiry()
      if (rs.success === true) {
        setData(rs.data)
        setloading(false)
      }
    }
    fetchMyAPI()
    if (update) {
      fetchMyAPI()
      setUpdate(false)
    }
  }, [update])

  // ------------------ ( RETURN ) ----------------------------

  return (
    <>
      {loading ? <div className="loader"></div> :
        <Container className="App">
          <div>
            <Row>
              <Col>
                <div className="d-flex bg-light border">
                  <div className="p-2 flex-grow-1">
                    <h5><b>Enquiries</b></h5>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <Row>
            <Col>
              {Data === null || Data.length === 0 ? <Page404 /> :
                <CDataTable
                  items={Data}
                  fields={fields}
                  columnFilter
                  tableFilter
                  itemsPerPage={20}
                  hover
                  sorter
                  pagination
                  scopedSlots={{
                    Delete: (item) => {
                      return (
                        <td className="py-2">
                          <CButton color="danger" size="sm" onClick={() => toggleModal(item.id)}>
                            <IconDelete />
                          </CButton>
                        </td>
                      );
                    },
                  }}
                />
              }
              <ModalContext.Provider value={{ showModal, toggleModal, deleteItem, id: `${deleteItemId}` }}>
                <ConfirmDelete canShow={showModal} updateModalState={toggleModal} />
              </ModalContext.Provider>
            </Col>
          </Row>
        </Container>
      }
    </>
  );
};

export default Table;
