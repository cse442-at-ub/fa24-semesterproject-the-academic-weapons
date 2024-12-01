import GaugeChart from 'react-gauge-chart'
import React, {useEffect, useState} from "react";
import HealthSnapshot from "../HealthSnapshot.jsx";

const healthLabelMap = {
    "Bad": "bad_health",
    "Okay": "okay_health",
    "Fine": "fine_health",
    "Good": "good_health",
    "Great": "great_health"
}

const healthMeterMap = {
    "Bad": .10,
    "Okay": .30,
    "Fine": .50,
    "Good": .70,
    "Great": .90
}

const AccountHealthWidget = ( { transactions, savingsGoal, income, spent } ) => {
    const [showModal, setShowModal] = useState(false)
    const [badFine, setBadFine] = useState(false)
    const [highest, setHighest] = useState('')
    const [isLoaded, setIsLoaded] = useState(false)
    const [accountHealth, setAccountHealth] = useState("Fine")
    const healthLabel = healthLabelMap[accountHealth]
    const healthMeter = healthMeterMap[accountHealth]

    useEffect(() => {

        if (transactions.length > 0 && !isLoaded) {
            totalsByCategory(transactions);
            setIsLoaded(true);
        }

    }, [transactions])

    function getHighestCategory(totals) {
        return totals.reduce((highest, category) => {
            return (category.value > highest.value) ? category : highest;
        }, totals[0]); // Start with the first category as the highest
    }

    const totalsByCategory = (inputTransactions) => {
        let categorized = inputTransactions.reduce((acc, transaction) => {
            const { category, price } = transaction;

            // Find existing category in the accumulator
            let categoryObj = acc.find(obj => obj.name === category);

            // If category does not exist, create it
            if (!categoryObj) {
                categoryObj = { name: category, value: 0 };
                acc.push(categoryObj);
            }

            // Add the price to the existing category value
            categoryObj.value += parseFloat(price);

            return acc;
        }, []);

        // Calculate and set the highest category
        if (categorized.length > 0) {
            const highestCat = getHighestCategory(categorized);
            setHighest(highestCat.name);
        }
    };


    const openModal = () => {
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
    }

    const calculateHealth = () => {
        // console.log("Spent: "+spent)
        // console.log("Income: "+income)
        // console.log("Savings Goal: "+savingsGoal)
        if (spent >= income && parseInt(savingsGoal) < 50) {
            setAccountHealth("Bad")
            setBadFine(true)
        } else if (spent >= income && parseInt(savingsGoal) >= 50 && parseInt(savingsGoal) < 100) {
            setAccountHealth("Okay")
            setBadFine(true)
        } else if (spent >= income && parseInt(savingsGoal) === 100) {
            setAccountHealth("Fine")
            setBadFine(true)
        } else if (spent < income && parseInt(savingsGoal) < 50) {
            setAccountHealth("Fine")
        } else if (spent < income && parseInt(savingsGoal) >= 50 && parseInt(savingsGoal) < 100) {
            setAccountHealth("Good")
        } else if (spent < income && parseInt(savingsGoal) === 100) {
            setAccountHealth("Great")
        }
    }

    useEffect(() => {

        calculateHealth()

    }, [income, spent, savingsGoal])



    return (
        <div className={"account_health_widget"}>
                <div className={"account_health_widget_content"}>
                    <h2 className={"account_health_title"}>Monthly Health</h2>
                    {(spent > 0 && income > 0) ?
                        <div className={"account_health_gauge_content"}>
                            <GaugeChart
                                hideText={true}
                                nrOfLevels={5}
                                colors={[
                                    // "#FF5F6D",
                                    // "#FFA863",
                                    // "#FFF968",
                                    // "#B7FF6D",
                                    // "#71FF73",
                                    "#c2c2c6",
                                    "#d0d0df",
                                    "#c2c1dd",
                                    "#a8a6d6",
                                    "#8884d8",
                                ]}
                                percent={healthMeter}
                            />
                            <div className={"account_health_gauge_label " + healthLabel}>{accountHealth}</div>
                            <div className={"account_health_snapshot_button_container"}>
                                <button onClick={openModal} className={"account_health_snapshot_button"}>View
                                    Breakdown
                                </button>
                            </div>
                        </div> :
                        <p className={"no_content_text"}>Not enough data to calculate health.</p>
                    }
                </div>
            {showModal &&
                <HealthSnapshot highest={highest} badFine={badFine} accountHealth={accountHealth} closeModal={closeModal} />
            }
        </div>
    );
};

export default AccountHealthWidget;