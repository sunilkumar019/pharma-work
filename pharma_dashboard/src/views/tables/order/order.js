import {useEffect, useState} from "react";
import { CButton, CDataTable } from "@coreui/react";
import { IconDelete } from "../../icon";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { Link, useHistory } from "react-router-dom";
import {DeleteOrder, DeleteOrders} from "src/api/orders/orders";
import ConfirmDelete from '../../../lib/deleteDilog'
import { ModalContext } from "src/lib/context";
import IconClear from "../../icon/icon-clear";

const Table = (props) => {
    const Data = props.items;
    let history = useHistory();
    const [showModal, updateShowModal] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(false);
    const [itemMap, setItemMap] = new useState(new Map())
    const [title, setTitle] = useState('')


    const toggleModal = (id, title) => {
        updateShowModal(state => !state);
        setTitle(title);
        setDeleteItemId(id)
    };

    const onCheckHandlerChange = (e) => {
        const checked = e.target.checked;
        if(checked)
            setItemMap(itemMap.set(e.target.value, checked))
        else
            itemMap.delete(e.target.value)
    }

    useEffect( () => {
        return () => {
            setItemMap(null)
            setDeleteItemId(false)
            updateShowModal(false)
        }
    }, [])


// *******************Table Headers *****************************

    const fields = [
        { key: "checkbox", label: <div className={'d-flex'}>
                <button title='Selected Delete' className={'btn btn-sm btn-primary p-2'} onClick={() => toggleModal("selected", null)} style={{borderRadius: "20px"}}><IconDelete />      </button>
                <button title="Clear All" className={'btn btn-sm btn-primary p-2'} onClick={() => toggleModal('all', "Do you want to clear all items permanently?")} style={{borderRadius: "20px"}}><IconClear />      </button>
            </div>},
        { key: "rep_name", label: "Distributor",  },
        { key: "Products", label: "Products and Quantity",  },
        { key: "created_on", label: "Created On",  },
        { key: "Delete", label: "", _style: { width: "1%" }, sorter: false,filter: false,},
    ];


// *******************Delete City*****************************

    const deleteItem = async (id) => {
        let rs;
        let orderIds = '';
        if(id === 'selected') {
            if(!itemMap.size){
                return NotificationManager.info("Please selected at least 1 order", 2000);
            }
            itemMap.forEach((value, key) => orderIds += key+',')
            rs = await DeleteOrders(id, { orderIds: orderIds.substring(0, orderIds.length - 1)});
        } else if(id === 'all') {
            rs = await DeleteOrders(id, orderIds);
        } else {
            rs = await DeleteOrder(id)
        }
        if (rs.success === true){
            props.deleteItemFromState(id);
            NotificationManager.info("Deleted SuccessFully", "Info", 2000);
        }
        else{
            NotificationManager.error(rs.message, "Info", 2000);
        }
        toggleModal()
    };

    const openDist = (name) => {
        if (name) {
            history.push({
                pathname: `/product`,
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
                selectable
                scopedSlots={{
                    checkbox: (item) => {
                        return <td>
                            <input type={'checkbox'} value={item.id} onChange={onCheckHandlerChange} style={{ transform: "scale(1.3)" }}/>
                        </td>
                    },
                    rep_name : (item) => {
                        return (
                            <td className="py-2">
                                <p className="p_name">{item.rep_name}</p>
                            </td>
                        )
                    },
                    Products	: (item) => {
                        return (
                            <td className="py-2">
                                { item.orderlist.length && item.orderlist.map((it) =>
                                    <div className={'p-0 m-0'}>
                                        <div className="course">
                                            <div className="course-preview">
                                            </div>
                                            {it && <div className="course-info">
                                                <p className="p_name"><i className="fad p_icon fa-cart-plus"></i> &nbsp;{it.product.name.toUpperCase()}</p>
                                                <p  className="p_quantity"><i className="fad p_icon fa-balance-scale"></i>&nbsp; Quantity : {it.product.min_order_qty}</p>
                                                <p className="p_info">{it.product.division_name}</p>
                                                <Link onClick={()=> openDist(it.product.name)} style={{color:"#0085ba", letterSpacing:"0.4px"}}>
                                                    <button className="btn-product"><span style={{fontSize : "14px"}}><i className="fad fa-box-full"></i>&nbsp;View Product</span></button>
                                                </Link>
                                            </div>}
                                        </div>
                                    </div>
                                )}
                            </td>)
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
            <ModalContext.Provider value={{ showModal, title, toggleModal, deleteItem, id: `${deleteItemId}` }}>
                <ConfirmDelete title={title} canShow={showModal} updateModalState={toggleModal} />
            </ModalContext.Provider>
        </>
    );
};

export default Table;
