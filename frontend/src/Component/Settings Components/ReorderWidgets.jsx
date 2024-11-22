import React, {useEffect, useState} from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";


const ReorderWidgets = ( { closeModal, setWidgetOrder, widgetOrder } ) => {
    const defaultOrder = [
        'Categorized Spending',
        'Monthly Spending',
        'Transactions',
        'Income Report',
        'Goals',
        'Monthly Health'
    ]
    const [newOrder, setNewOrder] = useState(
        widgetOrder && Array.isArray(widgetOrder) && widgetOrder.length > 0 ? widgetOrder : defaultOrder
    );

    const handleMoveUp = (index) => {
        if (index === 0) return; // First item, no need to move up
        let newList = [...newOrder];
        [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
        setNewOrder(newList);
    }

    const handleMoveDown = (index) => {
        if (index === newOrder.length - 1) return; // Last item, no need to move down
        let newList = [...newOrder];
        [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
        setNewOrder(newList);
    }

    const handleSave = () => {
        if (newOrder.length === 0) setWidgetOrder(defaultOrder)
        else setWidgetOrder(newOrder)
        closeModal()
    }

    return (
        <div onClick={closeModal} className={"change_background"}>
            <div onClick={event => event.stopPropagation()} className={"change_modal_container"}>
                <div className={"change_modal_title_desc_container"}>
                    <h2>Reorder Widgets</h2>
                </div>
                <div className={"change_form"}>
                    {newOrder.map((widget, index) => (
                        <div className={"widget_reorder_group"} key={widget}>
                            <div>{widget}</div>
                            <div className={"widget_reorder_buttons"}>
                                <button onClick={e => handleMoveUp(index)}><IoIosArrowUp/></button>
                                <button onClick={e => handleMoveDown(index)}><IoIosArrowDown/></button>
                            </div>
                        </div>
                    ))}
                    <button onClick={handleSave} className={"save_widgets_button"}>Save</button>
                </div>
                <div className={"change_cancel"} onClick={closeModal}>Cancel</div>
            </div>
        </div>
    );
}

export default ReorderWidgets