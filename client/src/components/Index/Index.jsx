import Widget from "./Widget";
import WidgetTotal from "./WidgetTotal";

const Index = (props) => {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl leading-tight">Dashboard</h1>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="grid grid-cols-1 lg:grid-1/3 lg:grid-cols-2 gap-10 w-full mb-10">
          <Widget
            title="Western Power Sports"
            link="/products?vendor=WPS"
            data={props.wpsData}
          />
          <Widget
            title="Parts Unlimited"
            link="/products?vendor=PU"
            data={props.puData}
          />
          <Widget
            title="Helmet House"
            link="/products?vendor=HH"
            data={props.hhData}
          />
        </div>
        <div className="w-full lg:w-2/6 lg:ml-10">
          <WidgetTotal data={props.data} />
        </div>
      </div>
    </>
  );
};

export default Index;
