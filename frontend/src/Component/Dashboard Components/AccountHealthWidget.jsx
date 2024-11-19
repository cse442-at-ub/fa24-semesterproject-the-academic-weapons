import GaugeChart from 'react-gauge-chart'
import {useState} from "react";

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

const AccountHealthWidget = ( ) => {
    const [accountHealth, setAccountHealth] = useState("Okay")
    const healthLabel = healthLabelMap[accountHealth]
    const healthMeter = healthMeterMap[accountHealth]


    return (
        <div className={"account_health_widget"}>
            <div className={"account_health_widget_content"}>
                <h2 className={"account_health_title"}>Monthly Health</h2>
                <div className={"account_health_gauge_content"}>
                    <GaugeChart
                        hideText={true}
                        nrOfLevels={5}
                        colors={["#FF5F6D", "#FFA863", "#FFF968", "#B7FF6D", "#71FF73"]}
                        percent={healthMeter}
                    />
                    <div className={"account_health_gauge_label "+healthLabel}>{accountHealth}</div>
                    <div className={"account_health_snapshot_button_container"}>
                        <button className={"account_health_snapshot_button"}>View Snapshot</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountHealthWidget;