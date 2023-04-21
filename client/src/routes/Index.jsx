import DashboardContainer from "../components/Dashboard/DashboardContainer";
import PuDashboardContainer from "../components/Dashboard/PuDashboardContainer";

const Index = (props) => {
  return (
    <div className="container">
      <div className="flex flex-col lg:flex-row">
        <DashboardContainer />
        {/* <PuDashboardContainer /> */}
      </div>
    </div>
  );
};

export default Index;
