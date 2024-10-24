import React, { useState, useEffect } from 'react';
import '../../CSS Files/Dashboard Components/Goals.css';
import { MdDelete } from "react-icons/md";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { BiSolidPencil } from "react-icons/bi";
import { MdOutlineMenu } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";
import { SlOptions } from "react-icons/sl";
import {Legend} from "recharts";

const GoalsList = ({income, updateEditGoal, openEditModal, openModal, goals, deleteGoal }) => {
    // Use local state to manage goals
    const [filteredGoals, setFilteredGoals] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [allocated, setAllocated] = useState(0)
    const [available, setAvailable] = useState(0)
    const [potentialAlloc, setPotentialAlloc] = useState(null)
    const [allocateDropDown, setAllocateDropDown] = useState(false)
    const [allocateModalShow, setAllocateModalShow] = useState(false)
    const [deallocateModalShow, setDeallocateModalShow] = useState(false)
    const [targetAmount, setTargetAmount] = useState(0)
    const [filtered, setFiltered] = useState(false)
    const [activeGoal, setActiveGoal] = useState(-1)

    // UseEffect to update filtered goals whenever the goals prop or date filters change
    useEffect(() => {

        // if (!filtered) {
        filterGoals();

        console.log("render")
        // setFiltered(true)
        // }

        setAvailable(income)
    }, [goals, startDate, endDate, income, allocated]);

    // Function to filter and sort goals based on start and end dates
    const filterGoals = () => {
        const filtered = goals.filter((goal) => {
            const goalDate = new Date(goal.date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            return (
                (!start || goalDate >= start) &&
                (!end || goalDate <= end)
            );
        });

        // Sort the filtered goals by date in descending order
        const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        setFilteredGoals(sorted);
    };

    // Handle goal edit
    const handleEditGoal = (goal) => {
        updateEditGoal(goal); // Update goal in the parent component
        openEditModal(); // Open the modal for editing the goal
    };

    const allocateMoney = () => {
        let newAllocate = allocated
        newAllocate += potentialAlloc
        if (newAllocate > targetAmount) newAllocate = targetAmount
        setAllocated(newAllocate)
        setPotentialAlloc(null)
        setAllocateDropDown(false)
        setAllocateModalShow(false)
    }

    const deallocateMoney = () => {
        let newAllocate = allocated
        newAllocate -= potentialAlloc
        if (newAllocate < 0) newAllocate = 0
        setAllocated(newAllocate)
        setPotentialAlloc(null)
        setAllocateDropDown(false)
        setDeallocateModalShow(false)
    }

    const openAllocateModal = (goal) => {
        setTargetAmount(parseFloat(goal.cost))
        setAllocateModalShow(true)
    }

    const openDeallocateModal = () => {
        setDeallocateModalShow(true)
    }

    const closeAllocModals = () => {
        setAllocateModalShow(false)
        setDeallocateModalShow(false)
        setPotentialAlloc(null)
        setAllocateDropDown(false)
    }

    const editPotentialAlloc = (e) => {
        setPotentialAlloc(parseFloat(e.target.value))
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

    return (
        <>
            <div className="goals-list">
                <div className="goals-header">
                    <h2>Goals</h2>
                    <button className="add-button" onClick={openModal}>
                        Add Goal
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

                <div className="goals-filter">
                    <div className="date-input-group">
                        <label className="date-label" htmlFor="start-date">Start:</label>
                        <input
                            type="date"
                            id="start-date"
                            className="filter-date"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value)
                                setFiltered(false)
                            }}
                        />
                        <label className="date-label" htmlFor="end-date">End:</label>
                        <input
                            type="date"
                            id="end-date"
                            className="filter-date"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value)
                                setFiltered(false)
                            }}
                        />
                    </div>
                </div>

                <div className="goals-list-content">
                    {filteredGoals.length === 0 ? (
                        <p style={{textAlign: "center", marginTop: "100px", color: "black"}}>Looks like you haven't
                            added
                            any goals yet. <br/>Try <span onClick={openModal} style={{
                                color: "#7984D2",
                                textDecoration: "underline",
                                cursor: "pointer"
                            }}>adding a goal</span></p>
                    ) : (
                        filteredGoals.map((goal) => (
                            <div key={goal.id}>
                                <div className={"goal-items"}>
                                    {/*<span className="icon_button" onClick={() => handleEditGoal(goal)}><BiSolidPencil /></span>*/}
                                    <div className={"goal-item"}>
                                        <span>{goal.name}</span>
                                        <span>{"$" + goal.cost}</span>
                                        <span>{goal.date}</span>
                                        <div className={"allocate_menu_button"}>
                                            {!allocateDropDown ?
                                                <SlOptions className={"allocate_dropdown_btn"}
                                                           onClick={e => openAllocateDropdown(goal.id)}/> :
                                                <IoCloseOutline className={"allocate_dropdown_btn"}
                                                                onClick={closeAllocateDropdown}/>
                                            }
                                            <div>
                                                {allocateDropDown && activeGoal === goal.id &&
                                                    <div className={"allocate_dropdown"}>
                                                        <button className={"allocate_btn"}
                                                                onClick={e => openAllocateModal(goal)}>Allocate
                                                        </button>
                                                        <button className={"deallocate_btn"}
                                                                onClick={openDeallocateModal}>Deallocate
                                                        </button>
                                                        <button onClick={() => handeDelete(goal.id)}
                                                              className={"delete_goal_btn"}>Delete</button>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"goal-item"}>
                                        <ProgressBar className={"goal_progress_bar"}>
                                            <ProgressBar className={"goal_sub_progress_bar progress_bar_a"}
                                                         title={"Allocated: " + allocated} hidden={allocated === 0}
                                                         now={allocated} key={1}/>
                                            <ProgressBar className={"goal_sub_progress_bar progress_bar_b"}
                                                         title={"Available: " + available}
                                                         hidden={available === 0 || allocated >= goal.cost}
                                                         now={available}
                                                         key={2}/>
                                            <ProgressBar className={"goal_sub_progress_bar progress_bar_c"}
                                                         title={"Remaining: " + (goal.cost - available - allocated)}
                                                         hidden={allocated >= goal.cost || (goal.cost - available - allocated) <= 0}
                                                         now={goal.cost - available - allocated} key={3}/>
                                        </ProgressBar>
                                    </div>
                                    <div className={"progress_bar_legend"}>
                                        <div
                                            className={"sub_bar_a_label"}>{"Allocated: "}{(allocated / goal.cost * 100).toFixed(1) + "%"}</div>
                                        <div
                                            className={"sub_bar_b_label"}>{"Available: "}{available > (goal.cost - allocated) ? ((goal.cost - allocated) / goal.cost * 100).toFixed(1) + "%" : (((available) / goal.cost * 100).toFixed(1) + "%")}</div>
                                        <div
                                            className={"sub_bar_c_label"}>{"Remaining: "}{available <= goal.cost ? ((goal.cost - available - allocated) / goal.cost * 100).toFixed(1) + "%":"100%" }</div>
                                    </div>
                                </div>
                                {allocateModalShow &&
                                    <div onClick={closeAllocModals} className={"allocate_modal_container"}>
                                        <div onClick={e => e.stopPropagation()} className={"allocate_modal"}>
                                            <h1>Allocate Towards Goal</h1>
                                            <div className={"allocate_form"}>
                                                <div>{"Goal: " + goal.cost}</div>
                                                <div>{"Available: " + income}</div>
                                                <div>{"Allocated: " + allocated}</div>
                                                <input max={income} value={potentialAlloc || ''} placeholder={"Amount"}
                                                       type={"number"} onChange={editPotentialAlloc}/>
                                                <button onClick={allocateMoney}>Done</button>
                                                <div onClick={closeAllocModals}
                                                     className={"allocate_form_close"}>Cancel
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {deallocateModalShow &&
                                    <div onClick={closeAllocModals} className={"allocate_modal_container"}>
                                        <div onClick={e => e.stopPropagation()} className={"allocate_modal"}>
                                            <h1>Deallocate From Goal</h1>
                                            <div className={"allocate_form"}>
                                                <div>{"Goal: " + goal.cost}</div>
                                                <div>{"Available: " + income}</div>
                                                <div>{"Allocated: " + allocated}</div>
                                                <input max={allocated} value={potentialAlloc || ''}
                                                       placeholder={"Amount"}
                                                       type={"number"}
                                                       onChange={editPotentialAlloc}/>
                                                <button onClick={deallocateMoney}>Done</button>
                                                <div onClick={closeAllocModals}
                                                     className={"allocate_form_close"}>Cancel
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default GoalsList;
