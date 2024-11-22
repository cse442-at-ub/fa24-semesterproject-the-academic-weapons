import {RiCloseLargeLine} from "react-icons/ri";
import React from "react";

const HealthSnapshot = ( { highest, badFine, accountHealth, closeModal } ) => {
    const overSpent = ['Bad', 'Okay', 'Fine']
    const underSpent = ['Fine', 'Good', 'Great']

    console.log(highest)
    console.log(accountHealth)

    return (
        <div onClick={closeModal} className={"edit_background"}>
            <div onClick={e => e.stopPropagation()} className={"health_snapshot_content"}>
                <div className={"health_modal_title_band"}>
                    <h2>Breakdown</h2>
                    <RiCloseLargeLine color={'#8884d8'} onClick={closeModal} size={30} className={"close_modal_button"}/>
                </div>
                <div className={"health_snapshot_data"}>
                    <div className={"health_snapshot_data_item"}>
                        <h3>Monthly Health Score</h3>
                        <div className={"health_breakdown_text"}>
                            {accountHealth === "Bad" &&
                                "Your account health is currently labeled as " +
                                "\"Bad.\" This indicates that you've spent more" +
                                " than your monthly income, which could strain " +
                                "your financial stability. Additionally, you have " +
                                "reached less than 50% of your monthly savings goal, " +
                                "suggesting limited progress toward building a " +
                                "savings buffer. To improve your account health, " +
                                "consider reducing spending to keep it within your " +
                                "income and focusing on meeting your savings targets " +
                                "to strengthen your financial foundation."
                            }
                            {accountHealth === "Okay" &&
                                "Your account health is rated as \"Okay.\" You've " +
                                "spent more than your income this month, which could " +
                                "lead to challenges in maintaining financial stability " +
                                "if it continues. However, you've reached between 50% " +
                                "and 99% of your monthly savings goal, which shows some " +
                                "commitment to saving. To enhance your account health, " +
                                "try to reduce spending to stay within your income and " +
                                "continue working towards fully meeting your " +
                                "monthly savings goal."
                            }
                            {accountHealth === "Fine" && badFine &&
                                "Your account health is \"Fine.\" While you’ve spent more " +
                                "than your income this month, which could be risky over " +
                                "time, you’ve successfully met your monthly savings goal " +
                                "at 100%. This is a positive indicator of your ability to " +
                                "save despite your higher spending. It’s still a good idea " +
                                "to keep an eye on your spending to avoid overspending in " +
                                "the future, as staying within your income can further " +
                                "improve your financial health."
                            }
                            {accountHealth === "Fine" && !badFine &&
                                "Your account health is \"Fine.\" You’ve kept your spending " +
                                "within your income, showing good control over your budget. " +
                                "However, you’ve reached less than 50% of your monthly savings " +
                                "goal, suggesting that there is room for improvement in building " +
                                "your savings. Staying within budget is excellent; focusing on " +
                                "meeting your savings goal more consistently will further support " +
                                "your financial health."
                            }
                            {accountHealth === "Good" &&
                                "Your account health is \"Good.\" You’ve managed to spend less " +
                                "than your monthly income, indicating financial discipline, and " +
                                "you’ve also reached between 50% and 99% of your monthly savings " +
                                "goal. This shows a healthy balance between spending and saving, " +
                                "reflecting positive financial habits. To further improve, aim " +
                                "to fully reach your savings goal and maintain your spending " +
                                "habits."
                            }
                            {accountHealth === "Great" &&
                                "Your account health is \"Great.\" You’ve not only kept your " +
                                "spending within your income but have also fully achieved your " +
                                "monthly savings goal. This shows excellent financial management, " +
                                "balancing expenses and savings effectively. Keep up these " +
                                "habits to maintain strong financial health, as you’re on a great " +
                                "path toward financial security."
                            }
                        </div>
                    </div>
                    <div className={"health_snapshot_data_item"}>
                        <h3>Spending Habits</h3>
                        <div className={"health_breakdown_text"}>
                            {(overSpent.includes(accountHealth) && badFine) &&
                                `Your highest spending category this month is ${highest}. While 
                                it’s natural for certain expenses to take a larger portion of your 
                                budget, focusing on reducing spending in this area, if possible, can 
                                help improve your overall financial health. By making small adjustments 
                                in ${highest}, you may find more room to allocate towards savings 
                                or other financial goals, which can strengthen your budget and boost 
                                your account health in the long run.`
                            }
                            {(underSpent.includes(accountHealth) && !badFine) &&
                                `Great job on keeping your spending within your income this month! 
                                Your highest spending category is ${highest}. While you've managed 
                                your budget well, reducing expenses in ${highest}—if possible—could 
                                free up even more funds to put towards your savings or other financial 
                                goals. Small adjustments here can make a big impact, helping you build 
                                an even stronger financial foundation and ensuring continued financial 
                                stability.`
                            }
                        </div>
                    </div>
                    <div className={"health_snapshot_data_item"}>
                        <h3>Savings Goal</h3>
                        <div className={"health_breakdown_text"}>
                            {(accountHealth === "Bad" || (accountHealth === "Fine" && !badFine)) &&
                                "You’re currently below 50% of your monthly savings goal. While it’s " +
                                "a start, aiming to allocate more towards your goal could help you " +
                                "build a stronger financial cushion. Consider setting aside a bit more " +
                                "each month, even if it’s a small increase. Every contribution counts, " +
                                "and by prioritizing your savings, you’ll be better prepared to achieve " +
                                "larger financial goals over time."
                            }
                            {(accountHealth === "Okay" || accountHealth === "Good") &&
                                "Great progress! You’ve reached more than 50% of your monthly savings goal, " +
                                "which shows a strong commitment to saving. You’re on the right path, and " +
                                "with a little extra focus, you can work toward fully meeting your goal. " +
                                "This consistent effort not only helps you grow your savings but also " +
                                "builds valuable financial habits for the future."
                            }
                            {(accountHealth === "Great" || (accountHealth === "Fine" && badFine)) &&
                                "Congratulations! You’ve reached 100% of your monthly savings goal, " +
                                "demonstrating excellent financial discipline and commitment to your " +
                                "goals. This achievement strengthens your financial security and sets " +
                                "a solid foundation for future planning. Keep up the great work, and " +
                                "consider if you’d like to set additional goals or maintain this " +
                                "impressive level of saving."
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HealthSnapshot