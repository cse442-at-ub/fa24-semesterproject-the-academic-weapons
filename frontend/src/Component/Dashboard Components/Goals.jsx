import React, { useState, useEffect } from 'react';
import '../../CSS Files/Dashboard Components/Goals.css';
import { MdDelete } from "react-icons/md";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { BiSolidPencil } from "react-icons/bi";
import { MdOutlineMenu } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";
import { SlOptions } from "react-icons/sl";
import { MdFilterList } from "react-icons/md";
import { MdFilterListOff } from "react-icons/md";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoIosAdd } from "react-icons/io";
import {Legend} from "recharts";

const GoalsList = ({openEditGoal, setGoalCompletion, saveGoalAllocation, income, updateEditGoal, openModal, goals, deleteGoal }) => {
    // Use local state to manage goals
    const todayDate = new Date().toISOString().substr(0, 10);
    const [filteredGoals, setFilteredGoals] = useState([]);
    const [completedGoals, setCompletedGoals] = useState([])
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [allocateDropDown, setAllocateDropDown] = useState(false)
    const [allocateModalShow, setAllocateModalShow] = useState(false)
    const [deallocateModalShow, setDeallocateModalShow] = useState(false)
    const [activeGoal, setActiveGoal] = useState({})
    const [categoryFilter, setCategoryFilter] = useState('');
    const [goalsPage, setGoalsPage] = useState(0)
    const [filterModal, setFilterModal] = useState(false)
    const top_active = "goals_tabs_container_button_active"
    const top_inactive = "goals_tabs_container_button_inactive"

    useEffect(() => {

        filterGoals();

    }, [goals, startDate, endDate, income, categoryFilter]);

    const filterGoals = () => {
        const filtered = goals.filter((goal) => {
            const goalDate = new Date(goal.date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            return (
                (goal.complete === 0) &&
                (!start || goalDate >= start) &&
                (!end || goalDate <= end) &&
                (!categoryFilter || goal.category.toLowerCase().startsWith(categoryFilter.toLowerCase()))
            );
        });

        const completed = goals.filter((goal) => {
            const goalDate = new Date(goal.date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            return (
                (goal.complete === 1) &&
                (!start || goalDate >= start) &&
                (!end || goalDate <= end) &&
                (!categoryFilter || goal.category.toLowerCase().startsWith(categoryFilter.toLowerCase()))
            );
        });

        const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        setFilteredGoals(sorted);
        setCompletedGoals(completed)
    };

    const handleCategoryFilterChange = (e) => {
        setCategoryFilter(e.target.value); // Update the category filter based on input
    };

    const handleEditGoal = (goal) => {
        updateEditGoal(goal);
        openEditGoal();
    };

    const allocateMoney = (goalID, currentAllocation, goalCost, potentialAlloc) => {
        let newAllocate = parseFloat(currentAllocation)
        newAllocate += parseFloat(potentialAlloc)
        if (newAllocate > parseFloat(goalCost)) {
            newAllocate = parseFloat(goalCost)
        } else if (newAllocate < 0) {
            newAllocate = 0
        }
        setAllocateDropDown(false)
        setAllocateModalShow(false)
        saveGoalAllocation(goalID, newAllocate)
    }

    const deallocateMoney = (goalID, currentAllocation, potentialAlloc) => {
        let newAllocate = parseFloat(currentAllocation)
        newAllocate -= parseFloat(potentialAlloc)
        if (newAllocate < 0) newAllocate = 0
        setAllocateDropDown(false)
        setDeallocateModalShow(false)
        saveGoalAllocation(goalID, newAllocate)
    }

    const openAllocateModal = (goal) => {
        setActiveGoal(goal)
        setAllocateModalShow(true)
    }

    const openDeallocateModal = (goal) => {
        setActiveGoal(goal)
        setDeallocateModalShow(true)
    }

    const closeAllocModals = () => {
        setAllocateModalShow(false)
        setDeallocateModalShow(false)
        setAllocateDropDown(false)
    }

    const openAllocateDropdown = (goal) => {
        setActiveGoal(goal)
        setAllocateDropDown(true)
    }

    const closeAllocateDropdown = () => {
        setActiveGoal(-1)
        setAllocateDropDown(false)
    }

    const handeDelete = (id) => {
        closeAllocateDropdown()
        deleteGoal(id)
    }

    const handleGoalCompletion = (goalID, completion, date) => {
        setGoalCompletion(goalID, completion, date)
    }

    const openFilterModal = () => {
        setFilterModal(true)
    }

    const closeFilterModal = () => {
        setFilterModal(false)
    }

    const AllocateModal = ({ goal }) => {
        const [potentialAlloc, setPotentialAlloc] = useState(null)

        const editPotentialAlloc = (e) => {
            setPotentialAlloc(e.target.value)
        }

        return (
            <div onClick={closeAllocModals} className={"allocate_modal_container"}>
                <div onClick={e => e.stopPropagation()} className={"allocate_modal"}>
                    <h1>Allocate Towards Goal</h1>
                    <div className={"allocate_form"}>
                        <div>{"Goal: " + goal.cost}</div>
                        <div>{"Allocated: " + goal.allocated}</div>
                        <input value={potentialAlloc || ''}
                               placeholder={"Amount"}
                               type={"number"} onChange={e => editPotentialAlloc(e)}/>
                        <button
                            onClick={e => allocateMoney(goal.id, goal.allocated, goal.cost, potentialAlloc)}>Done
                        </button>
                        <div onClick={closeAllocModals}
                             className={"allocate_form_close"}>Cancel
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const DeallocateModal = ( { goal } ) => {
        const [potentialAlloc, setPotentialAlloc] = useState(null)

        const editPotentialAlloc = (e) => {
            setPotentialAlloc(e.target.value)
        }

        return (
            <div onClick={closeAllocModals} className={"allocate_modal_container"}>
                <div onClick={e => e.stopPropagation()} className={"allocate_modal"}>
                    <h1>Deallocate From Goal</h1>
                    <div className={"allocate_form"}>
                        <div>{"Goal: " + goal.cost}</div>
                        <div>{"Allocated: " + goal.allocated}</div>
                        <input value={potentialAlloc || ''}
                               placeholder={"Amount"}
                               type={"number"}
                               onChange={e => editPotentialAlloc(e)}/>
                        <button
                            onClick={e => deallocateMoney(goal.id, goal.allocated, potentialAlloc)}>Done
                        </button>
                        <div onClick={closeAllocModals}
                             className={"allocate_form_close"}>Cancel
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <>
            <div className="goals-list">
                <div className="goals-header">
                    <h2>Goals</h2>
                    <div className={"goals_header_buttons"}>
                        <IoIosAdd className={"add_goal_button"} onClick={openModal}/>
                        <div className={"goals_filter_buttons_modal_container"}>
                            {!filterModal ?
                                <>
                                    {startDate !== '' || endDate !== '' || categoryFilter !== '' ?
                                        <MdFilterListOff onClick={openFilterModal} className={"goals_filter_button"}/> :
                                        <MdFilterList onClick={openFilterModal} className={"goals_filter_button"}/>
                                    }
                                </> :
                                <IoCloseOutline className={"goals_filter_button"} onClick={closeFilterModal}/>
                            }
                        </div>
                    </div>
                </div>
                <div className={"goals_filter_modal_container"}>
                    {filterModal &&
                        <div className="goals-filter">
                            <div className="date-input-group">
                                <label className="date-label" htmlFor="start-date">Start Date</label>
                                <input
                                    type="date"
                                    id="start-date"
                                    className="filter-date"
                                    value={startDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value)
                                    }}
                                />
                            </div>
                            <div className="date-input-group">
                                <label className="date-label" htmlFor="end-date">End Date</label>
                                <input
                                    type="date"
                                    id="end-date"
                                    className="filter-date"
                                    value={endDate}
                                    onChange={(e) => {
                                        setEndDate(e.target.value)
                                    }}
                                />
                            </div>
                            <div className="category-filter-group">
                                <label className="date-label" htmlFor="end-date">Category</label>
                                <div className={"category_clear_group"}>
                                    <input
                                        type="text"
                                        id="category-filter"
                                        className="goals-filter_input"
                                        value={categoryFilter}
                                        onChange={handleCategoryFilterChange}
                                        autoComplete="off"
                                        placeholder="ex. Car"
                                    />
                                    {categoryFilter !== '' &&
                                        <IoIosCloseCircleOutline className={"goals_filter_button"}
                                                                 onClick={e => setCategoryFilter('')}/>
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className={"goals_tabs_container"}>
                    <div onClick={e => setGoalsPage(0)}
                         className={goalsPage === 0 ? top_active : top_inactive}>Active
                    </div>
                    <div onClick={e => setGoalsPage(1)}
                         className={goalsPage === 1 ? top_active : top_inactive}>Completed
                    </div>
                </div>
                {goalsPage === 0 ?
                    <div className="goals-list-content">
                        {filteredGoals.length === 0 ? (
                            <p className={"no_content_text"}>Looks like you haven't
                                added
                                any goals yet. <br/>Try <span onClick={openModal} style={{
                                    color: "#7984D2",
                                    textDecoration: "underline",
                                    cursor: "pointer"
                                }}>adding a goal</span></p>
                        ) : (
                            filteredGoals.map((goal, index) => (
                                <div key={index}>
                                    <div className={"goal-items"}>
                                        {/*<span className="icon_button" onClick={() => handleEditGoal(goal)}><BiSolidPencil /></span>*/}
                                        <div className={"goal-item"}>
                                            <div className={"allocate_menu_button"}>
                                                {allocateDropDown && activeGoal.id === goal.id ?
                                                    <IoCloseOutline className={"allocate_dropdown_btn"}
                                                                    onClick={closeAllocateDropdown}/> :
                                                    <SlOptions className={"allocate_dropdown_btn"}
                                                               onClick={e => openAllocateDropdown(goal)}/>
                                                }
                                                <div className={"allocate_dropdown_container"}>
                                                    {allocateDropDown && activeGoal.id === goal.id &&
                                                        <div className={"allocate_dropdown"}>
                                                            <button className={"allocate_btn"}
                                                                    onClick={e => openAllocateModal(goal)}>Allocate
                                                            </button>
                                                            <button className={"deallocate_btn"}
                                                                    onClick={e => openDeallocateModal(goal)}>Deallocate
                                                            </button>
                                                            <button className={"edit_goal_button"} onClick={e => handleEditGoal(goal)}>
                                                                Edit
                                                            </button>
                                                            <button onClick={() => handeDelete(goal.id)}
                                                                    className={"delete_goal_btn"}>Delete
                                                            </button>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            <span>{goal.name}</span>
                                            <span>{"$" + goal.cost}</span>
                                            <span onClick={e => setCategoryFilter(goal.category)}
                                                  className={"goal_category"}>{goal.category}</span>
                                            <span>{goal.date}</span>
                                        </div>
                                        <div className={"goal-item"}>
                                            <ProgressBar className={"goal_progress_bar"}>
                                                <ProgressBar onClick={e => openDeallocateModal(goal)}
                                                             className={"goal_sub_progress_bar progress_bar_a"}
                                                             title={"Click to deallocate"} hidden={goal.allocated === 0}
                                                             now={goal.allocated} key={1}/>
                                                <ProgressBar onClick={e => openAllocateModal(goal)}
                                                             className={"goal_sub_progress_bar progress_bar_c"}
                                                             title={"Click to allocate"}
                                                             now={((goal.cost - goal.allocated))}
                                                             key={2}/>
                                            </ProgressBar>
                                        </div>
                                        <div className={"progress_bar_legend"}>
                                            {goal.allocated / goal.cost !== 1 ?
                                                <div
                                                    className={"sub_bar_a_label"}>{"Allocated: $"}{goal.allocated}</div> :
                                                <div className={"sub_bar_a_label"}>{"Allocated: $" + goal.cost}</div>
                                            }
                                            {goal.cost - goal.allocated !== 0 ?
                                                <div
                                                    className={"sub_bar_c_label"}>{"Remaining: $"}{parseFloat(goal.cost) - parseFloat(goal.allocated)}</div> :
                                                <button className={"complete_goal_button"}
                                                        onClick={e => handleGoalCompletion(goal.id, 1, todayDate)}>Move
                                                    to
                                                    Completed</button>
                                            }
                                        </div>
                                    </div>
                                    {allocateModalShow &&
                                        <AllocateModal goal={activeGoal} />
                                    }
                                    {deallocateModalShow &&
                                        <DeallocateModal goal={activeGoal} />
                                    }
                                </div>
                            ))
                        )}
                    </div> :
                    <div className="goals-list-content">
                        {completedGoals.length === 0 ? (
                            <p className={"no_content_text"}>Looks like you haven't
                                completed any goals yet.</p>
                        ) : (
                            completedGoals.map((goal) => (
                                <div key={goal.id}>
                                    <div className={"goal-items"}>
                                        <div className={"goal-item"}>
                                            <div className={"allocate_menu_button"}>
                                                {allocateDropDown && activeGoal.id === goal.id ?
                                                    <IoCloseOutline className={"allocate_dropdown_btn"}
                                                                    onClick={closeAllocateDropdown}/> :
                                                    <SlOptions className={"allocate_dropdown_btn"}
                                                               onClick={e => openAllocateDropdown(goal)}/>
                                                }
                                                <div>
                                                    {allocateDropDown && activeGoal.id === goal.id &&
                                                        <div className={"allocate_dropdown"}>
                                                            <button onClick={() => handeDelete(goal.id)}
                                                                    className={"delete_goal_btn"}>Delete
                                                            </button>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            <span>{goal.name}</span>
                                            <span>{"$" + goal.cost}</span>
                                            <span className={"goal_category"} onClick={e => setCategoryFilter(goal.category)}>{goal.category}</span>
                                            <span>{goal.date}</span>
                                        </div>
                                        <div className={"progress_bar_legend"}>
                                            <div
                                                className={"progress_bar_legend_text"}>{"Date Completed: "}{goal.completed_date}</div>
                                            <button className={"complete_goal_button"}
                                                    onClick={e => handleGoalCompletion(goal.id, 0, null)}>Move to Active
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                }
            </div>
        </>
    );
};

export default GoalsList;
