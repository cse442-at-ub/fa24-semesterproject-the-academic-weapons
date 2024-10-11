import React, {useEffect, useState} from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import '../../CSS Files/Dashboard Components/MainPieChart.css';
import SubPieChart from './SubPieChart.jsx';

const colors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#E7E9ED",
    "#FFCD56", "#4D5360", "#A3E4D7", "#F1948A", "#C39BD3", "#7FB3D5", "#73C6B6",
    "#F7DC6F", "#F0B27A", "#A569BD", "#5DADE2", "#48C9B0", "#F4D03F", "#F5B041",
    "#EB984E", "#AAB7B8", "#85C1E9", "#F5CBA7", "#52BE80", "#AF7AC5", "#D98880",
    "#D2B4DE", "#D7DBDD", "#58D68D", "#FAD7A0", "#D5F5E3", "#D0ECE7", "#A9CCE3",
    "#F8C471", "#F9E79F", "#B03A2E", "#1F618D", "#117A65", "#F39C12", "#CB4335",
    "#2E86C1", "#D4E6F1", "#148F77", "#52BE80", "#A3E4D7", "#E59866", "#C39BD3",
    "#BB8FCE", "#5D6D7E"
];

const MainPieChart = ( { transactions } ) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [data, setData] = useState([]);
    const [subData, setSubData] = useState({});
    const [highest, setHighest] = useState('')
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {


        if (data.length === 0) {
            totalsByCategory(transactions)
            transactionsByCategory(transactions)
        }

        if (data.length > 0) {
            const highestCat = getHighestCategory(data)
            setHighest(highestCat.name)
        }

    }, [transactions, data])


    function getHighestCategory(totals) {
        return totals.reduce((highest, category) => {
            return (category.value > highest.value) ? category : highest;
        }, totals[0]); // Start with the first category as the highest
    }

    const totalsByCategory = (inputTransactions) => {
        let categorized = inputTransactions.reduce((acc, transaction) => {
            const {category, price} = transaction;

            // Find existing category in the accumulator
            let categoryObj = acc.find(obj => obj.name === category);

            // If category does not exist, create it
            if (!categoryObj) {
                categoryObj = {name: category, value: 0};
                acc.push(categoryObj);
            }

            // Add the price to the existing category value
            categoryObj.value += parseFloat(price);

            return acc;
        }, []);
        setData(categorized)
    }

    const transactionsByCategory = (inputTransactions) => {
        let categorized = inputTransactions.reduce((acc, transaction) => {
            const {category, ...rest} = transaction;

            // Rename 'price' to 'value'
            const renamedTransaction = {...rest, value: parseFloat(transaction.price)};
            delete renamedTransaction.price; // Remove 'price'

            // Initialize the category array if it doesn't exist
            if (!acc[category]) {
                acc[category] = [];
            }

            // Push the renamed transaction into the appropriate category
            acc[category].push(renamedTransaction);

            return acc;
        }, {});
        setSubData(categorized)
    }

    const handleClick = (data) => {
        setSelectedCategory(data.name); // Set the clicked category name
    };

    return (
        <div className="chart-container"> {/* Add a fixed container */}
            <h2 className="Category_spend_txt">Categorized Spending</h2>
                <div>
                    {!selectedCategory ? (
                            <>
                                <PieChart width={280} height={400}>
                                    <Pie
                                        data={data}
                                        cx={140}
                                        cy={140}
                                        labelLine={false}
                                        outerRadius={90}
                                        fill="#ffffff"
                                        dataKey="value"
                                        onClick={(e) => handleClick(e)} // Pass event data
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={colors[index]}/>
                                        ))}
                                    </Pie>
                                    <Legend width={280}/>
                                    <Tooltip/>
                                </PieChart>
                                <h3 className="Category_spend_txt">{"Highest Category: " + highest}</h3>
                            </>
                        )
                        :
                        (
                            <SubPieChart subData={subData}
                                         category={selectedCategory}
                                         onBack={() => setSelectedCategory(null)} // Back to main chart
                            />
                        )}</div>
        </div>

    );
};

export default MainPieChart;